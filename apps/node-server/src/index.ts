import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { handleVapiCallEnded } from "./services/handleVapiCallEnded";
import { handleTranscriptUpdate } from "./services/handleTranscriptUpdate";
import { handleAnalysisStarted } from "./services/handleAnalysisStarted";
import { db } from "./db";
import { getContext } from "./services/getContext";
import { addCallToQueue } from "./services/addCallToQueue";
import { startQueueConsumer } from "./workers/queueConsumer";
import { authenticateRequest } from "./middlewares/auth";
import { scheduleOfOneCalls } from "./services/scheduleOfOneCalls";

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
  let userId: string | null = null;

  socket.on("register", (newUserId) => {
    userId = newUserId;
    connectedUsers.set(userId, socket);
    // console.log(`User ${userId} registered`);
  });

  socket.on("disconnect", () => {
    if (userId) {
      connectedUsers.delete(userId);
      // console.log(`User ${userId} disconnected`);
    }
  });
});

// Middleware
app.use(express.json());

// Routes
app.get("/health", (_, res: Response) => res.json({ status: "ok" }));

app.post("/vapi", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (message.type === "end-of-call-report") {
      console.log("Received end of call report for call", message.call.id);
      const context = await getContext(message.call.id, connectedUsers);
      if (!context) {
        console.error("No context found for call", message.call.id);
        return;
      }
      const { userSocket, agent, scenario, test, call } = context;
      await handleAnalysisStarted(message, userSocket);
      await handleVapiCallEnded({
        report: message,
        call,
        agent,
        test,
        scenario,
        userSocket,
      });
    } else if (message.type === "transcript") {
      await handleTranscriptUpdate(message, connectedUsers);
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.post(
  "/upload-call",
  // authenticateRequest,
  async (req: Request, res: Response) => {
    try {
      const { callId, location, agentId, regionId, metadata, createdAt } =
        req.body;
      const missingFields = [];
      if (!callId) missingFields.push("callId");
      if (!location) missingFields.push("location");
      // if (!agentId) missingFields.push("agentId");
      // if (!regionId) missingFields.push("regionId");
      // add comment to redeploy
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }
      await addCallToQueue({
        callId,
        location,
        agentId,
        regionId,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
        // userId: res.locals.userId,
        userId: "11x",
        metadata,
      });
      res.json({ success: true, muizz: "the man" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  },
);

app.post("/queue-ofone-kiosk-calls", async (req: Request, res: Response) => {
  try {
    const { deviceIds, callsToStart } = req.body;
    const scheduledCalls = await scheduleOfOneCalls(
      deviceIds,
      callsToStart,
      connectedUsers,
    );
    res.json({ success: true, scheduledCalls });
  } catch (error) {
    console.error("Error scheduling OFONE calls", error);
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
  startQueueConsumer();
});
