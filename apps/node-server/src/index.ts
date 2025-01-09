import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { env } from "./env";
import { startQueueConsumer } from "./workers/queueConsumer";
import { privateRouter } from "./routers/v1/private";
import { publicRouter } from "./routers/v1/public";
import { posthogClient } from "./clients/posthogClient";
import { logFailedRequests } from "./middlewares/logFailedRequests";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logFailedRequests);

export const connectedUsers = new Map();

io.on("connection", (socket) => {
  let userId: string | null = null;

  socket.on("register", (newUserId) => {
    userId = newUserId;
    connectedUsers.set(userId, socket);
    console.log(`User ${userId} registered`);
    console.log("audio service url", env.AUDIO_SERVICE_URL);
  });

  socket.on("disconnect", () => {
    if (userId) {
      connectedUsers.delete(userId);
    }
  });
});

app.get("/", (req, res) => {
  res.send("ollo");
});

app.use("/internal", privateRouter);
app.use("/", publicRouter);
app.use("/v1", publicRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3003;
const cleanup = () => {
  httpServer.close(async () => {
    console.log("Server closed");
    await posthogClient.shutdown();
    process.exit(0);
  });
};

["SIGINT", "SIGTERM", "SIGUSR2"].forEach((signal) => {
  process.on(signal, cleanup);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startQueueConsumer();
});
