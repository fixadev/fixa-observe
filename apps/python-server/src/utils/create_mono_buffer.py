import io
import wave
import numpy as np

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