import anthropic
from config import ANTHROPIC_API_KEY, GROQ_API_KEY
import re
import logging
import time
import groq

logging = logging.getLogger(__name__)

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
groq_client = groq.Groq(api_key=GROQ_API_KEY)

def generate_ai_response(text, provider="anthropic"):
    start_time = time.time()

    system_prompt="""You are an AI teacher. Respond with a concise answer to the question asked by the user that is no more than 100 words. Then, provide Manim code that generates a 30-45 second animation to accompany the answer. Follow these guidelines for the Manim code:

        1. Always use the class name 'GeneratedScene' for the Manim scene.
        2. Use self.play() for each animation step to ensure proper sequencing.
        3. Clear or transform previous content before introducing new elements.
        4. Use FadeOut() or similar animations to remove objects no longer needed.
        5. Utilize wait() between animations to control pacing.
        6. Do not reference any external files or static assets.
        7. Use shapes, text, and animations that can be generated purely with manim code.
        8. Mobject methods to Scene.play is no longer supported. Use Mobject.animate instead.
        9. Use Text() instead of Tex() or MathTex() to avoid LaTeX dependencies.

        Separate the text response and code with '---CODE---' on a new line."""

    full_response = None

    if provider == "anthropic":
        response = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=1000,
            system=system_prompt,
                messages=[
                    {"role": "user", "content": text}
                ]
            )
        full_response = response.content[0].text.strip()

    elif provider == "groq":
        response = groq_client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            max_tokens=1000,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ]
        )
        full_response = response.choices[0].message.content.strip()
    
    parts = re.split(r'\n---CODE---\n', full_response, maxsplit=1)
    
    text_response = parts[0].strip()
    code_response = parts[1].strip() if len(parts) > 1 else ""
    
    end_time = time.time()
    execution_time = end_time - start_time
    logging.info(f"AI response generation time: {execution_time:.2f} seconds")
    
    return text_response, code_response