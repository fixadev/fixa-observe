from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from utils.logger import logger
from services.transcribe import transcribe_with_deepgram
from services.split_channels import split_channels
from services.create_transcript import create_transcript_from_deepgram
import asyncio
from typing import Optional
import json
import subprocess
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

class TranscribeRequest(BaseModel):
    stereo_audio_url: str

class StartWebsocketCallOfOneRequest(BaseModel):
    device_id: str
    assistant_id: str
    assistant_overrides: dict
    base_url: str

@app.get("/")
async def health():
    return {"status": "ok"}

@app.post("/transcribe-deepgram")
async def transcribe(request: TranscribeRequest):
    try: 
        user_audio_path, agent_audio_path = await split_channels(request.stereo_audio_url)
        transcriptions = await transcribe_with_deepgram([user_audio_path, agent_audio_path])
        transcript = await create_transcript_from_deepgram(transcriptions[0], transcriptions[1], user_audio_path, agent_audio_path) # type: ignore
        return transcript
        
    except Exception as e:
        logger.error(f"Deepgram transcription failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/websocket-call-ofone")
async def start_websocket_call_ofone(request: StartWebsocketCallOfOneRequest):
    try:
        import httpx

        # Prepare the request payload
        payload = {
            "deviceId": request.device_id,
            "assistantId": request.assistant_id,
            "assistantOverrides": request.assistant_overrides,
            "baseUrl": request.base_url
        }

        # Make the POST request to Pixa API
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
                    detail=f"Pixa API request failed: {response.text}"
                )

            response_data = response.json()
            return {
                "callId": response_data.get("callId")
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
