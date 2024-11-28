import torch
import torchaudio
import torchaudio.functional as F
from typing import List, Tuple
from utils.logger import logger
import os
from pathlib import Path

# Global model variables
W2V_MODEL = None
W2V_BUNDLE = None
W2V_DICTIONARY = None
W2V_DEVICE = None

def load_w2v_model():
    """Initialize the Wav2Vec2 model and related components from saved file"""
    global W2V_MODEL, W2V_BUNDLE, W2V_DICTIONARY, W2V_DEVICE
    
    try:
        if W2V_MODEL is None:
            logger.info("Loading Wav2Vec2 model from saved file...")
            # Load the saved model
            checkpoint = torch.load("/models/wav2vec2_model.pt", weights_only=True)
            
            # Initialize the bundle and model
            W2V_BUNDLE = torchaudio.pipelines.MMS_FA
            W2V_MODEL = W2V_BUNDLE.get_model()
            W2V_MODEL.load_state_dict(checkpoint['model_state_dict'])
            
            # Set device
            W2V_DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'
            W2V_MODEL = W2V_MODEL.to(W2V_DEVICE)
            
            # Load dictionary
            W2V_DICTIONARY = checkpoint['dictionary']
            logger.info(f"Wav2Vec2 model loaded successfully on {W2V_DEVICE}")
    except Exception as e:
        logger.error(f"Failed to load Wav2Vec2 model: {str(e)}")
        raise

def refine_deepgram_alignment(audio_path: str, 
                            deepgram_words: List[dict]) -> List[dict]:
    """Refines Deepgram word-level alignments using Wav2Vec2 in one pass.
    
    Args:
        audio_path: Path to the audio file
        deepgram_words: List of Deepgram word objects
    
    Returns:
        List of dicts with word alignments
    """
    try:
        # Ensure model is loaded
        load_w2v_model()
        
        # Load full audio
        waveform, sample_rate = torchaudio.load(str(audio_path))
        
        # Resample if needed
        waveform = F.resample(waveform, sample_rate, W2V_BUNDLE.sample_rate)
        waveform = waveform.to(W2V_DEVICE)
        
        # Get emission probabilities for full audio
        with torch.inference_mode():
            emission, _ = W2V_MODEL(waveform)
            
        # Prepare full text for alignment
        words = []
        tokenized = []
        for word_info in deepgram_words:
            word = word_info['word']
            # Skip numbers and special characters
            if word.isdigit() or not any(c.isalnum() for c in word):
                continue
                
            cleaned_word = ''.join(c.lower() for c in word if c.isalnum() or c.isspace())
            if not cleaned_word:
                continue
                
            try:
                word_tokens = [W2V_DICTIONARY[c] for c in cleaned_word]
                tokenized.extend(word_tokens)
                words.append((word, len(word_tokens), word_info['punctuated_word']))
            except KeyError:
                logger.warning(f"Word '{word}' contains characters not in dictionary")
                continue
        
        # Create tensors for alignment
        targets = torch.tensor([tokenized], dtype=torch.int32, device=W2V_DEVICE)
        input_lengths = torch.tensor([emission.size(1)], device=W2V_DEVICE)
        target_lengths = torch.tensor([len(tokenized)], device=W2V_DEVICE)
        
        # Get alignment for full sequence
        aligned_tokens, scores = F.forced_align(
            emission, targets, input_lengths, target_lengths, blank=0
        )
        token_spans = F.merge_tokens(aligned_tokens[0], scores[0])
        
        # Convert to word-level alignments
        ratio = waveform.size(1) / emission.size(1)
        refined_alignments = []
        token_idx = 0
        
        for word, num_tokens, punctuated_word in words:
            if token_idx + num_tokens > len(token_spans):
                break
                
            word_spans = token_spans[token_idx:token_idx + num_tokens]
            start_time = (ratio * word_spans[0].start) / W2V_BUNDLE.sample_rate
            end_time = (ratio * word_spans[-1].end) / W2V_BUNDLE.sample_rate
            
            refined_alignments.append({
                'word': word,
                'start': round(start_time, 2),
                'end': round(end_time, 2),
                'punctuated_word': punctuated_word
            })
            
            logger.info(f"{word}: {start_time:.3f}s - {end_time:.3f}s")
            token_idx += num_tokens
            
        return refined_alignments
        
    except Exception as e:
        logger.error(f"Failed to refine alignments: {str(e)}")
        return deepgram_words  # Return original alignments on failure
