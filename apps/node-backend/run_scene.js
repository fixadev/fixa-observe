import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import path from 'path';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FRAME_DELIMITER = '==END_FRAME==';

export function runScene(prompt, socket) {
    return new Promise((resolve, reject) => {
      const pythonScriptPath = path.resolve(__dirname, '../backend/services/generate_manim_2.py');
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

      let buffer = '';
  
      pythonProcess.stdout.on('data', (data) => {
        
        const output = data.toString();
        buffer += output;
        if (output.includes(FRAME_DELIMITER)) {
          const frame = buffer.split(FRAME_DELIMITER)[0];
          socket.emit('scene_progress', frame );
          console.log('sent frame')
          buffer = buffer.slice(buffer.indexOf(FRAME_DELIMITER) + FRAME_DELIMITER.length);
        } 
        else if (output.includes('EOF')) {
          socket.emit('scene_progress', 'EOF');
          console.log('sent EOF')
        } else if (output.includes('INFO')){
          if (!first_byte_received) {
          first_byte_received = true;
          console.log(`Received first log from python process in ${new Date().getTime() - start_time} ms: ${output}`);
          } else {
            console.log(`Received data from python process in ${new Date().getTime() - start_time} ms: ${output}`);
          }

        }
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
  