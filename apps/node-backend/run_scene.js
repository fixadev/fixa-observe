import { spawn } from 'child_process';

export function runScene(prompt, socket) {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', ['../backend/services/generate_manim_2.py', prompt]);
  
      pythonProcess.stdout.on('data', (data) => {
        socket.emit('scene_progress', data.toString());
      });
  
      pythonProcess.stderr.on('data', (data) => {
        const errorOutput = data.toString();
        console.error(`Python Error: ${errorOutput}`);
        // Emit error output to the socket
        socket.emit('pythonOutput', { type: 'stderr', data: errorOutput });
      });
  
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          const error = new Error(`Python process exited with code ${code}`);
          socket.emit('pythonOutput', { type: 'error', data: error.message });
          reject(error);
        } else {
          socket.emit('pythonOutput', { type: 'complete', data: fullOutput });
          resolve(fullOutput);
        }
      });
    });
  }
  