import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { env } from "~/env";

const useSocketMessage = (userId?: string) => {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const socket = io(env.NEXT_PUBLIC_SOCKET_URL ?? "");

    socket.on("connect", () => {
      socket.emit("register", userId);
    });

    socket.on("message", (message) => {
      setTriggered(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return { triggered, setTriggered };
};

export default useSocketMessage;
