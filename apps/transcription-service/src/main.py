from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from vapi_python import OfOneClient
from utils.logger import logger
from services.transcribe import transcribe_with_deepgram
from services.split_channels import split_channels
from services.create_transcript import create_transcript_from_deepgram
import time
import threading

if os.getenv('ENVIRONMENT') == 'local-staging':
  from dotenv import load_dotenv
  load_dotenv()

app = FastAPI()

class TranscribeRequest(BaseModel):
    stereo_audio_url: str

class StartWebsocketCallOfOneRequest(BaseModel):
    device_id: str
    test_agent_vapi_id: str
    test_agent_prompt: str
    scenario_prompt: str

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
    client = OfOneClient(request.device_id, request.test_agent_vapi_id, request.test_agent_prompt, request.scenario_prompt)
    call_id = client.start_call()
    threading.Thread(target=client.listen_for_check_state_events).start()
    
    return {"callId": call_id}
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

"""
curl -X POST http://localhost:8000/transcribe-deepgram -H "Content-Type: application/json" -d '{"stereo_audio_url": "https://storage.vapi.ai/123fdbc6-bb4f-425a-b3bd-3c1165a3b3a7-1733193612534-2f8659f7-0b6d-444c-8e11-6acaa4cbb448-stereo.wav"}'
"""