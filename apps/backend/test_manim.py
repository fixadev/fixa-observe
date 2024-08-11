from manim import *

class PhysicsIntroduction(Scene):
    def construct(self):
        # Title
        title = Text("Physics", font_size=72, color=BLUE)
        self.play(Write(title))
        self.wait(1)
        self.play(title.animate.to_edge(UP))

        # Definition
        definition = Tex("The branch of science that studies\\\\matter, energy, and fundamental forces", font_size=36)
        self.play(FadeIn(definition))
        self.wait(2)
        self.play(FadeOut(definition))

        # Scale representation
        small = Tex("Smallest particles", color=RED).to_edge(LEFT)
        large = Tex("Largest galaxies", color=YELLOW).to_edge(RIGHT)
        arrow = Arrow(small.get_right(), large.get_left(), buff=0.5)
        self.play(Write(small), Write(large), GrowArrow(arrow))
        self.wait(2)

        # Concepts
        concepts = VGroup(
            Tex("Motion"),
            Tex("Force"),
            Tex("Energy"),
            Tex("Structure of Matter")
        ).arrange(DOWN, buff=0.5)
        self.play(FadeOut(small, large, arrow), FadeIn(concepts))
        self.wait(2)

        # Foundation
        foundation = Tex("Foundational principles for\\\\other scientific disciplines")
        self.play(Transform(concepts, foundation))
        self.wait(2)

        # Scientific method
        method = VGroup(
            Tex("Experiments"),
            Tex("Observations"),
            Tex("Mathematical Models")
        ).arrange(RIGHT, buff=1)
        self.play(FadeOut(foundation), FadeIn(method))
        self.wait(2)

        # Theory development
        theory = Tex("Develop theories\\\\describing the universe")
        self.play(Transform(method, theory))
        self.wait(2)

        # Advancements
        advancements = VGroup(
            Tex("Technology Advancements"),
            Tex("Understanding of the Cosmos")
        ).arrange(DOWN, buff=0.5)
        self.play(FadeOut(theory), FadeIn(advancements))
        self.wait(2)

        # Final message
        final = Text("Explore the wonders of Physics!", color=GREEN, font_size=48)
        self.play(FadeOut(advancements), FadeIn(final))
        self.wait(2)

        # Fade out everything
        self.play(FadeOut(title), FadeOut(final))
        self.wait(1)