from manim import *
from manim.opengl import *

import base64
import io
from PIL import Image
import threading
import time
import os
import json
class BlankScene(Scene):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.is_running = True
        self.output_file = f'/tmp/manim_output.json'


    def send_to_websocket(self, message):
        with open(self.output_file, 'w') as f:
            json.dump({"frame": message}, f)

    def construct(self):
        # Start a thread for continuous frame capture
        self.capture_thread = threading.Thread(target=self.continuous_capture)
        self.capture_thread.start()
        self.interactive_embed()

    def continuous_capture(self):
        while self.is_running:
            self.capture_and_send_frame()
            time.sleep(1/30)  # Adjust this for desired frame rate

    def capture_and_send_frame(self):
        if self.websocket:
            frame = self.renderer.get_frame()
            img = Image.fromarray(frame)
            buffered = io.BytesIO()
            img.save(buffered, format="JPEG", quality=70)
            img_str = base64.b64encode(buffered.getvalue()).decode()
            self.send_to_websocket(img_str)

    def cleanup(self):
        try:
            os.remove(self.output_file)
        except FileNotFoundError:
            pass
        self.is_running = False
        if hasattr(self, 'capture_thread'):
            self.capture_thread.join()
        super().cleanup()

class TestScene(Scene):
    def construct(self):
        # Create the sun
        sun = Circle(radius=1, fill_opacity=1, color=YELLOW)
        self.play(Create(sun))

        # Create planets
        planets = [
            Circle(radius=0.1, fill_opacity=1, color=BLUE),
            Circle(radius=0.15, fill_opacity=1, color=ORANGE),
            Circle(radius=0.2, fill_opacity=1, color=GREEN),
            Circle(radius=0.18, fill_opacity=1, color=RED),
            Circle(radius=0.4, fill_opacity=1, color=LIGHT_BROWN),
            Circle(radius=0.35, fill_opacity=1, color=GOLD),
            Circle(radius=0.3, fill_opacity=1, color=BLUE),
            Circle(radius=0.28, fill_opacity=1, color=BLUE_E)
        ]

        # Position planets
        for i, planet in enumerate(planets):
            planet.move_to(sun.get_center() + RIGHT * (i + 2) * 0.8)
            self.play(Create(planet))

        # Create orbits
        for i in range(len(planets)):
            orbit = Circle(radius=(i + 2) * 0.8, color=WHITE).move_to(sun.get_center())
            self.play(Create(orbit))

        # orbits = [Circle(radius=(i + 2) * 0.8, color=WHITE).move_to(sun.get_center()) for i in range(len(planets))]
        # self.play(*[Create(orbit) for orbit in orbits])

        # Animate planet rotation
        self.play(
            *[Rotate(planet, angle=TAU, about_point=sun.get_center(), rate_func=linear, run_time=10) for planet in planets],
            run_time=10
        )

        # Fade out all objects
        self.play(
            FadeOut(sun),
            *[FadeOut(planet) for planet in planets],
            *[FadeOut(orbit) for orbit in orbits]
        )