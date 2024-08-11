import os
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

CORS_ORIGINS = ["*"]  # Allows all origins
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# Manim configuration
