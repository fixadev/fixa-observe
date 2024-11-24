from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from utils.logger import logger
from services.transcribe import transcribe_with_deepgram
from services.split_channels import split_channels
from services.create_transcript import create_transcript_from_deepgram
if os.getenv('ENVIRONMENT') == 'local-staging':
  from dotenv import load_dotenv
  load_dotenv()

app = FastAPI()

class TranscribeRequest(BaseModel):
    stereo_audio_url: str


@app.get("/")
async def health():
    return {"status": "ok"}


@app.post("/transcribe-deepgram")
async def transcribe(request: TranscribeRequest):
    try: 
        user_audio_path, agent_audio_path = split_channels(request.stereo_audio_url)
        transcriptions = transcribe_with_deepgram([user_audio_path, agent_audio_path])
        transcript = create_transcript_from_deepgram(transcriptions[0], transcriptions[1])
        return transcript
        
    except Exception as e:
        logger.error(f"Deepgram transcription failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)