from manim import *
from manim.opengl import *

class BlankScene(Scene):
    def construct(self):
        self.interactive_embed()

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