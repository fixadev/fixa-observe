import base64
import logging
import tempfile
import os
from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketDisconnect
from services.speech_to_text import speech_to_text
from services.llm_response import generate_ai_response
from services.text_to_speech import text_to_speech
from services.animation import generate_animation
from services.combine import combine_audio_video
from services.concatenate import concatenate_videos



logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            logger.debug(f"Received WebSocket data of length: {len(data)}")
            
            audio_data = base64.b64decode(data.split(",")[1])
            logger.debug(f"Decoded audio data of length: {len(audio_data)}")
            
            text = speech_to_text(audio_data)
            logger.debug(f"Speech-to-text result: {text}")
            
            results = generate_ai_response(text)

            combined_segments = []
            with tempfile.TemporaryDirectory() as temp_dir:
                for index, result in enumerate(results):
                    text_response, manim_code = result
                    
                    audio_path = os.path.join(temp_dir, f"audio_{index}.mp3")
                    video_path = os.path.join(temp_dir, f"video_{index}.mp4")
                    segment_path = os.path.join(temp_dir, f"segment_{index}.mp4")
                    
                    text_to_speech(text_response, audio_path)
                    generate_animation(manim_code, video_path)
                    combine_audio_video(video_path, audio_path, segment_path)
                    combined_segments.append(segment_path)
                
                final_output = os.path.join(temp_dir, "final_output.mp4")
                concatenate_videos(combined_segments, final_output)
            
                with open(final_output, "rb") as combined_file:
                    await websocket.send_bytes(combined_file.read())

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    finally:
        logger.info("WebSocket connection closed")