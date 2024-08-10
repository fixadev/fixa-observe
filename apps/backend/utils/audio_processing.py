import io
from pydub import AudioSegment
import logging

logger = logging.getLogger(__name__)

def convert_to_wav(audio_data):
    try:
        audio = AudioSegment.from_file(io.BytesIO(audio_data))
        wav_io = io.BytesIO()
        audio.export(wav_io, format="wav")
        wav_io.seek(0)
        return wav_io
    except Exception as e:
        logger.error(f"Error converting audio to WAV: {str(e)}")
        raise