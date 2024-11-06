import io
import requests
import soundfile as sf
from ..utils.vapi_client import create_vapi_client
from ..utils.openai_client import create_openai_client
from ..config import settings
from ..utils.create_mono_buffer import create_mono_buffer
from ..utils.create_segments import create_segments_from_words

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
    
    # Create and save mono buffers for each channel
    left_buffer = create_mono_buffer(left_channel, sample_rate)
    right_buffer = create_mono_buffer(right_channel, sample_rate)
    
    # Save files locally for testing
    with open(f"temp_{call_id}_left.wav", "wb") as f:
        f.write(left_buffer.getvalue())
    with open(f"temp_{call_id}_right.wav", "wb") as f:
        f.write(right_buffer.getvalue())
        
    # Reset buffer positions for subsequent use
    left_buffer.seek(0)
    right_buffer.seek(0)
    
    # Transcribe left channel
    left_transcript = openai_client.audio.transcriptions.create(
        file=("audio.wav", left_buffer, "audio/wav"),
        model="whisper-1",
        language="en",
        response_format="verbose_json",
        timestamp_granularities=["word"],
    )
    
    # Transcribe right channel
    right_transcript = openai_client.audio.transcriptions.create(
        file=("audio.wav", right_buffer, "audio/wav"),
        model="whisper-1",
        language="en",
        response_format="verbose_json",
        timestamp_granularities=["word"],
    )
    
    original_transcript = call.artifact.transcript

    # In your analyze_call function:
    segments = create_segments_from_words(left_transcript.words, right_transcript.words)
    print("\n".join([segment["text"] for segment in segments]))

    print("\n=== Original Transcript ===")
    print(original_transcript)
