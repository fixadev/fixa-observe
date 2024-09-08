import sys
import os
import subprocess
import threading
import time
import numpy as np
from multiprocessing import Queue
from services.regex_utils import has_unclosed_parenthesis, has_unclosed_bracket, has_indented_statement, extract_indented_statement, replace_svg_mobjects
from services.async_utils import run_cor
from services.llm_clients import anthropic_client
from services.scenes import BlankScene
from config import BASE_URL


class ManimGenerator:
    def __init__(self, output_queue):
        self.start_time = time.time()
        self.commands = []
        self.output_queue = output_queue
        self.stop_commands = []
        self.running = False
        self.frame_queue = Queue()
        self.frame_width = 960
        self.frame_height = 540
        self.frame_rate = 30

        self.system_prompt = """You are an AI teacher. 
    
        Generate Manim code that generates a 10-15 second animation that directly illustrates the user prompt.
        Do not output any other text than the Manim code.
        Do not import manim or any other libraries.
        Do not include ANY comments (i.e. lines that start with #) 
        Do not include unnecessary newlines in the code.
        ALWAYS start your code with a self.play() call.
        
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
        12. Do not use any LIGHT color variants such as LIGHT_BLUE, LIGHT_GREEN, LIGHT_RED, etc. And never use BROWN.
        """
        #
        # 14. DO NOT USE FOR LOOPS. EVER. DO NOT EVEN THINK ABOUT IT.
        # 13. DO NOT USE LIST COMPREHENSIONS SUCH AS [Circle(radius=d, color=WHITE, stroke_opacity=0.5).shift(LEFT * 5) for d in planet_distances]. EVER. DO NOT EVEN THINK ABOUT IT.
        #

        

    def run_scene(self):
        print('INFO: Instantiate BlankScene at', time.time() - self.start_time)
        scene = BlankScene(self.frame_queue, self.commands, dimensions=(self.frame_width, self.frame_height), frame_rate=self.frame_rate, start_time=self.start_time, debug_mode=False)
        print('INFO: BlankScene instantiated at', time.time() - self.start_time)
        scene.render()
        print('INFO: EVERYTHING completed at', time.time() - self.start_time)

    def generate(self, text, start_time):
        first_byte_received = False
        first_command_ready = False
        print("INFO: making anthropic call", flush=True)
        with anthropic_client.messages.stream(
            model="claude-3-5-sonnet-20240620",
            max_tokens=4000,
            system=self.system_prompt,
            messages=[
                {"role": "user", "content": text}
            ],
        ) as stream:
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
                    if not first_command_ready:
                        first_command_ready = True
                        print(f"INFO: first command ready at {time.time() - start_time} seconds", flush=True)
                    cur_chunk = chunks[-1]
                else:
                    cur_chunk += chunk
                
            self.commands.append(cur_chunk)

        # self.commands.append("\nself.wait(5)\n")
        # time.sleep(5)
        self.commands.append("")

    def send_frames_to_ffmpeg(self, start_time):
        for_loop = False
        num_black_frames = int(self.frame_rate * 1) + 1

        # Generate a single black frame
        black_frame = np.zeros((self.frame_height, self.frame_width, 4), dtype=np.uint8)
        black_frame[:,:,3] = 255  # Set alpha channel to 255 (fully opaque)
        if for_loop: 
            black_frame_bytes = black_frame.tobytes()

            # Send 1 second of black frames to ffmpeg
            for _ in range(num_black_frames):
                self.ffmpeg_process.stdin.write(black_frame_bytes)
                self.ffmpeg_process.stdin.flush()
        else:
            # Create 1 second of black frames (frame_rate frames)
            black_frames = np.tile(black_frame, (num_black_frames, 1, 1, 1))
            black_frames_bytes = black_frames.tobytes()

            # Send 1 second of black frames to ffmpeg at once
            self.ffmpeg_process.stdin.write(black_frames_bytes)
            self.ffmpeg_process.stdin.flush()

        print("INFO: sent 1 second of black frames to ffmpeg", time.time() - start_time, flush=True)

        first_frame = True
        while self.running or not self.frame_queue.empty():
            try:
                if not self.frame_queue.empty():
                    frame = self.frame_queue.get_nowait()
                    if first_frame:
                        first_frame = False
                        # print(f"INFO: first frame written to ffmpeg at {time.time() - start_time} seconds", flush=True)
                    self.ffmpeg_process.stdin.write(frame)
                    self.ffmpeg_process.stdin.flush()
                else:
                    time.sleep(1/self.frame_rate)
                    # print("INFO: self.frame_queue empty", flush=True)
            except Exception as e:
                print(f"Error in send_frames_to_ffmpeg: {e}", file=sys.stderr)
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
            '-pix_fmt', 'rgba',
            '-r', str(self.frame_rate),
            '-s', f'{self.frame_width}x{self.frame_height}',
            '-i', '-',
            '-vf', 'vflip',
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-tune', 'zerolatency',
            '-bufsize', '1M',
            '-maxrate', '2M',
            '-g', '30',
            '-f', 'hls',
            '-hls_init_time', '0.5',
            '-hls_time', '0.5',
            # '-hls_list_size', '0',
            # '-hls_playlist_type', 'event', 
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


    def check_for_playlist(self, output_dir, ffmpeg_process):
        
        # FOR DEBUGGING
        # def read_stream(stream):
        #     for line in iter(stream.readline, b''):
        #         line = line.decode().strip()
        #         if os.path.exists(os.path.join(output_dir, "playlist.m3u8")):
        #             print(f'INFO: HLS Playlist ready', flush=True)
        #         else:
        #             print(f"FFmpeg {stream.name}: {line}", flush=True)
        # threading.Thread(target=read_stream, args=(ffmpeg_process.stderr,), daemon=True).start()
        # threading.Thread(target=read_stream, args=(ffmpeg_process.stdout,), daemon=True).start()

        def running_loop():
            hls_ready = False
            while not hls_ready:
                if os.path.exists(os.path.join(output_dir, "playlist.m3u8")):
                    print(f'INFO: HLS Playlist ready at {time.time() - self.start_time} seconds', flush=True)
                        # run_cor(emit_ready_message(self.websocket))
                    self.output_queue.put(f"{BASE_URL}/{output_dir}/playlist.m3u8")
                    hls_ready = True
                time.sleep(0.01)
                    
        threading.Thread(target=running_loop, daemon=True).start()


    def run(self, text, output_dir: str): 
        print(f"INFO: running generator in {time.time() - self.start_time} seconds", flush=True)
        try:
            self.running = True

            print(f"INFO: running scene in {time.time() - self.start_time} seconds", flush=True)
            run_scene_thread = threading.Thread(target=self.run_scene, daemon=True)
            run_scene_thread.start()

            generate_thread = threading.Thread(target=self.generate, args=(text, self.start_time), daemon=True)
            generate_thread.start()

            print(f"INFO: starting ffmpeg in {time.time() - self.start_time} seconds", flush=True)
            self.ffmpeg_process = self.convert_to_hls(output_dir)
            send_frames_thread = threading.Thread(target=self.send_frames_to_ffmpeg, args=(self.start_time,), daemon=True)
            send_frames_thread.start()

            self.check_for_playlist(output_dir, self.ffmpeg_process)

            run_scene_thread.join()
            print('scene done', flush=True)
            self.running = False

            generate_thread.join()
            send_frames_thread.join()
            self.ffmpeg_process.wait()
            self.cleanup()

        except Exception as e:
            # TODO: send error to hls?
            print(f"Error in generator.run: {e}")
            self.cleanup()
    

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
    
    generator = ManimGenerator(Queue())
    generator.run(prompt, "public/hls/test")