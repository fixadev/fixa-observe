import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { runScene } from './run_scene.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Server is running');
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  socket.on('run_scene', (prompt) => {
    runScene(prompt, socket);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
