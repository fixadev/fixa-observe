from queue import Queue
from manim import *
from manim.opengl import *
from manim.renderer.opengl_renderer import OpenGLRenderer
import math
import numpy as np
import time

config.write_to_movie = False
config.disable_caching = True

class BlankScene(Scene):
    def __init__(self, commands, ffmpeg_process, renderer, dimensions=(1920/4, 1080/4), frame_rate=60, start_time=time.time(), debug_mode=False, background_color='BLACK', *args, **kwargs):
        config.renderer = renderer
        config.pixel_width = math.floor(dimensions[0])
        config.pixel_height = math.floor(dimensions[1])
        config.frame_rate = frame_rate
        config.progress_bar = "none"
        config.background_color = background_color
        super().__init__(ffmpeg_process, debug_mode=debug_mode, *args, **kwargs)

        # assert isinstance(self.renderer, OpenGLRenderer), "This scene only works with the OpenGL renderer"
        self.commands = commands
        self.start_time = start_time

    def construct(self):
        self.interactive_embed(self.commands, self.start_time)

        # title = Text("How Babies Are Made", color=BLUE).scale(1.2).shift(UP * 3)
        # self.play(Write(title))
        # sperm = Triangle(color=WHITE, fill_opacity=1).scale(0.2).shift(LEFT * 4)
        # egg = Circle(color=PINK, fill_opacity=1).scale(0.5).shift(RIGHT * 4)
        # self.play(FadeIn(sperm), FadeIn(egg))
        # self.play(sperm.animate.move_to(egg.get_center()))
        # fertilized_egg = Circle(color=YELLOW, fill_opacity=1).scale(0.6).move_to(egg.get_center())
        # self.play(Transform(egg, fertilized_egg), FadeOut(sperm))

class TestScene(Scene):
    def __init__(self, *args, **kwargs):
        config.write_to_movie = True
        config.format = "mp4"
        config.frame_rate = 60
        config.renderer = "cairo"
        config.pixel_width = math.floor(1920 / 4)
        config.pixel_height = math.floor(1080 / 4)
        super().__init__(ffmpeg_process=None, debug_mode=True, *args, **kwargs)

    def construct(self):
        axes = Axes(
            x_range=[0, 9, 1],
            y_range=[0, 2, 1],
            axis_config={"include_tip": False},
        )
        self.play(Create(axes))
        egg = Circle(radius=0.5, color=PINK).move_to(axes.c2p(2, 1))
        sperm = Triangle(color=BLUE).scale(0.2).move_to(axes.c2p(0, 1))
        self.play(Create(egg), Create(sperm))
        self.play(sperm.animate.move_to(axes.c2p(2, 1)))
        combined = Circle(radius=0.6, color=PURPLE).move_to(axes.c2p(2, 1))
        self.play(Transform(egg, combined), FadeOut(sperm))
        growing_cell = combined.copy()
        self.play(growing_cell.animate.scale(1.5))
        cells = VGroup(*[Circle(radius=0.2, color=PURPLE) for _ in range(8)])
        cells.arrange_in_grid(rows=2, cols=4, buff=0.1).move_to(axes.c2p(5, 1))
        self.play(Transform(growing_cell, cells))
        baby = Circle(radius=0.7, color=YELLOW).move_to(axes.c2p(8, 1))
        self.play(Transform(cells, baby))
        self.wait(2)
        self.play(FadeOut(axes), FadeOut(baby))