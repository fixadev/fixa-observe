import time
import logging
import requests
import os
from config import PLAYHT_API_KEY, PLAYHT_USER_ID
from pyht import Client
from gtts import gTTS

logger = logging.getLogger(__name__)

def text_to_speech(text, output_file, provider = 'gtts'):
    start_time = time.time()
    if provider == 'gtts':
        tts = gTTS(text=text, lang='en')
        tts.save(output_file)
    elif provider == 'playht':
        client = Client(PLAYHT_API_KEY, PLAYHT_USER_ID)
        
        options = {
            "voice": "en-US-JennyNeural",
            "speed": 1.0,
            "preset": "balanced"
        }
        response = client.tts(text, options)
        
        with open(output_file, 'wb') as f:
            f.write(response.content)
    
    end_time = time.time()
    execution_time = end_time - start_time
    logger.info(f"Text-to-speech generation time: {execution_time:.2f} seconds")