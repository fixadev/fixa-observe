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

def refine_word_alignment(audio_path: str, word: str, start_time: float, end_time: float, 
                         padding: float = 3) -> Tuple[float, float]:
    """Refines the alignment for a single word using a small audio window around it.
    
    Args:
        audio_path: Path to the audio file
        word: The word to align
        start_time: Initial start time from Deepgram (in seconds)
        end_time: Initial end time from Deepgram (in seconds)
        padding: Amount of padding to add before/after the word (in seconds)
    
    Returns:
        Tuple of (refined_start_time, refined_end_time)
    """
    try:
        # Ensure model is loaded
        load_w2v_model()

         # Handle numbers and special characters
        if word.isdigit() or not any(c.isalnum() for c in word):
            # Return original timestamps for numbers or special characters
            return start_time, end_time
            
        
        # Create debug directory
        debug_dir = Path("debug_audio")
        debug_dir.mkdir(exist_ok=True)
        
        # Load full audio
        waveform, sample_rate = torchaudio.load(str(audio_path))
        
        # Calculate sample indices
        start_sample = max(0, int((start_time - padding) * sample_rate))
        end_sample = min(waveform.size(1), int((end_time + padding) * sample_rate))
        
        # Extract the relevant audio segment
        segment = waveform[:, start_sample:end_sample]
        
        # Save original segment

        segment_path = debug_dir / f"{start_time:.2f}_{end_time:.2f}_{word}_original.wav"
        torchaudio.save(str(segment_path), segment, sample_rate)
        
        # Resample if needed
        segment = F.resample(segment, sample_rate, W2V_BUNDLE.sample_rate)
        resampled_path = debug_dir / f"{start_time:.2f}_{end_time:.2f}_{word}_resampled.wav"
        torchaudio.save(str(resampled_path), segment.cpu(), W2V_BUNDLE.sample_rate)
        
        segment = segment.to(W2V_DEVICE)
       
        
        # Get emission probabilities for the segment
        with torch.inference_mode():
            emission, _ = W2V_MODEL(segment)
        
        
        # Prepare the word for alignment
        cleaned_word = ''.join(c.lower() for c in word if c.isalnum() or c.isspace())
        if not cleaned_word:  # If no valid characters remain
            return start_time, end_time
            
        try:
            word_tokens = [W2V_DICTIONARY[c] for c in cleaned_word]
        except KeyError:
            # If any character isn't in dictionary, return original timestamps
            logger.warning(f"Word '{word}' contains characters not in dictionary")
            return start_time, end_time
        
        # Create tensors for alignment
        targets = torch.tensor([word_tokens], dtype=torch.int32, device=W2V_DEVICE)
        input_lengths = torch.tensor([emission.size(1)], device=W2V_DEVICE)
        target_lengths = torch.tensor([len(word_tokens)], device=W2V_DEVICE)
        
        # Get alignment
        aligned_tokens, scores = F.forced_align(
            emission, targets, input_lengths, target_lengths, blank=0
        )
        token_spans = F.merge_tokens(aligned_tokens[0], scores[0])
        
        # Convert to absolute time
        ratio = segment.size(1) / emission.size(1)
        segment_start_time = start_sample / sample_rate
        
        refined_start = segment_start_time + (ratio * token_spans[0].start) / W2V_BUNDLE.sample_rate
        refined_end = segment_start_time + (ratio * token_spans[-1].end) / W2V_BUNDLE.sample_rate
        
        print(f"{word}: {refined_start:.3f}s - {refined_end:.3f}s")
        
        return refined_start, refined_end
        
    except Exception as e:
        logger.error(f"Failed to refine alignment for word '{word}': {str(e)}")
        # Fall back to original timestamps if alignment fails
        return start_time, end_time

def refine_deepgram_alignment(audio_path: str, 
                            deepgram_words: List[dict]) -> List[dict]:
    """Refines Deepgram word-level alignments using Wav2Vec2.
    
    Args:
        audio_path: Path to the audio file
        deepgram_words: List of Deepgram word objects with 'word', 'start', and 'end' keys
    
    Returns:
        List of dicts with 'word', 'start', and 'end' keys containing refined timestamps
    """
    try:
        refined_alignments = []
        
        for word_info in deepgram_words:
            try:
                word = word_info['word']
                start = word_info['start']
                end = word_info['end']
                punctuated_word = word_info['punctuated_word']
                
                refined_start, refined_end = refine_word_alignment(
                    audio_path, word, start, end
                )
                refined_alignments.append({
                    'word': word,
                    'start': round(refined_start, 2),
                    'end': round(refined_end, 2),
                    'punctuated_word': punctuated_word
                })
                print(f"{word}: {refined_start:.3f}s - {refined_end:.3f}s")
            except Exception as e:
                logger.error(f"Failed to process word '{word_info.get('word', '')}': {str(e)}")
                refined_alignments.append(word_info)  # Keep original word info on failure
        
        return refined_alignments
    except Exception as e:
        logger.error(f"Failed to refine alignments: {str(e)}")
        return deepgram_words  # Return original alignments on failure
