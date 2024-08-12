import ffmpeg
import os
import logging
import time

logger = logging.getLogger(__name__)

def combine_audio_video(video_path, audio_path, output_path):
    combine_start = time.time()

    try:
        print(f"Combining video and audio at {video_path} and {audio_path}")
        
        # Get the duration of the audio file
        audio_probe = ffmpeg.probe(audio_path)
        audio_duration = float(audio_probe['streams'][0]['duration'])
        
        # Get the duration of the video file
        video_probe = ffmpeg.probe(video_path)
        video_duration = float(video_probe['streams'][0]['duration'])
        
        # Calculate the speed factor
        speed_factor = video_duration / audio_duration
        
        input_video = ffmpeg.input(video_path)
        input_audio = ffmpeg.input(audio_path)
        
        # Apply speed adjustment to video
        adjusted_video = input_video.filter('setpts', f'{speed_factor}*PTS')
        
        # Combine adjusted video with audio
        output = ffmpeg.output(adjusted_video, input_audio, output_path, vcodec='libx264', acodec='aac')
        output.run(overwrite_output=True, capture_stdout=True, capture_stderr=True)
        
    except ffmpeg.Error as e:
        logger.error(f"FFmpeg error: {e.stderr.decode()}")
        return None

    combine_end = time.time()
    logger.info(f"Audio-video combining time: {combine_end - combine_start:.2f} seconds")

    # Clean up temporary files
    os.remove(video_path)
    os.remove(audio_path)

    return output_path
