import sys
import os
import subprocess
import threading
import time
import numpy as np
from fastapi import WebSocket
from multiprocessing import Queue
from services.regex_utils import has_unclosed_parenthesis, has_unclosed_bracket, has_indented_statement, extract_indented_statement, replace_svg_mobjects
from services.async_utils import run_cor
from services.llm_clients import anthropic_client
from services.scenes import BlankScene


class ManimGenerator:
    def __init__(self, websocket: WebSocket):
        self.start_time = time.time()
        self.commands = []
        self.websocket = websocket
        self.stop_commands = []
        self.running = False
        self.frame_queue = Queue()

        self.system_prompt = """You are an AI teacher. 
    
        Generate Manim code that generates a 10-15 second animation that directly illustrates the user prompt.
        Do not output any other text than the Manim code.
        Do not import manim or any other libraries.
        
        Follow these guidelines for the Manim code:
        1. Only generate the content of the construct() method, but do not include the first line "def construct(self):".
        2. You are using the OpenGL renderer. Never use the .to_edge() method. Instead use the .shift() method.
        3. Use self.play() for each animation step to ensure proper sequencing.
        4. Clear or transform previous content before introducing new elements.
        6. Use FadeOut() or similar animations to remove objects no longer needed.
        7. Do not ever use wait()
        8. DO NOT ever use SVGMobject 
        9. DO NOT reference any external static assets -- including images, SVGs, videos, or audio files.
        10. Use shapes, text, and animations that can be generated purely with manim code.
        11. Ensure that the animation aligns perfectly with the text response. 
        12. Do not include ANY comments or any unnecessary newlines in the code.
        13. Do not use any LIGHT color variants such as LIGHT_BLUE, LIGHT_GREEN, LIGHT_RED, etc. And never use BROWN.
        """
        #
        # 14. DO NOT USE FOR LOOPS. EVER. DO NOT EVEN THINK ABOUT IT.
        # 13. DO NOT USE LIST COMPREHENSIONS SUCH AS [Circle(radius=d, color=WHITE, stroke_opacity=0.5).shift(LEFT * 5) for d in planet_distances]. EVER. DO NOT EVEN THINK ABOUT IT.
        #

        self.frame_rate = 30

    def run_scene(self):
        print('INFO: Instantiate BlankScene at', time.time() - self.start_time)
        scene = BlankScene(self.frame_queue, self.commands, dimensions=(1920/2, 1080/2), frame_rate=self.frame_rate, start_time=self.start_time, debug_mode=False)
        print('INFO: BlankScene instantiated at', time.time() - self.start_time)
        scene.render()
        print('INFO: EVERYTHING completed at', time.time() - self.start_time)

    def generate(self, text):
        first_byte_received = False
        start_time = time.time()
        print("INFO: making anthropic call", flush=True)
        with anthropic_client.messages.stream(
            model="claude-3-5-sonnet-20240620",
            max_tokens=4000,
            system=self.system_prompt,
            messages=[
                {"role": "user", "content": text}
            ],
        ) as stream:
            with open('log.txt', 'w') as log_file:
                cur_chunk = ""
                for chunk in stream.text_stream:
                    if not first_byte_received:
                        first_byte_received = True
                        end_time = time.time()
                        print(f"INFO: first chunk received from anthropic at {end_time - start_time} seconds", flush=True)

                    if '\n' in chunk:
                        chunks = chunk.split('\n')
                        cur_chunk += '\n'.join(chunks[:-1]) + '\n'
                        if has_unclosed_parenthesis(cur_chunk) or has_unclosed_bracket(cur_chunk) or has_indented_statement(cur_chunk):
                            cur_chunk += chunks[-1]

                            # Determine whether to add indented statement
                            if has_indented_statement(cur_chunk):
                                extracted = extract_indented_statement(cur_chunk)
                                if len(extracted) > 2:
                                    # Add the all the text execept for last two elements because 
                                    # regex selector selects first character of the last line,
                                    # i.e. "self.play()" becomes ["s", "elf.play()"]
                                    self.commands.append(''.join(extracted[:-2]))
                                    cur_chunk = ''.join(extracted[-2:])

                            continue
                        # cur_chunk = replace_list_comprehensions(cur_chunk)
                        cur_chunk = replace_svg_mobjects(cur_chunk)
                        self.commands.append(cur_chunk)
                        cur_chunk = chunks[-1]
                    else:
                        cur_chunk += chunk
                    
                    log_file.write(chunk)
                
            self.commands.append(cur_chunk)

        # self.commands.append("\nself.wait(5)\n")
        # time.sleep(5)
        self.commands.append("")

    def send_frames_to_ffmpeg(self):
        while self.running or not self.frame_queue.empty():
            try:
                if not self.frame_queue.empty():
                    frame = self.frame_queue.get_nowait()
                    rgb_image = frame.convert('RGB')
                    numpy_image = np.array(rgb_image)
                    rgb24_frame = np.ascontiguousarray(numpy_image, dtype=np.uint8)
                    if self.ffmpeg_process is None:
                        print("INFO: ffmpeg_process is None", flush=True)
                    self.ffmpeg_process.stdin.write(rgb24_frame.tobytes())
                    self.ffmpeg_process.stdin.flush()
                else:
                    time.sleep(1/self.frame_rate)
                    # print("self.frame_queue empty", flush=True)
            except Exception as e:
                print(f"Error in send_frames_to_stdout: {e}", file=sys.stderr)
                break
        self.ffmpeg_process.stdin.close()

    def convert_to_hls(self, output_dir):
        output_dir_str = str(output_dir)
        os.makedirs(output_dir, exist_ok=True)
        ffmpeg_command = [
            'ffmpeg',
            '-y',
            '-f', 'rawvideo',
            '-vcodec', 'rawvideo',
            '-pix_fmt', 'rgb24',
            '-s', '960x540',
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
            # '-hls_list_size', '5',
            # '-hls_flags', 'delete_segments+append_list',
            '-hls_segment_type', 'mpegts',
            '-hls_segment_filename', os.path.join(output_dir_str, 'stream%03d.ts'),
            os.path.join(output_dir_str, 'playlist.m3u8')
        ]
        ffmpeg_process = subprocess.Popen(
            ffmpeg_command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        return ffmpeg_process


    def log_ffmpeg_output(self, process, run_started_time, output_dir):
        async def emit_ready_message(websocket):
            await websocket.send_json({
                "type": "hls_ready", 
                "playlistUrl": f"http://localhost:8000/{output_dir}/playlist.m3u8"
            })
            
        def read_stream(stream):
            hls_ready = False
            for line in iter(stream.readline, b''):
                line = line.decode().strip()
                print(f"FFmpeg {stream.name}: {line}", flush=True)
                if "Opening" in line and not hls_ready:
                    hls_ready = True
                    print(f'SENDING HLS READY in {time.time() - run_started_time} seconds', flush=True)
                    # executes async function in event loop
                    run_cor(emit_ready_message(self.websocket))
                    
        threading.Thread(target=read_stream, args=(process.stderr,), daemon=True).start()
        threading.Thread(target=read_stream, args=(process.stdout,), daemon=True).start()


    def run(self, text, output_dir: str):
        run_started_time = time.time()
        print(f"INFO: running generator in {time.time() - run_started_time} seconds", flush=True)
        try:
            self.running = True

            generate_thread = threading.Thread(target=self.generate, args=(text,), daemon=True)
            send_frames_thread = threading.Thread(target=self.send_frames_to_ffmpeg, daemon=True)
            generate_thread.start()

            print(f"INFO: starting ffmpeg in {time.time() - run_started_time} seconds", flush=True)
            self.ffmpeg_process = self.convert_to_hls(output_dir)
            self.log_ffmpeg_output(self.ffmpeg_process, run_started_time, output_dir)
            send_frames_thread.start()

            print(f"INFO: running scene in {time.time() - run_started_time} seconds", flush=True)
            self.run_scene()
            print('scene done', flush=True)
            self.running = False

            generate_thread.join()
            send_frames_thread.join()
            self.ffmpeg_process.wait()
            self.cleanup()

        except Exception as e:
            print(f"Error in generator.run: {e}")
    

    def cleanup(self):
        if self.ffmpeg_process is not None:
            self.ffmpeg_process.stdin.close()
            self.ffmpeg_process.wait()
            
        print("Generator cleaned up")
    
    

if __name__ == "__main__":
    print("INFO:Starting python script")
    
    if len(sys.argv) > 1:
        # print('prompt provided', sys.argv[1])
        prompt = sys.argv[1]
    else:
        # print("No prompt provided")
        prompt = "how are babies made?"
    
    generator = ManimGenerator()
    generator.run(prompt)