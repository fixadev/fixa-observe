from manim import *

class BlankScene(Scene):
    def construct(self):
        self.interactive_embed()

class TestScene(Scene):
    def construct(self):
        # Create title
        title = Text("Albert Einstein", font_size=48).shift(UP * 3)
        self.play(Write(title))

        # Create Einstein image using shapes
        head = Circle(radius=0.8, color=WHITE, fill_opacity=0.2)
        hair = VGroup(*[Line(start=head.point_at_angle(angle), end=head.point_at_angle(angle) + 0.4 * UP, color=GRAY) for angle in np.linspace(0, TAU, 20)])
        eyes = VGroup(Dot(point=UP * 0.2 + LEFT * 0.3), Dot(point=UP * 0.2 + RIGHT * 0.3))
        mouth = Arc(angle=PI/2, start_angle=5*PI/4, radius=0.3)
        mustache = VGroup(Arc(angle=PI/2, start_angle=PI, radius=0.3), Arc(angle=PI/2, start_angle=3*PI/2, radius=0.3))
        einstein = VGroup(head, hair, eyes, mouth, mustache).scale(0.8).shift(UP * 0.5)

        self.play(Create(einstein))

        # Create info text
        info = VGroup(
            Text("• Theoretical physicist", font_size=24),
            Text("• Developed theory of relativity", font_size=24),
            Text("• E = mc²", font_size=24),
            Text("• Nobel Prize in Physics (1921)", font_size=24)
        ).arrange(DOWN, aligned_edge=LEFT).shift(DOWN * 1.5)

        for line in info:
            self.play(Write(line))


        # Create famous quote
        quote = Text('"Imagination is more important than knowledge."', font_size=28, color=YELLOW).shift(DOWN * 3)
        self.play(Write(quote))

        # Fade out all elements
        self.play(FadeOut(title), FadeOut(einstein), FadeOut(info), FadeOut(quote))
        self.interactive_embed()