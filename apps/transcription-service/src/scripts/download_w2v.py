import torch
import torchaudio
import os

def download_w2v():
    print("Downloading Wav2Vec2 model...")
    bundle = torchaudio.pipelines.MMS_FA
    model = bundle.get_model()
    dictionary = bundle.get_dict()
    
    # Create directory if it doesn't exist
    os.makedirs("/app/models", exist_ok=True)
    
    # Save model and dictionary
    torch.save({
        'model_state_dict': model.state_dict(),
        'dictionary': dictionary,
        'sample_rate': bundle.sample_rate
    }, "/app/models/wav2vec2_model.pt")
    print("Model downloaded and saved successfully")

if __name__ == "__main__":
    download_w2v()
