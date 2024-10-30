import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", headers: "*" }));

// Store connected sockets by userId
const connectedUsers = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket);
    console.log(`User ${userId} registered`);
  });

  socket.on("disconnect", () => {
    // Remove user from connected users
    for (const [userId, sock] of connectedUsers.entries()) {
      if (sock === socket) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Webhook endpoint for sending messages
app.post("/api/message", (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "userId and message are required" });
  }

  const userSocket = connectedUsers.get(userId);
  if (userSocket) {
    console.log(`Sending message to user ${userId}: ${message}`);
    userSocket.emit("message", message);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "User not connected" });
  }
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
