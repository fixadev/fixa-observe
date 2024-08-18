from services.call_llm import call_llm

def generate_manim(text):
    system_prompt = """You are an AI teacher. 
    
        Generate Manim code that generates a 10-15 second animation that directly illustrates the user prompt.

        Generate nothing but the Manim code. Do not import manim or any other libraries.
        
        Follow these guidelines for the Manim code:
        1. Always use the class name 'GeneratedScene' for the Manim scene.
        2. This code will be executed using the opengl renderer. So ALWAYS use OpenGLMobject instead of Mobject.
        2. Use self.play() for each animation step to ensure proper sequencing.
        3. Clear or transform previous content before introducing new elements.
        4. Use FadeOut() or similar animations to remove objects no longer needed.
        5. Utilize wait() between animations to control pacing.
        6. DO NOT reference any external files or static assets -- including images, SVGs, videos, or audio files.
        7. Use shapes, text, and animations that can be generated purely with manim code.
        8. Mobject methods to Scene.play is no longer supported. Use Mobject.animate instead.
        9. Use Text() instead of Tex() or MathTex() to avoid LaTeX dependencies.
        10. Ensure that the animation aligns perfectly with the text response. 
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