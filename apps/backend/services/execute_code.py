from manim import *
import logging
import os
import shutil

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def generate_animation(manim_code, output_file):
    logger.info("Starting animation generation")
    
    temp_file_path = f"/tmp/manim_code_{os.urandom(8).hex()}.py"
    with open(temp_file_path, 'w') as temp_file:
        temp_file.write(f"from manim import *\n{manim_code}")
    
    logger.debug(f"Manim code written to temporary file: {temp_file_path}")

    # Set up Manim configuration
    config.media_dir = os.path.join(os.getcwd(), "media")
    config.video_dir = os.path.join(config.media_dir, "videos")
    config.frame_rate = 30
    config.pixel_height = 720
    config.pixel_width = 1280
    config.quality = "medium_quality"
    config.renderer = "opengl"

    try:
        os.system(f"manim {temp_file_path} GeneratedScene -o {output_file} --renderer=opengl")
        
        if not os.path.exists(output_file):
            raise FileNotFoundError(f"Expected output file not found at {output_file}")
        
        logger.info(f"Animation saved to output file: {output_file}")
        return output_file
    except Exception as e:
        logger.error(f"Error rendering animation: {str(e)}", exc_info=True)
        return None
    finally:
        # Clean up the temporary file
        os.remove(temp_file_path)