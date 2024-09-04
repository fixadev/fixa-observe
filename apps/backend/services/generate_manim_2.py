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

class ManimGenerator:
    def __init__(self, websocket=None):
        self.commands = []
        self.websocket = websocket

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

    async def send_frames_to_websocket(self):
        if self.websocket is None:
            return
        while self.running or not frame_queue.empty():
            try:
                if not frame_queue.empty():
                    frame = frame_queue.get_nowait()
                    image = frame.convert('RGB')
                    buffered = BytesIO()
                    image.save(buffered, format="JPEG")
                    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
                    await self.websocket.send_text(img_str)
                else:
                    await asyncio.sleep(1/self.frame_rate)
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"Error in send_frames_to_websocket: {e}")
                break
                # await asyncio.sleep(1)
        await self.websocket.send_text("EOF")

    def _run_send_frames(self):
        self.loop.run_until_complete(self.send_frames_to_websocket())\

    def run(self, text):
        try:
            self.running = True
            generate_thread = threading.Thread(target=self.generate, args=(text,))

            # Websocket thread
            self.loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self.loop)
            asyncio_thread = threading.Thread(target=self._run_send_frames, daemon=True)
            asyncio_thread.start()
            
            generate_thread.start()
            self.run_scene()
            generate_thread.join()
            
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
        except Exception as e:
            print(f"Error in generator.run: {e}")

    
    
    

if __name__ == "__main__":
    generator = ManimGenerator()
    generator.run("""how do microprocessors work? Make it easy to understand for a high schooler""")