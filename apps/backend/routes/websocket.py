import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.generate_manim_python import ManimGenerator
import threading
import uuid
import os
import shutil


logger = logging.getLogger(__name__)
router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        connection_id = str(uuid.uuid4())
        self.active_connections[connection_id] = websocket
        return connection_id

    def disconnect(self, connection_id: str):
        self.active_connections.pop(connection_id, None)

    async def send_personal_message(self, message: str, connection_id: str):
        if websocket := self.active_connections.get(connection_id):
            await websocket.send_text(message)

    async def broadcast(self, message: str):
        for websocket in self.active_connections.values():
            await websocket.send_text(message)


manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    generator = ManimGenerator(websocket)
    request_num = 0
    connection_id = await manager.connect(websocket)
    generator_thread = None
    try:
        while True:
            prompt = await websocket.receive_text()
            # Ensure previous animation is stopped and resources are cleaned up
            connection_string = str(connection_id)
            generator_thread = threading.Thread(target=generator.run, args=(prompt, f"public/hls/{connection_string}/{str(request_num)}"))
            generator_thread.start()
            request_num += 1
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        if generator_thread:
            generator_thread.join()
        if os.path.exists(f"public/hls/{connection_id}"):
            shutil.rmtree(f"public/hls/{connection_id}")
        logger.info("WebSocket disconnected")

    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        if generator_thread:
            generator_thread.join()
    finally:
        logger.info("WebSocket connection closed")
        if os.path.exists(f"public/hls/{connection_id}"):
            shutil.rmtree(f"public/hls/{connection_id}")
