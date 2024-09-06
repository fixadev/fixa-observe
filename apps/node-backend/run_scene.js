import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import path from 'path';
import { dirname } from 'path';
import fs from 'fs';


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

      const outputDir = path.join(__dirname, 'public', 'hls');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      pythonProcess.stdout.on('data', (data) => {
        const decodedData = data.toString('utf-8').trim();
        console.log('FFmpeg stdout:', decodedData);
        if (data.toString().includes('Opening')) {
          console.log('HLS ready');
          socket.emit('hls_ready', '/hls/playlist.m3u8');
        }
      });

      pythonProcess.stderr.on('data', (data) => {
        console.log(`\FFmpeg Stderr: ${data}`);
        if (data.toString().includes('Opening')) {
          console.log('HLS ready');
          socket.emit('hls_ready', '/hls/playlist.m3u8');
        }
        if (data.toString().includes('EOF')) {
          socket.emit('video_end', 'EOF');
          console.log('Sent EOF');
        }
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
