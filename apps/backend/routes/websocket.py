import base64
import logging
import tempfile
import os
from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketDisconnect
from services.speech_to_text import speech_to_text
from services.text_to_speech import text_to_speech
from services.execute_code import generate_animation
from services.combine import combine_audio_video
from services.concatenate import concatenate_videos
from services.llm_initial import generate_segments
from services.llm_codegen import generate_manim




logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            logger.debug(f"Received WebSocket data of length: {len(data)}")
            
            # audio_data = base64.b64decode(data.split(",")[1])
            # logger.debug(f"Decoded audio data of length: {len(audio_data)}")
            
            # text = speech_to_text(audio_data)
            text = "teach me about physics"

            logger.debug(f"Speech-to-text result: {text}")
            
            text_segments = generate_segments(text)

            combined_segments = []
            with tempfile.TemporaryDirectory() as temp_dir:
                for index, segment_text in enumerate(text_segments):
                    print('===============SEGMENT IS===============\n', segment_text)
                    segment_code = generate_manim(segment_text)
                    print('===============MANIM CODE IS===============\n', segment_code)

                    audio_path = os.path.join(temp_dir, f"audio_{index}.mp3")
                    video_path = os.path.join(temp_dir, f"video_{index}.mp4")
                    completed_segment_path = os.path.join(temp_dir, f"segment_{index}.mp4")
                    
                    text_to_speech(segment_text, audio_path)
                    generate_animation(segment_code, video_path)
                    combine_audio_video(video_path, audio_path, completed_segment_path)

                    with open(completed_segment_path, "rb") as segment_file:
                        segment_data = segment_file.read()
                        print('sending segment')
                        await websocket.send_bytes(segment_data)
                        print('segment sent!')

                    combined_segments.append(completed_segment_path)
                
                await websocket.send_bytes(b"EOF")

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    finally:
        logger.info("WebSocket connection closed")