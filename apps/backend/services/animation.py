from manim import *
import importlib.util
import sys
import logging
import os
import uuid
import shutil
import multiprocessing

logger = logging.getLogger(__name__)

def generate_animation(manim_code, output_file):
    logger.info("Starting animation generation")
    logger.debug(f"Received Manim code:\n{manim_code}")
    
    # Clear any existing Manim-related modules
    for module_name in list(sys.modules.keys()):
        if module_name.startswith('manim.') or module_name == 'manim':
            del sys.modules[module_name]
    
    # Create a unique name for the temporary module
    temp_module_name = f"temp_scene_{os.urandom(8).hex()}"
    
    # Create a temporary module to hold the scene class
    logger.debug(f"Creating temporary module: {temp_module_name}")
    spec = importlib.util.spec_from_loader(temp_module_name, loader=None)
    temp_module = importlib.util.module_from_spec(spec)
    sys.modules[temp_module_name] = temp_module

    # Execute the Manim code in the temporary module
    logger.debug("Executing Manim code in temporary module")
    try:
        exec(f"from manim import *\n{manim_code}", temp_module.__dict__)
    except Exception as e:
        logger.error(f"Error executing Manim code: {str(e)}")
        raise

    # Find the GeneratedScene class in the module
    logger.debug("Finding GeneratedScene class")
    if 'GeneratedScene' not in temp_module.__dict__:
        logger.error("GeneratedScene class not found in the provided Manim code")
        raise ValueError("GeneratedScene class not found in the provided Manim code")
    
    scene_class = temp_module.__dict__['GeneratedScene']
    logger.info(f"Found scene class: {scene_class.__name__}")

    # Set up Manim configuration
    config.media_dir = os.path.join(os.getcwd(), "media")
    config.video_dir = os.path.join(config.media_dir, "videos")
    config.images_dir = os.path.join(config.media_dir, "images")
    config.frame_rate = 30
    config.pixel_height = 720
    config.pixel_width = 1280
    config.disable_caching = True
    # config.verbosity = "DEBUG"

    config.write_to_movie = True
    config.renderer = "cairo" 
    config.quality = "medium_quality" 

    # Enable parallel processing
    config.processes = multiprocessing.cpu_count()



    unique_id = uuid.uuid4().hex
    render_dir = os.path.join(config.media_dir, f"render_{unique_id}")
    os.makedirs(render_dir, exist_ok=True)

    logger.info("Rendering animation")
    scene = scene_class()
    try:
        scene.render()
        expected_file = os.path.join(config.video_dir, "1080p60", "GeneratedScene.mp4")
        
        if not os.path.exists(expected_file):
            raise FileNotFoundError(f"Expected MP4 file not found at {expected_file}")
        
        shutil.move(expected_file, output_file)
    except Exception as e:
        logger.error(f"Error rendering animation: {str(e)}")
        raise
    finally:
        # Clean up the render directory
        shutil.rmtree(render_dir, ignore_errors=True)

    logger.info(f"Animation saved to output file: {output_file}")
    
    # Clean up the temporary module
    logger.debug(f"Cleaning up temporary module: {temp_module_name}")
    del sys.modules[temp_module_name]
    
    return output_file