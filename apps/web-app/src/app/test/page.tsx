"use client";
import React, { useEffect, useRef, useState } from "react";

const ManimStream: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [message, setMessage] = useState<string>(
    "Show the solar system with the sun in the center and the planets orbiting the sun at different speeds.",
  );
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket("wss://pixa.ngrok.dev/ws");

      wsRef.current.onmessage = (event: MessageEvent) => {
        if (typeof event.data === "string") {
          setImageSrc(`data:image/jpeg;base64,${event.data}`);
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
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
      setMessage("");
    }
  };
  const testBackend = async () => {
    try {
      const response = await fetch("https://pixa.ngrok.dev/", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      console.log("response", response);
      const data = await response.json();
      console.log("data", data);
    } catch (error) {
      console.error("Error testing backend:", error);
    }
  };

  return (
    <div>
      <h2>Manim Output</h2>
      {imageSrc ? (
        <img src={imageSrc} alt="Manim animation" />
      ) : (
        <p>Waiting for Manim output...</p>
      )}
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={testBackend}>Test Backend</button>
      </div>
    </div>
  );
};

export default ManimStream;
