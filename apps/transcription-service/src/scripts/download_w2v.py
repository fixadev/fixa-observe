import torch
import torchaudio
import os
from pathlib import Path

def download_w2v():
    print("Downloading Wav2Vec2 model...")
    bundle = torchaudio.pipelines.MMS_FA
    model = bundle.get_model()
    dictionary = bundle.get_dict()
    
    # Try multiple locations and print permissions
    locations = [
        Path("/app/models"),
        Path.cwd() / "models"
    ]
    
    for loc in locations:
        try:
            print(f"\nTrying location: {loc}")
            loc.mkdir(exist_ok=True, parents=True)
            print(f"Directory created/exists: {loc.exists()}")
            print(f"Directory permissions: {oct(loc.stat().st_mode)[-3:]}")
            
            model_path = loc / "wav2vec2_model.pt"
            
            # Save model and dictionary
            torch.save({
                'model_state_dict': model.state_dict(),
                'dictionary': dictionary,
                'sample_rate': bundle.sample_rate
            }, str(model_path))
            
            if model_path.exists():
                print(f"SUCCESS! Model saved to: {model_path.resolve()}")
                print(f"File size: {model_path.stat().st_size / 1024 / 1024:.2f} MB")
                return
            
        except Exception as e:
            print(f"Failed to save to {loc}: {str(e)}")
    
    raise RuntimeError("Failed to save model to any location")

if __name__ == "__main__":
    download_w2v()
