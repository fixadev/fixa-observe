import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { handleVapiCallEnded } from "./services/handleVapiCallEnded";
import { handleTranscriptUpdate } from "./services/handleTranscriptUpdate";
import { handleAnalysisStarted } from "./services/handleAnalysisStarted";
import { db } from "./db";
import { uploadCallToDB } from "./services/uploadCallToDB";
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
  // console.log("Received message", message);
  if (message.type === "end-of-call-report") {
    const analysisStarted = await handleAnalysisStarted(message);
    if (analysisStarted) {
      const userSocket = connectedUsers.get(analysisStarted.userId);
      if (userSocket) {
        userSocket.emit("message", {
          type: "analysis-started",
          data: {
            testId: analysisStarted.testId,
            callId: analysisStarted.callId,
          },
        });
      }
    }
    const result = await handleVapiCallEnded(message);
    if (result) {
      const userSocket = connectedUsers.get(result.ownerId);
      if (userSocket) {
        userSocket.emit("message", {
          type: "call-ended",
          data: {
            testId: result.testId,
            callId: result.callId,
            call: result.call,
          },
        });
      }
    }
  } else if (message.type === "transcript") {
    const result = await handleTranscriptUpdate(message);
    if (result) {
      const userSocket = connectedUsers.get(result.userId);
      if (userSocket) {
        userSocket.emit("message", {
          type: "messages-updated",
          data: {
            callId: result.callId,
            testId: result.testId,
            messages: result.messages,
          },
        });
      } else {
        console.error("No user socket found for userId", result.userId);
      }
    }
  }
  res.json({ success: true });
});

app.post("/upload-call", async (req: Request, res: Response) => {
  try {
    const { callId, location } = req.body;
    const result = await uploadCallToDB(callId, location);
    res.json({ success: true, muizz: "the man" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: (error as Error).message });
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

app.get("/db", async (_, res: Response) => {
  const result = await db.testAgent.findMany();
  res.json({ result });
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
