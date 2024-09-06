import { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export function useSocketIO(url: string) {
  const [data, setData] = useState<{ imageSrc: string | null }>({
    imageSrc: null,
  });
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = useCallback(() => {
    console.log(`Attempting to connect to SocketIO at URL: ${url}`);
    const newSocket = io(url, {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("SocketIO connection opened.");
    });

    newSocket.on("disconnect", () => {
      console.log("SocketIO connection closed. Attempting to reconnect...");
    });

    newSocket.on("error", (error) => {
      console.error("SocketIO error:", error);
    });

    newSocket.on("scene_progress", (message: string) => {
      console.log(`Received scene_progress: ${message.substring(0, 20)}...`);
      if (message === "EOF") {
        console.log("Received EOF, resetting imageSrc");
        setData({ imageSrc: null });
      } else {
        console.log("Updating imageSrc with new data");
        setData({
          imageSrc: message,
        });
      }
    });

    setSocket(newSocket);
  }, [url]);

  const sendMessage = useCallback(
    (message: string) => {
      if (socket?.connected) {
        console.log(`Sending message: ${message}`);
        socket.emit("run_scene", message);
      } else {
        console.warn("Cannot send message: socket is not connected");
      }
    },
    [socket],
  );

  useEffect(() => {
    console.log("Setting up SocketIO connection");
    connectSocket();

    return () => {
      if (socket) {
        console.log("Disconnecting SocketIO");
        socket.disconnect();
      }
    };
  }, [connectSocket]);

  return { sendMessage, socket };
}
