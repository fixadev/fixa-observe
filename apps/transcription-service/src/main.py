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

if os.getenv('ENVIRONMENT') == 'local-staging':
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
        # Convert assistant_overrides to JSON string if provided
        assistant_overrides_str = json.dumps(request.assistant_overrides) if request.assistant_overrides else None

        # Prepare the docker command
        cmd = [
            "docker", "run", "-it", "selenium-agent",
            "--device-id", request.device_id,
            "--assistant-id", request.assistant_id,
            "--base-url", request.base_url
        ]

        # Add assistant_overrides if provided
        if assistant_overrides_str:
            cmd.extend(["--assistant-overrides", assistant_overrides_str])

        # Run the docker container
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Get the call ID from stdout
        call_id = None
        if process.stdout:
          for line in process.stdout:
              if line.startswith("VAPI_CALL_ID="):
                  call_id = line.strip().split("=")[1]
                  break

        return {
            "call_id": call_id,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)