import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { runScene } from './run_scene.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('dirname', __dirname);
console.log('filename', __filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST']
  }
});


app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if (req.path.endsWith('.m3u8')) {
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (req.path.endsWith('.ts')) {
      res.setHeader('Content-Type', 'video/mp2t');
      res.setHeader('Cache-Control', 'no-cache');
    }
    
    // Add CORS headers if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });


app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/hls/*', (req, res, next) => {
    const filePath = path.join(__dirname, 'public', req.path);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(`Error sending file: ${filePath}`, err);
        next(err);
      }
    });
  });

const wsNamespace = io.of('/ws');

wsNamespace.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('run_scene', (prompt) => {
    console.log(`Received run_scene event with prompt: ${prompt}`);
    runScene(prompt, socket);
  });
});

server.listen(PORT, () => {
    console.log(`Node server is running on port ${PORT}`);
});