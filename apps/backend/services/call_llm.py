import anthropic
from config import ANTHROPIC_API_KEY, GROQ_API_KEY
import re
import logging
import time
import groq

logging = logging.getLogger(__name__)

client = anthropic.Anthropic(
    api_key=ANTHROPIC_API_KEY,
    default_headers={"anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15"}
)
groq_client = groq.Groq(api_key=GROQ_API_KEY)

def call_llm(system_prompt, input, provider="groq"):
    start_time = time.time()

    final_response = None

    if provider == "anthropic":
        response = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=4000,
            system=system_prompt,
            messages=[
                {"role": "user", "content": input}
            ],
        )
        final_response = response.content[0].text.strip()

    elif provider == "groq":
        response = groq_client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            max_tokens=4000,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": input}
            ],
        )
        final_response = response.choices[0].message.content.strip()
    

    print('final_response', final_response)
    end_time = time.time()
    execution_time = end_time - start_time
    logging.info(f"AI response generation time: {execution_time:.2f} seconds")
    
    return final_response