from manim import *
from manim.opengl import *

class GeneratedScene(Scene):
    def construct(self):
        # Title
        title = Tex("Physics")
        self.play(Write(title))
        self.wait(1)
        self.play(title.animate.to_edge(UP))

        # Matter and Energy
        matter = Tex("Matter").to_edge(LEFT)
        energy = Tex("Energy").to_edge(RIGHT)
        interaction_arrow = Arrow(matter.get_right(), energy.get_left())

        self.play(Write(matter), Write(energy))
        self.play(GrowArrow(interaction_arrow))
        self.wait(1)

        # Fundamental laws
        laws = Tex("Fundamental Laws").scale(0.8).next_to(title, DOWN)
        self.play(Write(laws))
        self.wait(1)

        # Universe representation
        universe = Circle(radius=2).move_to(ORIGIN)
        self.play(Create(universe))
        self.wait(1)

        # Particles to galaxies
        particle = Dot().move_to(universe.point_from_proportion(0.2))
        galaxy = Star().scale(0.5).move_to(universe.point_from_proportion(0.8))

        self.play(FadeIn(particle), FadeIn(galaxy))
        self.wait(1)

        # Scale representation
        scale_arrow = Arrow(particle, galaxy)
        scale_Tex = Tex("Tiny to Vast").scale(0.6).next_to(scale_arrow, DOWN)

        self.play(GrowArrow(scale_arrow), Write(scale_Tex))
        self.wait(2)

        # Final fade out
        self.play(
            FadeOut(matter),
            FadeOut(energy),
            FadeOut(interaction_arrow),
            FadeOut(laws),
            FadeOut(universe),
            FadeOut(particle),
            FadeOut(galaxy),
            FadeOut(scale_arrow),
            FadeOut(scale_Tex),
            FadeOut(title)
        )
        self.wait(1)