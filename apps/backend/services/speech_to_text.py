import io
import speech_recognition as sr
from utils.audio_processing import convert_to_wav
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def speech_to_text(audio_data):
    start_time = time.time()
    recognizer = sr.Recognizer()
    
    try:
        conversion_start = time.time()
        wav_io = convert_to_wav(audio_data)
        conversion_end = time.time()
        conversion_time = conversion_end - conversion_start
        logger.info(f"Audio conversion time: {conversion_time:.2f} seconds")
    except Exception as e:
        logger.error(f"Error converting audio: {str(e)}")
        return "Sorry, there was an error processing the audio."

    try:
        recognition_start = time.time()
        with sr.AudioFile(wav_io) as source:
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.record(source)

        text = recognizer.recognize_google(audio)
        recognition_end = time.time()
        recognition_time = recognition_end - recognition_start
        logger.info(f"Speech recognition time: {recognition_time:.2f} seconds")

        end_time = time.time()
        total_processing_time = end_time - start_time
        logger.info(f"Total speech-to-text processing time: {total_processing_time:.2f} seconds")
        return text
    except sr.UnknownValueError:
        logger.warning("Speech recognition could not understand audio")
        return "Sorry, I couldn't understand that."
    except sr.RequestError as e:
        logger.error(f"Could not request results from speech recognition service; {e}")
        return "Sorry, there was an error processing your request."
    except Exception as e:
        logger.error(f"Unexpected error during speech recognition: {str(e)}")
        return "Sorry, an unexpected error occurred."