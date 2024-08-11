import time
import logging
from gtts import gTTS

logger = logging.getLogger(__name__)

def text_to_speech(text, output_file):
    start_time = time.time()
    
    tts = gTTS(text=text, lang='en')
    tts.save(output_file)
    
    end_time = time.time()
    execution_time = end_time - start_time
    logger.info(f"Text-to-speech generation time: {execution_time:.2f} seconds")