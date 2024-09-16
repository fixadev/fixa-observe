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
        config.frame_rate = 60
        config.renderer = "opengl"
        super().__init__(ffmpeg_process=None, debug_mode=True, *args, **kwargs)

    def construct(self):
        import numpy as np

        axes = Axes(
            x_range=[0, 10, 1],
            y_range=[0, 100, 10],
            axis_config={"include_tip": False},
        )
        self.play(Create(axes))

        title = Text("Balance Sheet", font_size=36).to_edge(UP)
        self.play(Write(title))

        assets = Text("Assets", color=GREEN).shift(LEFT * 3 + UP * 2)
        liabilities = Text("Liabilities", color=RED).shift(RIGHT * 3 + UP * 2)
        equity = Text("Equity", color=BLUE).shift(RIGHT * 3 + DOWN * 2)

        self.play(Write(assets), Write(liabilities), Write(equity))

        asset_bar = Square(side_length=2, fill_opacity=0.8, color=GREEN).shift(LEFT * 3)
        liability_bar = Square(side_length=2, fill_opacity=0.8, color=RED).shift(RIGHT * 3 + UP)
        equity_bar = Square(side_length=2, fill_opacity=0.8, color=BLUE).shift(RIGHT * 3 + DOWN)

        self.play(GrowFromEdge(asset_bar, DOWN), GrowFromEdge(liability_bar, DOWN), GrowFromEdge(equity_bar, DOWN))

        equation = MathTex("Assets = Liabilities + Equity").shift(DOWN * 3)
        self.play(Write(equation))

        arrow1 = Arrow(start=asset_bar.get_right(), end=liability_bar.get_left(), color=YELLOW)
        arrow2 = Arrow(start=asset_bar.get_right(), end=equity_bar.get_left(), color=YELLOW)

        self.play(Create(arrow1), Create(arrow2))

        balance_text = Text("Balance", color=YELLOW, font_size=24).next_to(arrow1, RIGHT)
        self.play(Write(balance_text))

        self.wait(2)

