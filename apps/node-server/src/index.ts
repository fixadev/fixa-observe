import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { handleVapiCallEnded } from "./services/handleVapiCallEnded";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store connected sockets by userId
const connectedUsers = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected");

  let userId: string | null = null;

  socket.on("register", (newUserId) => {
    userId = newUserId;
    connectedUsers.set(userId, socket);
    console.log(`User ${userId} registered`);
  });

  socket.on("disconnect", () => {
    if (userId) {
      connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  });
});

// Middleware
app.use(express.json());

// Routes
app.get("/health", (_, res: Response) => res.json({ status: "ok" }));

app.post("/vapi", async (req: Request, res: Response) => {
  const { message } = req.body;
  if (message.type === "end-of-call-report") {
    const result = await handleVapiCallEnded(message);

    if (result) {
      const userSocket = connectedUsers.get(result.ownerId);
      if (userSocket) {
        console.log("Emitting call-ended to user", result.ownerId);
        userSocket.emit("call-ended", {
          testId: result.testId,
          callId: result.callId,
          call: result.call,
        });
      }
    }
  }
  res.json({ success: true });
});

app.post("/message", (req: Request, res: Response) => {
  const { userId, event, data } = req.body;
  const userSocket = connectedUsers.get(userId);
  if (userSocket) {
    userSocket.emit(event, data);
  }
});

app.post("/message/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  const { event, data } = req.body;
  const userSocket = connectedUsers.get(userId);
  if (userSocket) {
    userSocket.emit(event, data);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "User not connected" });
  }
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
});
