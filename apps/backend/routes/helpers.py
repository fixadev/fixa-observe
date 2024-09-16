import uuid
import queue

def validate_and_organize_params(data) -> tuple[dict, dict]:
    prompt = data.get('prompt')
    if not prompt:
        raise ValueError("Prompt is required")
    if not isinstance(prompt, str):
        raise ValueError("Prompt must be a string")

    theme = data.get('theme', 'dark')
    if not isinstance(theme, str):
        raise ValueError("Theme must be a string")
    if not (theme == 'dark' or theme == 'light'):
        raise ValueError("Theme must be either 'dark' or 'light'")
    
    fps = data.get('fps', 30)
    if not isinstance(fps, int):
        raise ValueError("FPS must be an integer")
    if fps < 1 or fps > 60:
        raise ValueError("FPS must be greater than 0 and less than 60")
    
    width = data.get('width', 960)
    if not isinstance(width, int):
        raise ValueError("Width must be an integer")
    if width < 1 or width > 1920:
        raise ValueError("Width must be greater than 0 and less than 1920")
    
    height = data.get('height', 540)
    if not isinstance(height, int):
        raise ValueError("Height must be an integer")
    if height < 1 or height > 1080:
        raise ValueError("Height must be greater than 0 and less than 1080")

    renderer = data.get('renderer', 'cairo')
    if not isinstance(renderer, str):
        raise ValueError("Renderer must be a string")
    if not (renderer == 'opengl' or renderer == 'cairo'):
        raise ValueError("Renderer must be either 'opengl' or 'cairo'")
    
    output_path = f"public/hls/{uuid.uuid4()}"
    # output_queue = queue.Queue()
    
    config_params = {
        # 'output_queue': output_queue,
        'theme': theme,
        'fps': fps,
        'width': width,
        'height': height,
        'renderer': renderer
    }
    generation_params = {
        'prompt': prompt,
        'output_path': output_path
    }
    return config_params, generation_params