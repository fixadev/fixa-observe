import express, { Request, Response } from "express";
import { createServer } from "http";
import SocketManager from "./socket/socketManager";

const app = express();
const httpServer = createServer(app);

// Create socket manager instance
const socketManager = new SocketManager(httpServer);

// Export for use in other parts of the application
export { socketManager };

// Basic health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Example endpoint that sends a message to a specific user
app.post("/message/:userId", express.json(), (req: Request, res: Response) => {
  const { userId } = req.params;
  const { event, data } = req.body;

  socketManager.sendMessageToUser(userId, event, data);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
