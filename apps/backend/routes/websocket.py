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
            
            text_response, manim_code = generate_ai_response(text)
            with tempfile.TemporaryDirectory() as temp_dir:
                audio_path = os.path.join(temp_dir, "audio.mp3")
                video_path = os.path.join(temp_dir, "video.mp4")
                combined_path = os.path.join(temp_dir, "combined.mp4")
                text_to_speech(text_response, audio_path)
                generate_animation(manim_code, video_path)
                combine_audio_video(video_path, audio_path, combined_path)
                
                with open(combined_path, "rb") as combined_file:
                    await websocket.send_bytes(combined_file.read())

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    finally:
        logger.info("WebSocket connection closed")