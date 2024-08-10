import tempfile
from manim import Scene, Text, Write, config

def generate_animation(text):
    class AnimatedText(Scene):
        def construct(self):
            anim_text = Text(text)
            self.play(Write(anim_text))
            self.wait(2)

    with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as tmp_file:
        config.output_file = tmp_file.name
        scene = AnimatedText()
        scene.render()
        return tmp_file.name