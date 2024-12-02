from pydub import AudioSegment
import requests
import tempfile
from pathlib import Path
import shutil  # Add this import for cleanup

def split_channels(stereo_audio_url: str) -> tuple[str, str]:
    """Split a stereo audio file into separate left and right channel files.
    
    Args:
        stereo_audio_url: URL of the stereo audio file to split
        
    Returns:
        Tuple of (left_channel_path, right_channel_path) as temporary file paths
        Note: Caller is responsible for cleaning up the temporary directory
    """
    # Create temp directory that persists
    try: 
        tmp_dir = tempfile.mkdtemp()
        tmp_path = Path(tmp_dir)
        
        # Download audio file
        response = requests.get(stereo_audio_url)
        response.raise_for_status()
        
        # Save stereo file temporarily
        stereo_path = tmp_path / "stereo.wav" 
        stereo_path.write_bytes(response.content)
        
        # Load stereo audio and print debug info
        audio = AudioSegment.from_file(str(stereo_path))
        
        # Split into channels
        channels = audio.split_to_mono()

        if len(channels) != 2:
            print(f"Expected 2 channels, got {len(channels)}")
            mono_path = tmp_path / "mono.wav"
            channels[0].export(str(mono_path), format="wav")
            return None, str(mono_path)
        
         # Save individual channels
        left_path = tmp_path / "left.wav"
        right_path = tmp_path / "right.wav"
        
        left_channel = channels[0]
        right_channel = channels[1]
        
        left_channel.export(str(left_path), format="wav")
        right_channel.export(str(right_path), format="wav")
        
        return str(left_path), str(right_path)
    except Exception as e:
        print(f"Error splitting channels: {e}")
        raise e

# Optional: Helper function for cleanup
def cleanup_temp_files(directory: str) -> None:
    """Remove temporary directory and its contents.
    
    Args:
        directory: Path to temporary directory to remove
    """
    shutil.rmtree(directory)
