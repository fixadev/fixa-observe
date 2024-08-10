import openai
from config import OPENAI_API_KEY

openai.api_key = OPENAI_API_KEY

def generate_ai_response(text):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an AI teacher. Respond with a concise answer to the question asked by the user. No more than 100 words."},
            {"role": "user", "content": text}
        ]
    )
    print(response)
    return response.choices[0].message['content'].strip()