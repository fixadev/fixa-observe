import os
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

CORS_ORIGINS = ["*"]  # Allows all origins
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
LAMBDA_API_KEY = os.getenv("LAMBDA_API_KEY")
LAMBDA_BASE_URL = 'https://api.lambdalabs.com/v1'
PLAYHT_API_KEY = os.getenv("PLAYHT_API_KEY")
PLAYHT_USER_ID = os.getenv("PLAYHT_USER_ID")

# Manim configuration
