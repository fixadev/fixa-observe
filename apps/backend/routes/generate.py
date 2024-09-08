import logging
from fastapi import APIRouter, Request, BackgroundTasks
from services.generate_manim_python import ManimGenerator
import threading
import uuid
import queue

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
        prompt = data.get("prompt")
        output_queue = queue.Queue()
        generator = ManimGenerator(output_queue)
        
        generator_thread = threading.Thread(target=generator.run, args=(prompt, f"public/hls/{uuid.uuid4()}"))
        generator_thread.start()

        background_tasks.add_task(background_task, generator_thread)
        
        while generator_thread.is_alive():
            try:
                hls_playlist_url = output_queue.get(timeout=0.1)  
                return {"hls_playlist_url": hls_playlist_url}
            except queue.Empty:
                pass
        return {"error": "Error generating video"}
    
    except Exception as e:
        logger.error(f"Error generating video: {e}")
        return {"error": str(e)}




