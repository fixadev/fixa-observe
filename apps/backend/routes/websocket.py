import base64
import logging
import tempfile
import os
from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketDisconnect
from services.generate_manim_2 import ManimGenerator


logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            generator = ManimGenerator(websocket)
            generator.run(data)

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    finally:
        logger.info("WebSocket connection closed")