import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from services.generate_manim_python import ManimGenerator


logger = logging.getLogger(__name__)
router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    generator = ManimGenerator(websocket)
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print('websocket recieved', data)
            # Ensure previous animation is stopped and resources are cleaned up
            generator.run(data)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        if generator.running:
            generator.cleanup()
        logger.info("WebSocket disconnected")

    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        if generator.running:
            generator.cleanup()
    finally:
        logger.info("WebSocket connection closed")
