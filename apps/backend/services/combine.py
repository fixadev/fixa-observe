import ffmpeg
import os
import logging
import time

logger = logging.getLogger(__name__)

def combine_audio_video(video_path, audio_path, output_path):
    combine_start = time.time()

    try:
        print(f"Combining video and audio at {video_path} and {audio_path}")
        input_video = ffmpeg.input(video_path)
        input_audio = ffmpeg.input(audio_path)
        ffmpeg.concat(input_video, input_audio, v=1, a=1).output(output_path).run(overwrite_output=True, capture_stdout=True, capture_stderr=True)
    except ffmpeg.Error as e:
        logger.error(f"FFmpeg error: {e.stderr.decode()}")
        return None

    combine_end = time.time()
    logger.info(f"Audio-video combining time: {combine_end - combine_start:.2f} seconds")

    # Clean up temporary files
    os.remove(video_path)
    os.remove(audio_path)

    return output_path
