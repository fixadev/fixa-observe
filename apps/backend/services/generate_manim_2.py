import subprocess
import threading
import multiprocessing
import os
import json
import time
from services.regex_utils import replace_list_comprehensions, has_unclosed_parenthesis, has_unclosed_bracket
from services.llm_clients import anthropic_client

class ManimGenerator:
    def __init__(self, websocket):
        self.commands = []
        self.command_ready = threading.Event()
        self.generation_complete = threading.Event()
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
                        cur_chunk = replace_list_comprehensions(cur_chunk)
                        self.commands.append(cur_chunk)
                        # print(cur_chunk)
                        self.command_ready.set()  # Signal that a command is ready
                        cur_chunk = chunks[-1]
                    else:
                        cur_chunk += chunk
                    
                    log_file.write(chunk)
                
        self.commands.append("\nquit()\n")
        self.generation_complete.set()  # Signal that generation is complete


    def send_frames_to_websocket(self):
        output_file = f'/tmp/manim_output.json'
        print("Starting websocket frame sender")
        while True:
            if os.path.exists(output_file):
                with open(output_file, 'r') as f:
                    try:
                        data = json.load(f)
                        frame = data.get('frame')
                        if frame:
                            self.websocket.send_text(frame)
                    except json.JSONDecodeError:
                        pass 
            time.sleep(1/30)

    def execute_commands(self):
        process = subprocess.Popen(["manim", "./services/scenes.py", "-p", f"BlankScene", "--renderer=opengl"], stdin=subprocess.PIPE)
        threading.Thread(target=self.send_frames_to_websocket, daemon=True).start()

        while True:
            if self.commands:
                command = self.commands.pop(0)
                print(repr(command))

                if process.stdin is not None:
                    process.stdin.write(command.encode())
                    process.stdin.flush()

                if command == "quit()\n":
                    process.wait()
                    return
            else:
                self.command_ready.wait(timeout=1)  # Wait for a command to be ready
                self.command_ready.clear()
    

    def run(self, text):
        generate_thread = threading.Thread(target=self.generate, args=(text,))
        execute_thread = threading.Thread(target=self.execute_commands)
        
        generate_thread.start()
        execute_thread.start()

        generate_thread.join()
        execute_thread.join()

if __name__ == "__main__":
    generator = ManimGenerator()
    generator.run("""Show the solar system with the sun in the center and the planets orbiting the sun at different speeds.""")