import json
import queue
import logging
import subprocess
import threading
from fastapi import APIRouter, Request, BackgroundTasks
from config import BASE_URL
from services.generate_manim_python import ManimGenerator
from routes.helpers import validate_and_organize_params

thread_count_lock = threading.Lock()
active_threads = 0

def log_thread_count():
    global active_threads
    logger.info(f"Current active threads: {active_threads}")

def background_task(generator_thread):
    global active_threads
    thread_id = threading.get_ident()
    
    with thread_count_lock:
        active_threads += 1
        log_thread_count()
    
    logger.info(f"Generation thread {thread_id} started")
    generator_thread.join()
    logger.info(f"Generation thread {thread_id} completed")
    
    with thread_count_lock:
        active_threads -= 1
        log_thread_count()


logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/generate")
async def generate(request: Request, background_tasks: BackgroundTasks):
    try:
        data = await request.json()
        config_params, generation_params = validate_and_organize_params(data)

        try:
            if config_params['renderer'] == 'opengl':
                # Start subprocess if renderer is opengl
                command = [
                    "python", "services/generate_manim_python.py", 
                    "--config_params", json.dumps(config_params),
                    "--input_params", json.dumps(generation_params),
                ]
                # print('############### COMMAND ###############', command)
                subprocess.Popen(command)
            else:
                # Otherwise, just render in a thread
                generator = ManimGenerator(config_params)
                generator_thread = threading.Thread(target=generator.run, args=(generation_params,))
                generator_thread.start()
                background_tasks.add_task(background_task, generator_thread)
        except Exception as e:
            logger.error(f"Error generating video: {e}")
            return {"error": str(e)}

        playlist_url = f"{BASE_URL}/{generation_params['output_path']}/playlist.m3u8"
        return {"hls_playlist_url": playlist_url}
    
    except Exception as e:
        logger.error(f"Error generating video: {e}")
        return {"error": str(e)}
    
@router.get("/status")
async def get_status(request: Request, background_tasks: BackgroundTasks):
    print('################ active_threads ################', active_threads)
    if active_threads < 30:
        return {"status": "OK"}
    else:
        return {"status": "FULL"}
   