from pydub import AudioSegment
import tempfile
from pathlib import Path
import shutil  # Add this import for cleanup
import aiohttp
import aiofiles
import os

async def split_channels(stereo_audio_url: str) -> tuple[str, str]:
    """Split a stereo audio file into separate left and right channel files.
    
    Args:
        stereo_audio_url: URL of the stereo audio file to split
        
    Returns:
        Tuple of (left_channel_path, right_channel_path) as temporary file paths
        Note: Caller is responsible for cleaning up the temporary directory
    """
    tmp_dir = tempfile.mkdtemp()
    try: 
        tmp_path = Path(tmp_dir)
        
        # Download audio file asynchronously
        async with aiohttp.ClientSession() as session:
            async with session.get(stereo_audio_url) as response:
                response.raise_for_status()
                content = await response.read()
        
        # Save stereo file temporarily
        stereo_path = tmp_path / "stereo.wav"
        async with aiofiles.open(stereo_path, 'wb') as f:
            await f.write(content)
        
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
        # Clean up only on failure
        try:
            shutil.rmtree(tmp_dir)
        except Exception as cleanup_error:
            print(f"Error cleaning up temporary directory: {cleanup_error}")
        print(f"Error splitting channels: {e}")
        raise e


def cleanup_temp_files(*paths: str) -> None:
    """Remove temporary files or directories.
    
    Args:
        *paths: Variable number of paths to files or directories to remove
    """
    for path in paths:
        if os.path.isfile(path):
            os.remove(path)
        elif os.path.isdir(path):
            shutil.rmtree(path)
