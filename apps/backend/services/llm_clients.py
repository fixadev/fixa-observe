import anthropic
from config import OPENAI_API_KEY, ANTHROPIC_API_KEY, GROQ_API_KEY, LAMBDA_API_KEY, LAMBDA_BASE_URL
import logging
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