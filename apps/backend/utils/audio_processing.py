import io
from pydub import AudioSegment

def convert_to_wav(audio_data):
    audio = AudioSegment.from_raw(io.BytesIO(audio_data), sample_width=2, frame_rate=44100, channels=1)
    wav_io = io.BytesIO()
    audio.export(wav_io, format="wav")
    wav_io.seek(0)
    return wav_io