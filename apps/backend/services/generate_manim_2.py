import threading
import time
import numpy as np
import asyncio
import base64
from queue import Queue
from io import BytesIO
from services.regex_utils import replace_list_comprehensions, has_unclosed_parenthesis, has_unclosed_bracket
from services.llm_clients import anthropic_client
from services.shared import frame_queue
from services.scenes import TestScene, BlankScene
import sys
class ManimGenerator:
    def __init__(self, websocket=None):
        self.commands = []
        self.websocket = websocket
        self.stop_commands = []
        self.running = False
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
        8. DO NOT reference any external files or static assets -- including images, SVGs, videos, or audio files.
        9. Use shapes, text, and animations that can be generated purely with manim code.
        10. Ensure that the animation aligns perfectly with the text response. 
        11. Do not include ANY comments or any unnecessary newlines in the code.
        12. Do not use any LIGHT color variants such as LIGHT_BLUE, LIGHT_GREEN, LIGHT_RED, etc. And never use BROWN.
        13. DO NOT USE LIST COMPREHENSIONS SUCH AS [Circle(radius=d, color=WHITE, stroke_opacity=0.5).shift(LEFT * 5) for d in planet_distances]. EVER. DO NOT EVEN THINK ABOUT IT.
        14. DO NOT USE FOR LOOPS. EVER. DO NOT EVEN THINK ABOUT IT.
        """

        self.frame_rate = 60

    def run_scene(self):
        scene = BlankScene(frame_queue, self.commands, dimensions=(1920/2, 1080/2), frame_rate=self.frame_rate)
        scene.render()

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
                        if has_unclosed_parenthesis(cur_chunk) or has_unclosed_bracket(cur_chunk):
                            cur_chunk += chunks[-1]
                            continue
                        # cur_chunk = replace_list_comprehensions(cur_chunk)
                        self.commands.append(cur_chunk)
                        # print(cur_chunk)
                        cur_chunk = chunks[-1]
                    else:
                        cur_chunk += chunk
                    
                    log_file.write(chunk)
                
        # self.commands.append("\nself.wait(5)\n")
        time.sleep(5)
        self.commands.append("")

    def send_frames_to_stdout(self):
        while self.running or not frame_queue.empty():
            try:
                if not frame_queue.empty():
                    frame = frame_queue.get_nowait()
                    image = frame.convert('RGB')
                    buffered = BytesIO()
                    image.save(buffered, format="JPEG")
                    frame_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
                    print(f"data:image/jpeg;base64,{frame_base64}", flush=True)
                    print("==END_FRAME==", flush=True)
                    sys.stdout.flush()
                else:
                    time.sleep(1/self.frame_rate)
            except Exception as e:
                print(f"Error in send_frames_to_stdout: {e}", file=sys.stderr)
                break
        print("EOF", flush=True)

    def run(self, text):
        print("INFO: running generator", flush=True)
        try:
            self.running = True
            generate_thread = threading.Thread(target=self.generate, args=(text,))
            send_frames_thread = threading.Thread(target=self.send_frames_to_stdout, daemon=True)
            
            send_frames_thread.start()
            generate_thread.start()
            self.run_scene()
            generate_thread.join()
            send_frames_thread.join()
            
            self.cleanup()

        except Exception as e:
            print(f"Error in generator.run: {e}")
    

    def cleanup(self):
        self.running = False
        while not frame_queue.empty():
            try:
                frame_queue.get_nowait()
            except Queue.Empty:
                # print("Frame queue empty")
                break
        # print("Generator cleaned up")
    
    

if __name__ == "__main__":
    print("INFO:Starting python script")
    generator = ManimGenerator()
    
    if len(sys.argv) > 1:
        # print('prompt provided', sys.argv[1])
        prompt = sys.argv[1]
    else:
        # print("No prompt provided")
        prompt = "make a circle"
    
    generator.run(prompt)