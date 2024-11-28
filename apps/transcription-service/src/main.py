from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from utils.logger import logger
from services.transcribe import transcribe_with_deepgram
from services.split_channels import split_channels
from services.create_transcript import create_transcript_from_deepgram
from services.align2 import refine_deepgram_alignment

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
        return create_transcript_from_deepgram(transcriptions[0], transcriptions[1])
        
    except Exception as e:
        logger.error(f"Deepgram transcription failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transcribe-w2v")
async def transcribe_w2v(request: TranscribeRequest):
    try: 
        user_audio_path, agent_audio_path = split_channels(request.stereo_audio_url)
        transcriptions = transcribe_with_deepgram([user_audio_path, agent_audio_path])
        user_alignments = refine_deepgram_alignment(user_audio_path, transcriptions[0])
        agent_alignments = refine_deepgram_alignment(agent_audio_path, transcriptions[1])
        return create_transcript_from_deepgram(user_alignments, agent_alignments)
        
    except Exception as e:
        logger.error(f"Wav2Vec2 transcription failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)