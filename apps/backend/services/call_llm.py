import anthropic
from config import OPENAI_API_KEY, ANTHROPIC_API_KEY, GROQ_API_KEY, LAMBDA_API_KEY, LAMBDA_BASE_URL
import re
import logging
import time
import groq
from openai import OpenAI

logging = logging.getLogger(__name__)

openai_client = OpenAI(api_key=OPENAI_API_KEY)

anthropic_client = anthropic.Anthropic(
    api_key=ANTHROPIC_API_KEY,
    default_headers={"anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15"}
)
groq_client = groq.Groq(api_key=GROQ_API_KEY)

lambda_client = OpenAI(api_key=LAMBDA_API_KEY, base_url=LAMBDA_BASE_URL)

def call_llm(system_prompt, input, provider="groq"):
    start_time = time.time()

    final_response = None

    if provider == "anthropic":
        response = anthropic_client.messages.create(
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
    elif provider == "lambda":
        response = lambda_client.chat.completions.create(
            model="hermes-3-llama-3.1-405b-fp8",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": input}
            ],
        )
        final_response = response.choices[0].message.content.strip()
    elif provider == "openai":
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": input}
            ],
        )
        final_response = response.choices[0].message.content.strip()
    
    end_time = time.time()
    execution_time = end_time - start_time
    logging.info(f"AI response generation time: {execution_time:.2f} seconds")
    
    return final_response