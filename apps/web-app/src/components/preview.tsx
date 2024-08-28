"use client";
import React, { useEffect, useRef, useState } from "react";

const Preview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: Blob[] = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks);
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        if (socket && reader.result) {
          if (typeof reader.result === "string") {
            socket.send(reader.result);
          } else {
            console.error("Unexpected result type from FileReader");
          }
        } else {
          console.error("Socket is null or FileReader result is null");
        }
      };
    });

    mediaRecorder.start();
    setIsRecording(true);

    setTimeout(() => {
      mediaRecorder.stop();
      setIsRecording(false);
    }, 5000); // Record for 5 seconds
  };

  const sendManualMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send("teach me about physics");
    } else {
      console.error("WebSocket is not open");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        if (typeof event.data === "string") {
          // Audio response
          if (audioRef.current) {
            audioRef.current.src = `data:audio/mp3;base64,${event.data}`;
            audioRef.current.play();
          }
        } else {
          // Video response
          const videoBlob = new Blob([event.data], { type: "video/mp4" });
          const videoUrl = URL.createObjectURL(videoBlob);
          if (videoRef.current) {
            videoRef.current.src = videoUrl;
            videoRef.current.play();
          }
        }
      };
    }
  }, [socket]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <audio ref={audioRef} />
      <video ref={videoRef} width="640" height="480" controls />
      <button
        className="mt-4 rounded-md bg-blue-500 p-2 text-white"
        onClick={startRecording}
        disabled={isRecording}
      >
        {isRecording ? "Recording..." : "Start Recording"}
      </button>
      <button
        className="mt-2 rounded-md bg-green-500 p-2 text-white"
        onClick={sendManualMessage}
      >
        Send Manual Message
      </button>
    </div>
  );
};

export default Preview;
