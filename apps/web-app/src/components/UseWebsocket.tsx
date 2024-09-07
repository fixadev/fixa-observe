import { useEffect, useRef, useCallback } from "react";

export type SocketHook = (url: string) => {
  sendMessage: (message: string) => void;
  socket: WebSocket;
};

export function useWebSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    wsRef.current = new WebSocket(url);

    wsRef.current.onmessage = async (event: MessageEvent) => {
      if (typeof event.data === "string") {
        console.log("socket message", event.data);
      } else {
        console.error("Received non-string data from WebSocket");
      }
    };

    wsRef.current.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed. Attempting to reconnect...");
      setTimeout(connectWebSocket, 3000);
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      console.log("WebSocket readyState:", wsRef.current?.readyState);
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  return { sendMessage, socket: wsRef.current };
}
