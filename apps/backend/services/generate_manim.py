from services.call_llm import call_llm

# 2. This code will be executed using the opengl renderer. So ALWAYS use OpenGLMobject instead of Mobject.
def generate_manim(text):
    system_prompt = """You are an AI teacher. 
    
        Generate Manim code that generates a 10-15 second animation that directly illustrates the user prompt.

        Generate nothing but the Manim code. Do not import manim or any other libraries.
        
        Follow these guidelines for the Manim code:
        1. Always use the class name 'GeneratedScene' for the Manim scene.

        3. Use self.play() for each animation step to ensure proper sequencing.
        4. Clear or transform previous content before introducing new elements.
        5. For setting colors, use the set_color() method after creating objects.
        6. Use FadeOut() or similar animations to remove objects no longer needed.
        7. Utilize wait() between animations to control pacing.
        8. DO NOT reference any external files or static assets -- including images, SVGs, videos, or audio files.
        9. Use shapes, text, and animations that can be generated purely with manim code.
        10. Mobject methods to Scene.play is no longer supported. Use Mobject.animate instead.
        11. Use Text() instead of Tex() or MathTex() to avoid LaTeX dependencies.
        12. Ensure that the animation aligns perfectly with the text response. 
    """
    result = call_llm(system_prompt, text, provider="groq")
    
    # Strip everything before class GeneratedScene
        # Strip everything before class GeneratedScene
    stripped_result = result.split("class GeneratedScene", 1)[-1]
    
    # Remove any leading or trailing whitespace
    stripped_result = stripped_result.strip()
    
    # Remove backticks and 'python' identifier if present
    stripped_result = stripped_result.strip('`').lstrip('python\n')
    
    return "class GeneratedScene" + stripped_result