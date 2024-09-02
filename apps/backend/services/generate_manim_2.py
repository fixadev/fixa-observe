import subprocess
import threading
import time
import mss
import numpy as np
import asyncio
import cv2
import base64
from queue import Queue
from io import BytesIO
from services.regex_utils import replace_list_comprehensions, has_unclosed_parenthesis, has_unclosed_bracket
from services.llm_clients import anthropic_client
from services.shared import frame_queue
from services.scenes import TestScene, BlankScene

class ManimGenerator:
    def __init__(self, websocket=None):
        self.commands = []
        self.command_ready = threading.Event()
        self.generation_complete = threading.Event()
        self.websocket = websocket

        self.execute_thread_running = False

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


    def generate(self, text):
        # print("################################### QUEUE (generate_manim_2.py) = ", frame_queue)
        # scene = TestScene()
        # scene.render()
        return
        
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
                    if '\n' in chunk:
                        chunks = chunk.split('\n')
                        cur_chunk += '\n'.join(chunks[:-1]) + '\n'
                        if has_unclosed_parenthesis(cur_chunk) or has_unclosed_bracket(cur_chunk):
                            cur_chunk += chunks[-1]
                            continue
                        cur_chunk = replace_list_comprehensions(cur_chunk)
                        self.commands.append(cur_chunk)
                        # print(cur_chunk)
                        self.command_ready.set()  # Signal that a command is ready
                        cur_chunk = chunks[-1]
                    else:
                        cur_chunk += chunk
                    
                    log_file.write(chunk)
                
        self.commands.append("\nself.wait(5)\n")
        self.commands.append("\nquit()\n")
        self.generation_complete.set() # Signal that generation is complete


    def execute_commands(self):
        print("################################### QUEUE (generate_manim_2.py) = ", frame_queue)
        scene = BlankScene()
        print('################################### RENDERING SCENE')
        scene.render()
        print('################################### SCENE RENDERED')
        return 

        process = subprocess.Popen(["manim", "./services/scenes.py", "-p", f"BlankScene", "--renderer=opengl"], stdin=subprocess.PIPE)
        while self.execute_thread_running:
            if self.commands:
                command = self.commands.pop(0)
                # print(repr(command))

                if process.stdin is not None:
                    process.stdin.write(command.encode())
                    process.stdin.flush()

                if command == "\nquit()\n":
                    process.wait()
                    break
            else:
                self.command_ready.wait(timeout=1)  # Wait for a command to be ready
                self.command_ready.clear()
        
        if process.poll() is None:
            process.kill()
        self.execute_thread_running = False
    
    def continuous_capture(self):
        return
        if self.websocket is None:
            return

        frame_count = 0
        sct = mss.mss()
        monitor = {"top": 75, "left": 1920 - 1150, "width": 740, "height": 410}
        while self.capture_thread_running:
            try:
                screenshot = sct.grab(monitor)
                frame = np.array(screenshot)
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                base64_frame = base64.b64encode(buffer).decode('utf-8')
                frame_queue.put(base64_frame)
                time.sleep(1/30)
                frame_count += 1
            except mss.exception.ScreenShotError:
                pass
            except ValueError:
                pass
            except frame_queue.full:
                pass
            except Exception:
                time.sleep(1)
        

    def run(self, text):
        self.running = True
        generate_thread = threading.Thread(target=self.generate, args=(text,))
        execute_thread = threading.Thread(target=self.execute_commands)
        capture_thread = threading.Thread(target=self.continuous_capture)

        # Websocket thread
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        asyncio_thread = threading.Thread(target=self._run_send_frames, daemon=True)
        asyncio_thread.start()
        
        self.execute_thread_running = True
        self.capture_thread_running = True
        generate_thread.start()
        execute_thread.start()
        capture_thread.start()
       
        generate_thread.join()
        execute_thread.join()
        print("Execute thread finished")
        self.execute_thread_running = False
        self.capture_thread_running = False
        capture_thread.join()
        print("Capture thread finished")
        
        self.running = False
        self.loop.call_soon_threadsafe(self.loop.stop)
        asyncio_thread.join()
        print("Asyncio thread joined")
        while not frame_queue.empty():
            try:
                frame_queue.get_nowait()
            except Queue.Empty:
                print("Frame queue empty")
                break

    def _run_send_frames(self):
        self.loop.run_until_complete(self.send_frames_to_websocket())\
    
    async def send_frames_to_websocket(self):
        if self.websocket is None:
            return

        print("################################### Starting to send frames")

        while self.running or not frame_queue.empty():
            try:
                if not frame_queue.empty():
                    print("################################### Sending frame")
                    frame = frame_queue.get_nowait()
                    image = frame.convert('RGB')
                    buffered = BytesIO()
                    image.save(buffered, format="JPEG")
                    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
                    await self.websocket.send_text(img_str)
                else:
                    print("################################### FRAME QUEUE EMPTY")
                    await asyncio.sleep(1/30)
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"Error in send_frames_to_websocket: {e}")
                break
                # await asyncio.sleep(1)
        await self.websocket.send_text("EOF")

if __name__ == "__main__":
    generator = ManimGenerator()
    generator.run("""how do microprocessors work? Make it easy to understand for a high schooler""")