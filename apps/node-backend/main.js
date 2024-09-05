import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { runScene } from './run_scene.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST']
  }
});

app.use(cors());

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Server is running');
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