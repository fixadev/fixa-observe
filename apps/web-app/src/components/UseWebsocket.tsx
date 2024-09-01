import { useState, useEffect, useRef, useCallback } from "react";

export function useWebSocket(url: string) {
  const [data, setData] = useState<{ imageSrc: string | null; isEOF: boolean }>(
    {
      imageSrc: null,
      isEOF: false,
    },
  );
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    wsRef.current = new WebSocket(url);

    wsRef.current.onmessage = (event: MessageEvent) => {
      if (typeof event.data === "string") {
        if (event.data === "EOF") {
          setData({ imageSrc: null, isEOF: true });
        } else {
          setData({
            imageSrc: `data:image/jpeg;base64,${event.data}`,
            isEOF: false,
          });
        }
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

  return { data, sendMessage };
}
