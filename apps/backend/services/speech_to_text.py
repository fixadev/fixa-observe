import io
import speech_recognition as sr
from utils.audio_processing import convert_to_wav

def speech_to_text(audio_data):
    recognizer = sr.Recognizer()
    wav_io = convert_to_wav(audio_data)
    
    with sr.AudioFile(wav_io) as source:
        audio = recognizer.record(source)
    try:
        return recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        return "Sorry, I couldn't understand that."
    except sr.RequestError:
        return "Sorry, there was an error processing your request."