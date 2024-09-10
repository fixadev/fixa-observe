from queue import Queue
from manim import *
from manim.opengl import *
from manim.renderer.opengl_renderer import OpenGLRenderer
import math
import numpy as np
import time

# config.renderer = "opengl"
config.write_to_movie = False
config.disable_caching = True

class BlankScene(Scene):
    def __init__(self, commands, ffmpeg_process, dimensions=(1920/4, 1080/4), frame_rate=60, start_time=time.time(), debug_mode=False, background_color='BLACK', *args, **kwargs):
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
        config.frame_rate = 60
        super().__init__(Queue(), *args, **kwargs)

    def construct(self):
        start = time.time()
        # Text explanation
        title = Text("How Babies Are Made", color=BLUE).scale(1.2).shift(UP * 3)
        self.play(Write(title))
        # Sperm and egg
        sperm = Triangle(color=WHITE, fill_opacity=1).scale(0.2).shift(LEFT * 4)
        egg = Circle(color=PINK, fill_opacity=1).scale(0.5).shift(RIGHT * 4)
        self.play(FadeIn(sperm), FadeIn(egg))
        # Sperm moves to egg
        self.play(sperm.animate.move_to(egg.get_center()))
        # Fertilization
        fertilized_egg = Circle(color=YELLOW, fill_opacity=1).scale(0.6).move_to(egg.get_center())
        self.play(Transform(egg, fertilized_egg), FadeOut(sperm))
        # Cell division
        cells = VGroup(*[Circle(color=YELLOW, fill_opacity=1).scale(0.2) for _ in range(4)])
        cells.arrange_in_grid(rows=2, cols=2, buff=0.1)
        self.play(Transform(fertilized_egg, cells))
        # More cell division
        more_cells = VGroup(*[Circle(color=YELLOW, fill_opacity=1).scale(0.1) for _ in range(16)])
        more_cells.arrange_in_grid(rows=4, cols=4, buff=0.05)
        self.play(Transform(cells, more_cells))
        # Forming embryo
        embryo = Ellipse(width=1.5, height=2, color=RED, fill_opacity=0.8)
        self.play(Transform(more_cells, embryo))
        # Growing fetus
        fetus = Circle().set_color(PINK).scale(0.5)
        self.play(Transform(embryo, fetus))
        # Final text
        final_text = Text("9 months later...", color=GREEN).scale(0.8).shift(DOWN * 3)
        self.play(Write(final_text))
        self.play(FadeOut(title), FadeOut(fetus), FadeOut(final_text))
        print(f"Time taken: {time.time() - start} seconds")
