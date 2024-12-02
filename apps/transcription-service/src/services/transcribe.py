import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

from deepgram import (
    DeepgramClient,
    PrerecordedOptions,
    FileSource,
)

def transcribe_with_deepgram(audio_paths: List[str | None]):
    try:
        deepgram_client = DeepgramClient(os.getenv("DEEPGRAM_API_KEY"))
        responses = []
        
        for audio_path in audio_paths[:2]:  # Process first two audio files
            if not audio_path or not os.path.exists(audio_path):
                print(f"Audio file does not exist: {audio_path}")
                responses.append([])
                continue
            with open(audio_path, "rb") as audio_file:
                buffer_data = audio_file.read()

            payload: FileSource = {
                "buffer": buffer_data,
            }

            options = PrerecordedOptions(
                model="nova-2",
                smart_format=True,
            )

            response = deepgram_client.listen.rest.v("1").transcribe_file(payload, options)
            
            responses.append(response.results.channels[0].alternatives[0].words)

        return responses

    except Exception as e:
        print(f"Deepgram transcription failed: {str(e)}")
        raise e

if __name__ == "__main__":
    paths = [
        "src/services/test_audio1.wav",
        "src/services/test_audio2.wav",
    ]
    
    try:
        results = transcribe_with_deepgram(paths)
        for i, result in enumerate(results):
            print(f"\nTranscription {i+1}:")
            print(result.to_json(indent=4))
    except Exception as e:
        print(f"Error: {e}")
