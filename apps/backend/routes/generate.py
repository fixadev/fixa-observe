import logging
from fastapi import APIRouter, Request, BackgroundTasks
from services.generate_manim_python import ManimGenerator
import threading
import uuid
import queue


logger = logging.getLogger(__name__)
router = APIRouter()

def background_task(generator_thread):
    generator_thread.join()
    print("Generation thread completed")

@router.post("/generate")
async def generate(request: Request, background_tasks: BackgroundTasks):
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




