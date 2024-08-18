import { useState, useRef, useCallback, useEffect } from 'react';

// Define constants for video configuration
const MIME_TYPE = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
const RECORDING_DURATION = 5000; // 5 seconds

export const useMediaSource = (socket: WebSocket | null) => {
  // State variables
  const [isRecording, setIsRecording] = useState(false);
  const [isMediaSourceReady, setIsMediaSourceReady] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const mediaSource = useRef<MediaSource | null>(null);
  const sourceBuffer = useRef<SourceBuffer | null>(null);

  // Refs for managing video and data
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const dataQueue = useRef<ArrayBuffer[]>([]);
  const initialBufferRef = useRef<ArrayBuffer[]>([]);
  
  const processQueue = useCallback(() => {
    if (!sourceBuffer.current || sourceBuffer.current.updating || dataQueue.current.length === 0) {
      console.log('Process queue condition not met, skipping');
      return;
    }
    console.log('Processing queue:', dataQueue.current);
    const nextChunk = dataQueue.current.shift();
    if (nextChunk) {
      if (nextChunk.byteLength === 3 && new TextDecoder().decode(nextChunk) === 'EOF') {
        console.log('EOF received, ending stream');
        if (mediaSource.current?.readyState === 'open') {
          mediaSource.current.endOfStream();
        } else {
          console.warn('Cannot end stream, MediaSource is not open');
        }
      } else if (mediaSource.current?.readyState === 'open' && sourceBuffer.current && !sourceBuffer.current.updating) {
        try {
          console.log('Appending chunk to source buffer:', nextChunk);
          sourceBuffer.current.appendBuffer(nextChunk);
          
          // Check if we have enough data buffered to start playback
          if (videoRef.current && videoRef.current.buffered.length > 0) {
            const bufferedSeconds = videoRef.current.buffered.end(0) - videoRef.current.buffered.start(0);
            if (bufferedSeconds >= 1 && !canPlay) { // Adjust the threshold as needed
              setCanPlay(true);
            }
          }
        } catch (error) {
          console.error('Error appending buffer:', error);
          // Handle specific errors, e.g., QuotaExceededError
        }
      } else {
        console.log('MediaSource state:', mediaSource.current?.readyState);
        console.log('SourceBuffer exists:', !!sourceBuffer.current);
        console.log('SourceBuffer updating:', sourceBuffer.current?.updating);
        // Re-queue the chunk if conditions aren't met
        console.log('Re-queueing chunk:', nextChunk);
        dataQueue.current.unshift(nextChunk);
      }
    }
    // Schedule next queue processing
    // Only schedule next processing if MediaSource is still open
    if (mediaSource.current?.readyState === 'open') {
        setTimeout(processQueue, 0);
    } else {
        console.warn('MediaSource is not open, stopping queue processing');
    }
  }, [canPlay]);

  // Set up MediaSource and SourceBuffer
  useEffect(() => {
    console.log('Setting up MediaSource and SourceBuffer');
    const ms = new MediaSource();
    mediaSource.current = ms;

    const handleSourceOpen = () => {
      try {
        const sb = ms.addSourceBuffer(MIME_TYPE);
        sourceBuffer.current = sb;
        sb.addEventListener('updateend', processQueue);
        setIsMediaSourceReady(true);
        
        // Process any initial buffers
        initialBufferRef.current.forEach(buffer => dataQueue.current.push(buffer));
        initialBufferRef.current = [];
        processQueue();
      } catch (error) {
        console.error('Error adding source buffer:', error);
      }
    };

    ms.addEventListener('sourceopen', handleSourceOpen);

    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(ms);
    }

    return () => {
      ms.removeEventListener('sourceopen', handleSourceOpen);
      if (ms.readyState === 'open') {
        ms.endOfStream();
      }
    };
  }, []); // Empty dependency array

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('canplay', () => {
        console.log('Video can start playing');
        videoRef.current?.play().catch(e => console.error('Error playing video:', e));
      });
    }

    return () => {
      videoRef.current?.removeEventListener('canplay', () => {});
    };
  }, []);

  useEffect(() => {
    if (canPlay && videoRef.current) {
      videoRef.current.play().catch(e => console.error('Error playing video:', e));
    }
  }, [canPlay]);

  // Function to start audio recording
  const startRecording = useCallback(async () => {
    if (!socket) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: Blob[] = [];

    mediaRecorder.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks);
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          socket.send(reader.result);
        }
      };
    });

    mediaRecorder.start();
    setIsRecording(true);

    setTimeout(() => {
      mediaRecorder.stop();
      setIsRecording(false);
    }, RECORDING_DURATION);
  }, [socket]);

  // Function to handle incoming WebSocket messages
  const handleWebSocketMessage = useCallback(async (event: MessageEvent) => {
    console.log('WebSocket message received:', event);
    try {
      if (event.data instanceof Blob) {
        console.log('Blob received:', event.data);
        const arrayBuffer = await event.data.arrayBuffer();
        if (isMediaSourceReady) {
          console.log('Media source ready, pushing data to queue:', arrayBuffer);
          dataQueue.current.push(arrayBuffer);
          processQueue();
        } else {
          console.log('Media source not ready, buffering data:', arrayBuffer);
          initialBufferRef.current.push(arrayBuffer);
        }
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }, [isMediaSourceReady, processQueue]);

  // Return necessary values and functions
  return {
    videoRef,
    isMediaSourceReady,
    isRecording,
    startRecording,
    handleWebSocketMessage
  };
};