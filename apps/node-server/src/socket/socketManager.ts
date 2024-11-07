import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { Socket } from "socket.io";
class SocketManager {
  private io: SocketIOServer;
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: "*", // Configure appropriately for production
        methods: ["GET", "POST"],
      },
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log("New client connected:", socket.id);

      // Handle user authentication/registration
      socket.on("register", (userId: string) => {
        this.userSockets.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        // Remove user from mapping
        for (const [userId, socketId] of this.userSockets.entries()) {
          if (socketId === socket.id) {
            this.userSockets.delete(userId);
            console.log(`User ${userId} disconnected`);
            break;
          }
        }
      });
    });
  }

  // Function to send message to specific user
  public sendMessageToUser(userId: string, event: string, data: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      console.log(`Message sent to user ${userId} for event ${event}`);
    } else {
      console.log(`User ${userId} not found or not connected`);
    }
  }

  // Function to broadcast to all connected users
  public broadcast(event: string, data: any) {
    this.io.emit(event, data);
    console.log(`Broadcast message sent for event ${event}`);
  }

  // Get all connected user IDs
  public getConnectedUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }
}

export default SocketManager;
