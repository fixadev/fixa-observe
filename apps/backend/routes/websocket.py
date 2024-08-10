import base64
from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketDisconnect
from services.speech_to_text import speech_to_text
from services.llm_response import generate_ai_response
from services.text_to_speech import text_to_speech
from services.animation import generate_animation

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            audio_data = base64.b64decode(data.split(",")[1])
            
            text = speech_to_text(audio_data)
            ai_response = generate_ai_response(text)
            audio_response = text_to_speech(ai_response)
            video_path = generate_animation(ai_response)
            
            await websocket.send_text(audio_response)
            await websocket.send_bytes(open(video_path, "rb").read())
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    finally:
        print("WebSocket connection closed")