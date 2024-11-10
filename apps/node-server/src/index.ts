import express, { Request, Response } from "express";
import { createServer } from "http";
import SocketManager from "./socket/socketManager";
import { handleVapiCallEnded } from "./services/handleVapiCalEnded";

const app = express();
const httpServer = createServer(app);
const socketManager = new SocketManager(httpServer);
export { socketManager };

// Middleware
app.use(express.json());

// Routes
app.get("/health", (_, res: Response) => res.json({ status: "ok" }));

app.post("/vapi", (req: Request, res: Response) => {
  const { message } = req.body;
  console.log("VAPI WEBHOOK RECEIVED", req.body);
  if (message.type === "end-of-call-report") {
    handleVapiCallEnded(message);
  }
  res.json({ success: true });
});

app.post("/message/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  const { event, data } = req.body;
  socketManager.sendMessageToUser(userId, event, data);
  res.json({ success: true });
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
