import base64
import logging
import time
from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketDisconnect
from services.speech_to_text import speech_to_text
from services.llm_response import generate_ai_response
from services.text_to_speech import text_to_speech
from services.animation import generate_animation

logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            start_time = time.time()

            data = await websocket.receive_text()
            logger.debug(f"Received WebSocket data of length: {len(data)}")
            
            decode_start = time.time()
            audio_data = base64.b64decode(data.split(",")[1])
            decode_end = time.time()
            logger.debug(f"Decoded audio data of length: {len(audio_data)}")
            logger.info(f"Audio decoding time: {decode_end - decode_start:.2f} seconds")
            
            stt_start = time.time()
            text = speech_to_text(audio_data)
            stt_end = time.time()
            logger.debug(f"Speech-to-text result: {text}")
            logger.info(f"Speech-to-text time: {stt_end - stt_start:.2f} seconds")
            
            ai_start = time.time()
            ai_response = generate_ai_response(text)
            ai_end = time.time()
            print('ai response', ai_response)
            logger.info(f"AI response generation time: {ai_end - ai_start:.2f} seconds")

            tts_start = time.time()
            audio_response = text_to_speech(ai_response)
            tts_end = time.time()
            logger.info(f"Text-to-speech time: {tts_end - tts_start:.2f} seconds")

            anim_start = time.time()
            video_path = generate_animation(ai_response)
            anim_end = time.time()
            logger.info(f"Animation generation time: {anim_end - anim_start:.2f} seconds")
            
            send_start = time.time()
            await websocket.send_text(audio_response)
            await websocket.send_bytes(open(video_path, "rb").read())
            send_end = time.time()
            logger.info(f"Send response time: {send_end - send_start:.2f} seconds")

            end_time = time.time()
            logger.info(f"Total processing time: {end_time - start_time:.2f} seconds")

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    finally:
        logger.info("WebSocket connection closed")