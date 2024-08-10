import os
from dotenv import load_dotenv
from manim import config as manim_config

# Load environment variables from .env file
load_dotenv()

CORS_ORIGINS = ["*"]  # Allows all origins
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Manim configuration
manim_config.frame_rate = 10