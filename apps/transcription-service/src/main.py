from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from vapi_python import OfOneClient
from utils.logger import logger
from services.transcribe import transcribe_with_deepgram
from services.split_channels import split_channels
from services.create_transcript import create_transcript_from_deepgram
import asyncio

# comment to redeploy
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
        client_args = {
            'device_id': request.device_id,
            'assistant_id': request.assistant_id,
            'assistant_overrides': request.assistant_overrides,
            'base_url': request.base_url
        }
        
        client = OfOneClient(**client_args)
        call_id = await client.start_call()
        
        asyncio.create_task(client.listen_for_check_state_events())
            
        return {"callId": call_id}
    except Exception as e:
        logger.error(f"Error starting OFONE call: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

"""
curl -X POST http://localhost:8000/transcribe-deepgram -H "Content-Type: application/json" -d '{"stereo_audio_url": "https://storage.vapi.ai/123fdbc6-bb4f-425a-b3bd-3c1165a3b3a7-1733193612534-2f8659f7-0b6d-444c-8e11-6acaa4cbb448-stereo.wav"}'
"""