import logging
from fastapi import APIRouter, WebSocket, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocketDisconnect
from services.generate_manim_2 import ManimGenerator


logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    generator = ManimGenerator(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print('websocket recieved', data)
            # Ensure previous animation is stopped and resources are cleaned up
            generator.run(data)
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        logger.info("WebSocket connection closed")
