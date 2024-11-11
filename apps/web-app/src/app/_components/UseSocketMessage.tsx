import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { env } from "~/env";

const useSocketMessage = (userId?: string) => {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const socket = io(env.NEXT_PUBLIC_SOCKET_URL ?? "");

    socket.on("connect", () => {
      console.log("CONNECTED TO SOCKET");
      socket.emit("register", userId);
    });

    socket.on("message", (message) => {
      console.log("MESSAGE RECEIVED", message);
      setTriggered(true);
    });

    return () => {
      socket.disconnect();
      console.log("DISCONNECTED FROM SOCKET");
    };
  }, [userId]);

  return { triggered, setTriggered };
};

export default useSocketMessage;
