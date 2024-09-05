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

      const ffmpegProcess = spawn('ffmpeg', [
        '-y',
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-pix_fmt', 'rgb24',
        '-s', '960x540',
        // '-framerate', '30', 
        '-i', '-',
        '-c:v', 'libx264', 
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-bufsize', '1M',
        '-maxrate', '2M',
        '-g', '30',
        '-f', 'hls',
        '-hls_init_time', '0.5',
        '-hls_time', '1',
        '-hls_list_size', '5',
        '-hls_flags', 'delete_segments+append_list',
        '-hls_segment_type', 'mpegts',
        '-hls_segment_filename', path.join(outputDir, 'stream%03d.ts'),
        path.join(outputDir, 'playlist.m3u8')
      ]);
 

      pythonProcess.stdout.pipe(ffmpegProcess.stdin);

      ffmpegProcess.stdout.on('data', (data) => {
        console.log('FFmpeg stdout=', data);

        socket.emit('video_data', data);
      });

      ffmpegProcess.stderr.on('data', (data) => {
        console.log(`\FFmpeg Stderr: ${data}`);
        if (data.toString().includes('Opening')) {
          socket.emit('hls_ready', '/hls/playlist.m3u8');
        }
        if (data.toString().includes('EOF')) {
          socket.emit('video_end', 'EOF');
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
