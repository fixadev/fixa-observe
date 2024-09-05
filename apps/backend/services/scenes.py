from queue import Queue
from manim import *
from manim.opengl import *
from manim.renderer.opengl_renderer import OpenGLRenderer
import math
import numpy as np
import time

config.renderer = "opengl"
config.write_to_movie = False
# config.background_color = "#ffffff"

class BlankScene(Scene):
    def __init__(self, frame_queue, commands, dimensions=(1920/4, 1080/4), frame_rate=60, start_time=time.time(), debug_mode=False, *args, **kwargs):
        config.pixel_width = math.floor(dimensions[0])
        config.pixel_height = math.floor(dimensions[1])
        config.frame_rate = frame_rate

        super().__init__(frame_queue, debug_mode=debug_mode, *args, **kwargs)

        assert isinstance(self.renderer, OpenGLRenderer), "This scene only works with the OpenGL renderer"
        self.commands = commands
        self.start_time = start_time

    def construct(self):
        self.interactive_embed(self.commands, self.start_time)

class TestScene(Scene):
    def __init__(self, *args, **kwargs):
        super().__init__(Queue(), *args, **kwargs)

    def construct(self):
        # Create the sun
        sun = Circle(radius=0.5, fill_opacity=1, color=YELLOW)
        self.play(Create(sun))

        # Create planets with different sizes and colors
        planets = [
            Circle(radius=0.1, fill_opacity=1, color=BLUE),        # Mercury
            Circle(radius=0.15, fill_opacity=1, color=ORANGE),     # Venus
            Circle(radius=0.2, fill_opacity=1, color=GREEN),       # Earth
            Circle(radius=0.18, fill_opacity=1, color=RED),        # Mars
            Circle(radius=0.4, fill_opacity=1, color=LIGHT_BROWN), # Jupiter
            Circle(radius=0.35, fill_opacity=1, color=GOLD),       # Saturn
            Circle(radius=0.3, fill_opacity=1, color=BLUE_C),      # Uranus
            Circle(radius=0.28, fill_opacity=1, color=BLUE_E)      # Neptune
        ]

        # Create orbits and position planets
        orbits = []
        for i, planet in enumerate(planets):
            orbit_radius = (i + 2) * 0.8
            orbit = Circle(radius=orbit_radius, color=WHITE).move_to(sun.get_center())
            orbits.append(orbit)
            planet.move_to(sun.get_center() + RIGHT * orbit_radius)
            self.play(Create(orbit), Create(planet), run_time=0.5)

        # Animate planet rotation
        rotations = [
            Rotate(planet, angle=TAU, about_point=sun.get_center(), rate_func=linear, run_time=20/(i+1))
            for i, planet in enumerate(planets)
        ]
        self.play(*rotations, run_time=20)

        # Fade out all objects
        self.play(
            FadeOut(sun),
            *[FadeOut(planet) for planet in planets],
            *[FadeOut(orbit) for orbit in orbits]
        )
