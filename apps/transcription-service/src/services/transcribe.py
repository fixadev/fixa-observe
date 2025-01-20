import os
from typing import List
import asyncio
import aiofiles
from dotenv import load_dotenv

load_dotenv()

from deepgram import (
    DeepgramClient,
    PrerecordedOptions,
    FileSource,
    ListenRESTWord,
)

async def transcribe_with_deepgram(audio_paths: List[str | None], language: str = "en"):
    try:
        deepgram_client = DeepgramClient(os.getenv("DEEPGRAM_API_KEY"))
        tasks = []
        
        for audio_path in audio_paths[:2]:  # Process first two audio files
            if not audio_path or not os.path.exists(audio_path):
                print(f"Audio file does not exist: {audio_path}")
                tasks.append(asyncio.create_task(asyncio.sleep(0)))  # dummy task
                continue
                
            tasks.append(
                asyncio.create_task(
                    process_single_file(deepgram_client, audio_path, language)
                )
            )

        responses = await asyncio.gather(*tasks, return_exceptions=True)
        return [[] if isinstance(r, Exception) else r for r in responses]

    except Exception as e:
        print(f"Deepgram transcription failed: {str(e)}")
        raise e

async def process_single_file(deepgram_client: DeepgramClient, audio_path: str, language: str = "en"):
    async with aiofiles.open(audio_path, "rb") as audio_file:
        buffer_data = await audio_file.read()

    payload: FileSource = {
        "buffer": buffer_data,
    }

    options = PrerecordedOptions(
        model="whisper-large" if language == "he" else "nova-2",
        smart_format=True,
        language=language,
    )

    response = await deepgram_client.listen.asyncrest.v("1").transcribe_file(payload, options)   # type: ignore
    return response.results.channels[0].alternatives[0].words # type: ignore

if __name__ == "__main__":
    paths = [
        "src/services/test_audio1.wav",
        "src/services/test_audio2.wav",
    ]
    
    try:
        results = asyncio.run(transcribe_with_deepgram(paths, language="en"))
        for i, result in enumerate(results):
            print(f"\nTranscription {i+1}:")
            print(result.to_json(indent=4))
    except Exception as e:
        print(f"Error: {e}")
