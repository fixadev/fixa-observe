import io
import wave
import numpy as np
import requests
import soundfile as sf
from ..utils.vapi_client import create_vapi_client
from ..utils.openai_client import create_openai_client
from ..config import settings

def create_mono_buffer(channel_data: np.ndarray, sample_rate: int) -> io.BytesIO:
    """Create a mono WAV buffer from channel data."""
    buffer = io.BytesIO()
    with wave.open(buffer, 'wb') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        
        # Convert float32 to int16
        channel_data = (channel_data * 32767).astype(np.int16)
        wav_file.writeframes(channel_data.tobytes())
    
    buffer.seek(0)
    return buffer

async def analyze_call(call_id: str):
    """Analyze a call recording and generate transcripts."""
    # Initialize clients
    vapi_client = create_vapi_client(settings.vapi_api_key)
    openai_client = create_openai_client(settings.openai_api_key)
    
    # Get call details from Vapi
    call = vapi_client.calls.get(call_id)
    
    if not call.artifact or not call.artifact.stereo_recording_url:
        return

    # Download the audio file
    response = requests.get(call.artifact.stereo_recording_url)
    audio_data = io.BytesIO(response.content)
    
    # Load audio file using soundfile
    data, sample_rate = sf.read(audio_data)
    
    # Split channels
    left_channel = data[:, 0]
    right_channel = data[:, 1]
    
    # Create mono buffers for each channel
    left_buffer = create_mono_buffer(left_channel, sample_rate)
    right_buffer = create_mono_buffer(right_channel, sample_rate)
    
    # Transcribe left channel
    left_transcript = openai_client.audio.transcriptions.create(
        file=("audio.wav", left_buffer, "audio/wav"),
        model="whisper-1",
        language="en",
        response_format="verbose_json",
        timestamp_granularities=["word"]
    )
    
    # Transcribe right channel
    right_transcript = openai_client.audio.transcriptions.create(
        file=("audio.wav", right_buffer, "audio/wav"),
        model="whisper-1",
        language="en",
        response_format="verbose_json",
        timestamp_granularities=["word"]
    )
    
    original_transcript = call.artifact.transcript
    
    print("originalTranscript", original_transcript)
    print("openaitranscript", left_transcript)
    print("openaitranscript", right_transcript) 