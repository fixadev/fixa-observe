import ffmpeg
import logging
import time
from typing import List

logger = logging.getLogger(__name__)

def concatenate_videos(video_paths: List[str], output_path: str) -> str:
    concat_start = time.time()

    try:
        # Create a list of input streams
        inputs = [ffmpeg.input(path) for path in video_paths]
        
        # Separate video and audio streams
        video_streams = [input['v'] for input in inputs]
        audio_streams = [input['a'] for input in inputs]
        
        # Concatenate video and audio streams separately
        concat_video = ffmpeg.concat(*video_streams, v=1, a=0)
        concat_audio = ffmpeg.concat(*audio_streams, v=0, a=1)
        
        # Combine concatenated video and audio
        output = ffmpeg.output(concat_video, concat_audio, output_path)
        
        # Run the ffmpeg command
        ffmpeg.run(output, overwrite_output=True, capture_stdout=True, capture_stderr=True)
        
        concat_end = time.time()
        logger.info(f"Video concatenation time: {concat_end - concat_start:.2f} seconds")
        
        return output_path
    
    except ffmpeg.Error as e:
        logger.error(f"FFmpeg error during video concatenation: {e.stderr.decode()}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error during video concatenation: {str(e)}")
        return None
