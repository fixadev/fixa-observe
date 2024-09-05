import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import path from 'path';
import { dirname } from 'path';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FRAME_DELIMITER = '==END_FRAME==';
const DATA_URI_PREFIX = 'raw_bytes:,';

export function runScene(prompt, socket) {
    return new Promise((resolve, reject) => {
      const pythonScriptPath = path.resolve(__dirname, '../backend/services/generate_manim_js.py');
      const pythonPath = path.resolve(__dirname, '../backend');

      let first_byte_received = false;
      let start_time = new Date().getTime();
      console.log(`Initializing python process`, start_time);
      
      const pythonProcess = spawn('python', [pythonScriptPath, prompt], {
        env: {
          ...process.env,
          PYTHONPATH: `${process.env.PYTHONPATH || ''}:${pythonPath}`
        }
      });

      const ffmpegProcess = spawn('ffmpeg', [
        '-y',
        '-f', 'rawvideo',
        '-pix_fmt', 'argb',
        '-s', '960x540',
        // '-framerate', '30', 
        '-i', '-',
        '-c:v', 'libx264',
        '-profile:v', 'baseline',
        '-level:v', '3',
        '-b:v', '2500',
        'pipe:1'
      ]);

      ffmpegProcess.stdout.on('data', (data) => {
        console.log('FFmpeg stdout', data);
        socket.emit('video_data', data);
      });

      ffmpegProcess.stderr.on('data', (data) => {
        console.log(`FFmpeg Stderr: ${data}`);
      });


      pythonProcess.stdout.on('data', (data) => {
        console.log('Python stdout', data);
        const bytes = Buffer.from(data.toString(), 'hex');
        ffmpegProcess.stdin.write(bytes);

        if (output.includes('EOF')) {
          frameStream.push(null);
          socket.emit('scene_progress', 'EOF');
          console.log('Sent EOF');
        } 
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
        socket.emit('pythonOutput', { type: 'stderr', data: data.toString() });
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          const error = new Error(`Python process exited with code ${code}`);
          socket.emit('pythonOutput', { type: 'error', data: error.message });
          reject(error);
        } else {
          socket.emit('pythonOutput', { type: 'complete', data: code });
          resolve();
        }
      });
    });
  }
