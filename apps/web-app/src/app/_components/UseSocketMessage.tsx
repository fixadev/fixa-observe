import { useEffect } from "react";
import { io } from "socket.io-client";
import { env } from "~/env";
import { type SocketMessage } from "~/lib/agent";

const useSocketMessage = (
  userId?: string,
  handleMessage?: (message: SocketMessage) => void,
) => {
  useEffect(() => {
    const socket = io(env.NEXT_PUBLIC_SOCKET_URL ?? "");

    socket.on("connect", () => {
      console.log("CONNECTED TO SOCKET");
      socket.emit("register", userId);
    });

    socket.on("message", (message: string) => {
      console.log("MESSAGE", message);
    });

    socket.on("call-ended", (message: SocketMessage) => {
      console.log("CALL ENDED", message);
      handleMessage?.(message);
    });

    return () => {
      socket.disconnect();
      console.log("DISCONNECTED FROM SOCKET");
    };
  }, [userId, handleMessage]);

  return;
};

export default useSocketMessage;
