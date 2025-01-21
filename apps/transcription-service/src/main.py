import os
from typing import Optional
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer
from utils.logger import logger
from services.transcribe import transcribe_with_deepgram
from services.split_channels import split_channels, cleanup_temp_files
from services.create_transcript import create_transcript_from_deepgram
from utils.auth import authenticate_request

load_dotenv()

app = FastAPI()
security = HTTPBearer()

class TranscribeRequest(BaseModel):
    stereo_audio_url: str
    language: Optional[str] = "en"
    flipped: Optional[bool] = False
class StartWebsocketCallOfOneRequest(BaseModel):
    device_id: str
    assistant_id: str
    assistant_overrides: dict
    base_url: str

@app.get("/", dependencies=[Depends(authenticate_request)])
async def health():
    return {"status": "ok"}

@app.post("/transcribe-deepgram", dependencies=[Depends(authenticate_request)])
async def transcribe(request: TranscribeRequest):
    try: 
        user_audio_path, agent_audio_path = await split_channels(request.stereo_audio_url, request.flipped)
        transcriptions = await transcribe_with_deepgram([user_audio_path, agent_audio_path], request.language or "en")
        transcript = await create_transcript_from_deepgram(transcriptions[0], transcriptions[1], user_audio_path, agent_audio_path)
        cleanup_temp_files(user_audio_path, agent_audio_path)
        return transcript
        
    except Exception as e:
        logger.error(f"Deepgram transcription failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/websocket-call-ofone", dependencies=[Depends(authenticate_request)])
async def start_websocket_call_ofone(request: StartWebsocketCallOfOneRequest):
    try:
        import httpx

        # Prepare the request payload
        payload = {
            "device_id": request.device_id,
            "assistant_id": request.assistant_id,
            "assistant_overrides": request.assistant_overrides,
            "base_url": request.base_url
        }

        # Make the POST request to the kiosk endpoint
        endpoint = os.getenv('RUN_OFONE_KIOSK_ENDPOINT')
        if not endpoint:
            raise HTTPException(status_code=500, detail="RUN_OFONE_KIOSK_ENDPOINT is not set")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                endpoint,
                json=payload,
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Request failed: {response.text}"
                )

            response_data = response.json()
            return {
                "callId": response_data.get("callId")
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
