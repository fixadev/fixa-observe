from queue import Queue
from manim import *
import math
import numpy as np
import time

config.write_to_movie = False
config.disable_caching = True

class BlankScene(MovingCameraScene):
    def __init__(self, commands, ffmpeg_process, renderer, dimensions=(1920/4, 1080/4), frame_rate=60, start_time=time.time(), debug_mode=False, background_color='BLACK', *args, **kwargs):
        config.renderer = renderer
        config.pixel_width = math.floor(dimensions[0])
        config.pixel_height = math.floor(dimensions[1])
        config.frame_rate = frame_rate
        config.progress_bar = "none"
        config.background_color = background_color
        super().__init__(ffmpeg_process=ffmpeg_process, debug_mode=debug_mode, *args, **kwargs)

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

class TestScene(MovingCameraScene):
    def __init__(self, *args, **kwargs):
        config.frame_rate = 60
        config.renderer = "cairo"
        config.pixel_width = math.floor(1920 / 4)
        config.pixel_height = math.floor(1080 / 4)
        super().__init__(ffmpeg_process=None, debug_mode=True, *args, **kwargs)

    def construct(self):
        import numpy as np

        title = Text("Understanding Riemann Sums").scale(0.8).to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        self.camera.frame.save_state()

        print('height is', self.camera.frame_height)

        self.play(
            self.camera.frame.animate.set_height(10)
        )

        print('height is', self.camera.frame_height)

        # self.play(
        #     self.camera.resize_frame_shape()
        # )

        explanation = Text("Riemann sums help us estimate\nthe area under a curve").scale(0.6).to_edge(LEFT)
        self.play(Write(explanation))
        self.wait(2)

        axes = Axes(
            x_range=[0, 5],
            y_range=[0, 25],
            axis_config={"include_tip": False},
        )
        self.play(Create(axes))
        self.wait(1)

        func = lambda x: x**2
        graph = axes.plot(func, color=BLUE)
        self.play(Create(graph))
        self.wait(1)

        area_text = Text("We want to find this area").scale(0.4).next_to(axes, DOWN)
        self.play(Write(area_text))
        self.wait(1)

        rectangles = axes.get_riemann_rectangles(
            graph,
            x_range=[0, 5],
            dx=1,
            stroke_width=0.1,
            stroke_color=WHITE,
        )
        self.play(Create(rectangles))
        self.wait(1)

        sum_text = Text("We can approximate it with rectangles").scale(0.4).next_to(area_text, DOWN)
        self.play(Write(sum_text))
        self.wait(1)

        self.play(FadeOut(area_text), FadeOut(sum_text))
        self.wait(1)

        width_arrow = Arrow(start=axes.c2p(0, 0), end=axes.c2p(1, 0), color=RED)
        width_label = Text("Width (dx)").scale(0.3).next_to(width_arrow, DOWN)
        self.play(Create(width_arrow), Write(width_label))
        self.wait(1)

        height_arrow = Arrow(start=axes.c2p(1, 0), end=axes.c2p(1, func(1)), color=GREEN)
        height_label = Text("Height (f(x))").scale(0.3).next_to(height_arrow, RIGHT)
        self.play(Create(height_arrow), Write(height_label))
        self.wait(1)

        formula = MathTex(r"\text{Area} \approx \sum_{i=1}^n f(x_i) \cdot \Delta x").scale(0.8).next_to(axes, DOWN)
        self.play(Write(formula))
        self.wait(2)

    
        # print('formula.is_in_frame()', self.camera.is_in_frame(formula))
        # print('formula is off screen', formula.is_off_screen)

        self.play(FadeOut(width_arrow), FadeOut(width_label), FadeOut(height_arrow), FadeOut(height_label))
        self.wait(1)

        more_rectangles = axes.get_riemann_rectangles(
            graph,
            x_range=[0, 5],
            dx=0.2,
            stroke_width=0.1,
            stroke_color=WHITE,
        )
        self.play(Transform(rectangles, more_rectangles))
        self.wait(1)

        better_approx = Text("More rectangles = Better approximation").scale(0.4).next_to(formula, DOWN)
        self.play(Write(better_approx))
        self.wait(2)

        final_text = Text("As we use infinitely many rectangles,\nwe get the exact area!").scale(0.6).to_edge(DOWN)
        self.play(Write(final_text))
        self.wait(2)

        self.play(FadeOut(*self.mobjects))
        self.wait(1)