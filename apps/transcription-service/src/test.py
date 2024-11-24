from utils.logger import logger
from services.transcribe import transcribe_with_deepgram
from services.split_channels import split_channels
from services.create_transcript import create_transcript_from_deepgram
import asyncio


async def transcribe(stereo_audio_url: str):
    try: 
        user_audio_path, agent_audio_path = split_channels(stereo_audio_url)
        transcriptions = transcribe_with_deepgram([user_audio_path, agent_audio_path])
        result = create_transcript_from_deepgram(transcriptions[0], transcriptions[1])
        return result
        
    except Exception as e:
        logger.error(f"Deepgram transcription failed: {str(e)}")


if __name__ == "__main__":
    url = 'https://newmark.s3.amazonaws.com/calls/call.WvcoE47BvnHN2yxumeFJPz/audio.wav'
    result = asyncio.run(transcribe(url))
    print(result)
    