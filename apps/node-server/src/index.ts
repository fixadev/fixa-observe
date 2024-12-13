import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { env } from "./env";
import { startQueueConsumer } from "./workers/queueConsumer";
import v1Router from "./routes/v1";
import { authenticateRequest } from "./middlewares/auth";
import vapiRouter from "./routes/v1/vapi";

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
      // console.log(`User ${userId} disconnected`);
    }
  });
});

app.get("/", (req, res) => {
  res.send("ollo");
});

// TODO: authenticate vapi requests
app.use("/vapi", vapiRouter);

app.use(authenticateRequest);

// temporary before 11x migration
app.use("/", v1Router);
app.use("/v1", v1Router);

// global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// Server setup with unified cleanup
const PORT = process.env.PORT || 3003;
const cleanup = () => {
  httpServer.close(() => {
    console.log("Server closed");
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
