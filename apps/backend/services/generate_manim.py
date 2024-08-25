from services.call_llm import call_llm

def generate_manim(text):
    system_prompt = """You are an AI teacher. 
    
        Generate Manim code that generates a 10-15 second animation that directly illustrates the user prompt.

        Generate nothing but the Manim code. Do not import manim or any other libraries.
        
        Follow these guidelines for the Manim code:
        1. Always use the class name 'GeneratedScene' for the Manim scene.
        2. Don't use any colors
        3. Use self.play() for each animation step to ensure proper sequencing.
        4. Clear or transform previous content before introducing new elements.
        6. Use FadeOut() or similar animations to remove objects no longer needed.
        7. Utilize wait() between animations to control pacing.
        8. DO NOT reference any external files or static assets -- including images, SVGs, videos, or audio files.
        9. Use shapes, text, and animations that can be generated purely with manim code.
        12. Ensure that the animation aligns perfectly with the text response. 
    """
    result = call_llm(system_prompt, text, provider="anthropic")
    
    stripped_result = result.split("class GeneratedScene", 1)[-1]

    if '```' in stripped_result:
        stripped_result = stripped_result.split('```')[0]
    
    stripped_result = stripped_result.strip()
    stripped_result = stripped_result.replace("Mobject", "OpenGLMobject")
    stripped_result = stripped_result.replace("VMobject", "OpenGLVMobject")
    stripped_result = stripped_result.replace("Surface", "OpenGLSurface")
    
    return "class GeneratedScene" + stripped_result