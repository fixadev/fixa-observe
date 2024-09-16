import json
import argparse
import os
import sys
import time
import queue
import threading
import subprocess
import numpy as np
from config import BASE_URL
from queue import Queue
from services.scenes import BlankScene
from services.llm_clients import anthropic_client
from utils.monitoring import increment_subprocess_count, decrement_subprocess_count
from services.regex_utils import has_unclosed_parenthesis, has_unclosed_bracket, has_indented_statement, extract_indented_statement, replace_svg_mobjects, replace_invalid_colors


class ManimGenerator:
    def __init__(self, config_params: dict):
        
        self.frame_rate = config_params['fps']
        self.frame_width = config_params['width']
        self.frame_height = config_params['height']
        self.renderer = config_params['renderer']
        self.use_hardcoded_scene = config_params['use_hardcoded_scene'] if 'use_hardcoded_scene' in config_params else False
        self.background_color = 'BLACK' if config_params['theme'] == 'dark' else 'WHITE'

        self.black_frame = np.zeros((self.frame_height, self.frame_width, 4), dtype=np.uint8)
        self.black_frame[:, :, 3] = 255
        self.white_frame = np.ones((self.frame_height, self.frame_width, 4), dtype=np.uint8) * 255

        self.commands = []
        self.running = False
        self.start_time = time.time()
        # self.output_queue = config_params['output_queue']
        self.system_prompt = """
        
        You are an AI teacher. 
    
        Generate Manim code that generates a 10-15 second animation that directly illustrates the user prompt.
        ALWAYS generate manim code and nothing else -- even if the user prompt is vague or incomplete.
        Assume you're teaching a five year old. Be very slow and simple.
        Begin with a high level overview of what you're going to do.
        Then dig into the details of how you're going to do it.
        Be overly descriptive and detailed. So even the dumbest five year old will understand.
        Again - be overly descriptive and detailed.
        Assume the student knows nothing. So explain technical terms before using them. For example, if you're using a technical term like 'client' or 'server', explain that a client is just a computer like your laptop, and a server is a program that runs on a computer that serves files to other computers.
        As much as possible, try to show, not tell.
        Do not output any other text than the Manim code.
        Do not import manim or any modules other than built in modules, standard library modules, and modules that I specify you can import.
        Do not include ANY comments (i.e. lines that start with #) 
    
        
        Follow these guidelines for the Manim code:
        1. Only generate the content of the construct() method, but do not include the first line "def construct(self):".
        2. Remove elements using the FadeOut() method before creating new elements.
        3. DO NOT reference any external static assets -- including images, SVGs, videos, or audio files.
        4. NEVER use self.mobjects()
        5. Import built-in or standard library python modules like math, random as needed.
        6. The non standard library modules that can be imported are: np.
        7. When instantiating a graph, ensure that the lambda function that is passed to the ParametricFunction cannot return a value greater than the size of the axis minus 1. So if the size of the axis is 10, then the lambda function should not return a value greater than 9.
        8. When writing labels, ALWAYS escape the $ symbol with a backslash.
        9. Again, never import manim.
        10. Use self.play as early as possible to get the animation started. But don't fail to assign any mobjects to a variable that can be used later in the code. i.e. when creating axes, you should do this: 
            
            axes = Axes(
                x_range=[0, 10, 1],
                y_range=[0, 100000, 10000],
                axis_config={"include_tip": False},
            )
            self.play(Create(axes))

            DO NOT do this:

            self.play(Create(Axes(x_range=[0, 10, 1], y_range=[0, 100000, 10000], axis_config={"include_tip": False})))

        11. When creating lambda functions to plot exponential functions, use intercepts rather than coefficients for the starting point. i.e. if you have a exponential function that starts at 1000 and goes to 100000 
    
            instead of 

            lambda x: 1000 * np.exp(x)

            do this:

            lambda x: 10 * np.exp(x) + 1000

        12. rate_func=exponential is not a valid parameter for the animate method. Instead, use rate_func=rush_into.

        13. When adding text or mobjects to the edge of a scene using the .to_edge() method, use:

            self.play(
                self.camera.frame.animate.set_height(10)
            )

            to zoom out to fit the text or mobjects.

            to zoom back in to the original view, use:

            self.play(
                self.camera.frame.animate.set_height(8)
            )

        14. When creating a TangentLine(), ensure the alpha parameter is included.
        15. When creating Axes, ensure that you set the y range to accomodate the function you will be plotting:

            so DO NOT do this: 

            axes = Axes(
                x_range=[-1, 5],
                y_range=[-1, 5],
                axis_config={"include_tip": False},
            )
            self.play(Create(axes))

            func = lambda x: x**2
            graph = axes.plot(func, color=BLUE)

            because when x is 5, the y value is 25, which is greater than the y maximum of 5.

            instead, do this:

            axes = Axes(
                x_range=[-1, 5],
                y_range=[-1, 30],
                axis_config={"include_tip": False},
            )

            func = lambda x: x**2
            graph = axes.plot(func, color=BLUE)

        17. Create axes when they are needed to plot stuff on. Do not create axes unless you are going to use them in the animation.
        18. Before displaying new text, always fade out the previous text.
        19. NEVER set the background color using self.camera.set_background_color. Assume the background color is %s
        20. NEVER use Heart() this shape doesn't exist
        21. NEVER use the ThoughtBubble class - it does not exist.
        22. To ensure that text is never displayed on top of other elements, move the text to an edge of the screen if you just displayed elements in the middle of the screen.
        23. Ensure you fade out elements before introducing new elements using the FadeOut() method.
        """ % self.background_color


        # 16. Use the self.wait(1) method between each command to allow the viewer to see the result.

        # ALWAYS start your code with a self.play() call.

        # 1. For OpenGL -- modify height with: self.camera.animate.set_height(10)

        # 2. You are using the OpenGL renderer. Never use the .to_edge() method. Instead use the .shift() method.
        # 3. Use self.play() for each animation step to ensure proper sequencing.
        # 14. DO NOT USE FOR LOOPS. EVER. DO NOT EVEN THINK ABOUT IT.
        # 13. DO NOT USE LIST COMPREHENSIONS SUCH AS [Circle(radius=d, color=WHITE, stroke_opacity=0.5).shift(LEFT * 5) for d in planet_distances]. EVER. DO NOT EVEN THINK ABOUT IT.
        # 6. Use FadeOut() or similar animations to remove objects no longer needed.
        # 12. Do not use any LIGHT color variants such as LIGHT_BLUE, LIGHT_GREEN, LIGHT_RED, etc. And never use BROWN.
        # 11. Ensure that the animation aligns perfectly with the text response. 
        # 10. Use shapes, text, and animations that can be generated purely with manim code.
        # 7. Do not ever use wait()

    def run_scene(self):
        print('INFO: Instantiate BlankScene at', time.time() - self.start_time)
        scene = BlankScene(self.commands, self.ffmpeg_process, self.renderer, dimensions=(self.frame_width, self.frame_height), frame_rate=self.frame_rate, start_time=self.start_time, debug_mode=False, background_color=self.background_color)
        print('INFO: BlankScene instantiated at', time.time() - self.start_time)
        scene.render()
        print('INFO: ###################################################### EVERYTHING completed at', time.time() - self.start_time)

    def generate(self, text, start_time, output_dir):
        if not self.use_hardcoded_scene:
            print("INFO: making anthropic call", flush=True)
            with anthropic_client.messages.stream(
                model="claude-3-5-sonnet-20240620",
                max_tokens=4000,
                system=self.system_prompt,
                messages=[
                    {"role": "user", "content": text}
                ],
            ) as stream:
                self.parse_commands(stream.text_stream, start_time, output_dir)
                self.commands.append('')
        else:
            with open('./services/hardcoded_scene.txt', 'r') as file:
                self.parse_commands(file.readlines(), start_time, output_dir)

            time.sleep(10)
            self.commands.append('')

    def parse_commands(self, stream, start_time, output_dir):
        first_byte_received = False
        first_command_ready = False

        os.makedirs(output_dir, exist_ok=True)
        with open(os.path.join(output_dir, "log.txt"), "w") as log_file, open(os.path.join(output_dir, "preprocessed_code.txt"), "w") as preprocessed_code_file:
            cur_chunk = ""
            for chunk in stream:
                log_file.write(chunk)
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
                                preprocessed_code_file.write(''.join(extracted[:-2]))
                                self.commands.append(''.join(extracted[:-2]))
                                cur_chunk = ''.join(extracted[-2:])

                        continue
                    # cur_chunk = replace_list_comprehensions(cur_chunk)
                    cur_chunk = replace_invalid_colors(cur_chunk)
                    cur_chunk = replace_svg_mobjects(cur_chunk)
                    self.commands.append(cur_chunk)
                    preprocessed_code_file.write(cur_chunk)
                    if not first_command_ready:
                        first_command_ready = True
                        print(f"INFO: first command ready at {time.time() - start_time} seconds", flush=True)
                    cur_chunk = chunks[-1]
                else:
                    cur_chunk += chunk
            preprocessed_code_file.write(cur_chunk)
            self.commands.append(cur_chunk)

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
            # '-vf', 'vflip',
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-tune', 'zerolatency',
            '-bufsize', '1M',
            '-maxrate', '2M',
            '-g', '30',
            '-f', 'hls',
            '-hls_init_time', '0.5',
            '-hls_time', '0.5',
            '-hls_list_size', '0',
            # '-hls_playlist_type', 'event', 
            '-hls_segment_type', 'mpegts',
            '-hls_segment_filename', os.path.join(output_dir_str, 'stream%03d.ts'),
            os.path.join(output_dir_str, 'playlist.m3u8')
        ]
        increment_subprocess_count()
        ffmpeg_process = subprocess.Popen(
            ffmpeg_command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        return ffmpeg_process


    # def check_for_playlist(self, output_dir, ffmpeg_process):
        
        # FOR DEBUGGING
        # def read_stream(stream):
        #     for line in iter(stream.readline, b''):
        #         line = line.decode().strip()
        #         if os.path.exists(os.path.join(output_dir, "playlist.m3u8")):
        #             print(f'INFO: HLS Playlist ready', flush=True)
        #         else:
        #             print(f"FFmpeg {stream.name}: {line}", flush=True)
        # threading.Thread(target=read_stream, args=(ffmpeg_process.stderr,)).start()
        # threading.Thread(target=read_stream, args=(ffmpeg_process.stdout,)).start()

    def send_blank_frames(self):
        num_blank_frames = int(self.frame_rate * 1) + 1

        # Generate a single black frame

        blank_frame = self.black_frame if self.background_color == 'BLACK' else self.white_frame

        # Create 1 second of black frames (frame_rate frames)
        blank_frames = np.tile(blank_frame, (num_blank_frames, 1, 1, 1))
        blank_frames_bytes = blank_frames.tobytes()

        # Send 1 second of black frames to ffmpeg at once
        self.ffmpeg_process.stdin.write(blank_frames_bytes)
        self.ffmpeg_process.stdin.flush()

        print("INFO: sent 1 second of black frames to ffmpeg", time.time() - self.start_time, flush=True)


    def check_for_playlist(self, output_dir, ffmpeg_process):
        hls_ready = False
        while not hls_ready:
            if os.path.exists(os.path.join(output_dir, "playlist.m3u8")):
                print(f'INFO: HLS Playlist ready at {time.time() - self.start_time} seconds', flush=True)
                    # run_cor(emit_ready_message(self.websocket))
                # self.output_queue.put(f"{BASE_URL}/{output_dir}/playlist.m3u8")
                hls_ready = True
                break
            time.sleep(0.01)


    def run(self, input_params: dict): 
        text = input_params['prompt']
        output_dir = input_params['output_path']
        print(f"INFO: running generator in {time.time() - self.start_time} seconds", flush=True)
        try:
            self.running = True

            print(f"INFO: starting ffmpeg in {time.time() - self.start_time} seconds", flush=True)
            self.ffmpeg_process = self.convert_to_hls(output_dir)
            
            self.send_blank_frames_thread = threading.Thread(target=self.send_blank_frames)
            self.send_blank_frames_thread.start()

            print(f"INFO: running scene in {time.time() - self.start_time} seconds", flush=True)
            self.run_scene_thread = threading.Thread(target=self.run_scene)
            self.run_scene_thread.start()

            self.generate_thread = threading.Thread(target=self.generate, args=(text, self.start_time, output_dir))
            self.generate_thread.start()

            self.check_for_playlist_thread = threading.Thread(target=self.check_for_playlist, args=(output_dir, self.ffmpeg_process))
            self.check_for_playlist_thread.start()

            self.run_scene_thread.join()
            print('scene done', flush=True)
            self.running = False
            time.sleep(2)
            self.ffmpeg_process.stdin.close()

            self.send_blank_frames_thread.join()
            self.generate_thread.join()
            self.check_for_playlist_thread.join()
            self.ffmpeg_process.wait()
            decrement_subprocess_count()
            self.cleanup()

        except Exception as e:
            # TODO: send error to hls?
            print(f"Error in generator.run: {e}")
            self.cleanup()
    

    def cleanup(self):
        if self.generate_thread is not None:
            self.generate_thread.join()
        if self.run_scene_thread is not None:
            self.run_scene_thread.join()
        if self.check_for_playlist_thread is not None:
            self.check_for_playlist_thread.join()
        if self.ffmpeg_process is not None:
            self.ffmpeg_process.stdin.close()
            self.ffmpeg_process.terminate()
            self.ffmpeg_process.wait(timeout=5)
            if self.ffmpeg_process.poll() is None:
                self.ffmpeg_process.kill()
        print("INFO: Generator cleaned up")

if __name__ == "__main__":
    parser = argparse.ArgumentParser("generate_manim_python")
    parser.add_argument('--config_params', type=str, required=False, default='{"renderer": "cairo", "fps": 30, "width": 960, "height": 540, "theme": "dark"}')
    parser.add_argument('--input_params', type=str, required=False, default='{"prompt": "how are babies made?", "output_path": "public/hls/test"}')
    args = parser.parse_args()

    config_params = json.loads(args.config_params)
    input_params = json.loads(args.input_params)

    generator = ManimGenerator(config_params)
    generator.run(input_params)

    # def run_generator(thread_id):
    #     print(f"Starting thread {thread_id}")
    #     generator = ManimGenerator(config_params)
    #     generator.run(input_params)
    #     print(f"Thread {thread_id} completed")

    # threads = []
    # for i in range(1):
    #     thread = threading.Thread(target=run_generator, args=(i,))
    #     threads.append(thread)
    #     thread.start()

    # for thread in threads:
    #     thread.join()

    # print("All threads completed")