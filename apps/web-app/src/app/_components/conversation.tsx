"use client";
import React, { useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useMediaSource } from '../hooks/useMediaSource';

const MIME_TYPE = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
const RECORDING_DURATION = 5000; // 5 seconds

const AITeacher = () => {
  const { socket, isConnected } = useWebSocket();
  const {
    videoRef,
    isMediaSourceReady,
    isRecording,
    startRecording,
    handleWebSocketMessage
  } = useMediaSource(socket);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = handleWebSocketMessage;
    socket.onerror = (error) => console.error('WebSocket error:', error);

    return () => {
      socket.onmessage = null;
      socket.onerror = null;                
    };
  }, [socket, handleWebSocketMessage]);

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <video ref={videoRef} width="640" height="480" controls autoPlay />
      <button 
        className='bg-blue-500 text-white p-2 rounded-md' 
        onClick={startRecording} 
        disabled={isRecording || !isConnected || !isMediaSourceReady}
      >
        {isRecording ? 'Recording...' : (isConnected ? 'Start Recording' : 'Connecting...')}
      </button>
    </div>
  );
};

export default AITeacher;