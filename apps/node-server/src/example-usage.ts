import { socketManager } from "./index";

// Send message to specific user
function notifyUser(userId: string, message: string) {
  socketManager.sendMessageToUser(userId, "notification", {
    message,
  });
}

// Broadcast to all users
function broadcastUpdate(data: any) {
  socketManager.broadcast("update", data);
}
