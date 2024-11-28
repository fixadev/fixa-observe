import torch
import torchaudio
import torchaudio.functional as F
from typing import List, Tuple

# Global model variables
W2V_MODEL = None
W2V_BUNDLE = None
W2V_DICTIONARY = None
W2V_DEVICE = None

def load_w2v_model():
    """Initialize the Wav2Vec2 model and related components from saved file"""
    global W2V_MODEL, W2V_BUNDLE, W2V_DICTIONARY, W2V_DEVICE
    
    if W2V_MODEL is None:
        print("Loading Wav2Vec2 model from saved file...")
        # Load the saved model
        checkpoint = torch.load("/app/models/wav2vec2_model.pt")
        
        # Initialize the bundle and model
        W2V_BUNDLE = torchaudio.pipelines.MMS_FA
        W2V_MODEL = W2V_BUNDLE.get_model()
        W2V_MODEL.load_state_dict(checkpoint['model_state_dict'])
        
        # Set device
        W2V_DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'
        W2V_MODEL = W2V_MODEL.to(W2V_DEVICE)
        
        # Load dictionary
        W2V_DICTIONARY = checkpoint['dictionary']
        print(f"Wav2Vec2 model loaded successfully on {W2V_DEVICE}")

def w2v_align(audio_text_pairs: List[Tuple[str, str]]) -> List[List[Tuple[str, float, float]]]:
    """Aligns multiple audio files with their transcript texts using Wav2Vec2 forced alignment.
    
    Args:
        audio_text_pairs: List of tuples containing (audio_url, text) pairs to align
        
    Returns:
        List of alignments, where each alignment is a list of tuples containing 
        (word, start_time, end_time) for each aligned word
    """
    if not audio_text_pairs:
        raise ValueError("Empty input list provided")

    # Ensure model is loaded
    load_w2v_model()
    
    all_alignments = []
    
    for audio_path, transcript in audio_text_pairs:
        if not transcript or not transcript.strip():
            raise ValueError(f"Empty transcript text provided for audio {audio_path}")
        
        # Load and resample audio
        waveform, sample_rate = torchaudio.load(str(audio_path))
        waveform = F.resample(waveform, sample_rate, W2V_BUNDLE.sample_rate)
        
        # Move waveform to same device as model
        waveform = waveform.to(W2V_DEVICE)
        
        # Get emission probabilities
        with torch.inference_mode():
            emission, _ = W2V_MODEL(waveform)
            
        # Prepare inputs
        words = transcript.split()
        
        # Convert to lowercase and handle punctuation
        tokenized = []
        for word in words:
            # Convert to lowercase and remove punctuation
            cleaned_word = ''.join(c.lower() for c in word if c.isalnum() or c.isspace())
            
            # Tokenize each character
            word_tokens = [W2V_DICTIONARY[c] for c in cleaned_word]
            tokenized.extend(word_tokens)
        
        print(f"Final tokenized sequence length: {len(tokenized)}")
        
        targets = torch.tensor([tokenized], dtype=torch.int32, device=W2V_DEVICE)
        input_lengths = torch.tensor([emission.size(1)], device=W2V_DEVICE)
        target_lengths = torch.tensor([len(tokenized)], device=W2V_DEVICE)
        
        # Get alignments
        aligned_tokens, scores = F.forced_align(
            emission, targets, input_lengths, target_lengths, blank=0
        )
        token_spans = F.merge_tokens(aligned_tokens[0], scores[0])
        # Group into words
        word_spans = []
        i = 0
        for word in words:
            cleaned_word = ''.join(c.lower() for c in word if c.isalnum() or c.isspace())
            if not cleaned_word:  # Skip empty words
                continue
            word_len = len(cleaned_word)
            if i + word_len > len(token_spans):
                print(f"Warning: Token spans shorter than expected for word '{word}'")
                print(f"Expected index: {i}, Word length: {word_len}, Token spans length: {len(token_spans)}")
                break
            word_spans.append(token_spans[i:i+word_len])
            i += word_len
            
        # Convert to time
        ratio = waveform.size(1) / emission.size(1)
        alignments = []
        last_end_time = 0  # Track the last word's end time
        
        for spans, word in zip(word_spans, words):
            if not spans:  # Skip if no spans for this word
                continue
            
            start_time = (ratio * spans[0].start) / W2V_BUNDLE.sample_rate
            end_time = (ratio * spans[-1].end) / W2V_BUNDLE.sample_rate
            
            # Ensure sequential timing
            if start_time < last_end_time:
                print(f"Warning: Adjusting start time for '{word}' from {start_time:.3f} to {last_end_time:.3f}")
                start_time = last_end_time
                end_time = max(end_time, start_time + 0.1)  # Ensure minimum duration
            
            # # Sanity checks
            # duration = end_time - start_time
            # if duration > 2.0:  # Max reasonable word duration
            #     print(f"Warning: Unreasonable duration for '{word}': {duration:.3f}s")
            #     continue
            # if duration < 0:  # Negative duration
            #     print(f"Warning: Negative duration for '{word}': {duration:.3f}s")
            #     continue
            
            alignments.append((word, start_time, end_time))
            last_end_time = end_time  # Update last end time
            
        all_alignments.append(alignments)
            
    return all_alignments

def refine_word_alignment(audio_path: str, word: str, start_time: float, end_time: float, 
                         padding: float = 0.5) -> Tuple[float, float]:
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
    # Ensure model is loaded
    load_w2v_model()
    
    # Load full audio
    waveform, sample_rate = torchaudio.load(str(audio_path))
    
    # Calculate sample indices
    start_sample = max(0, int((start_time - padding) * sample_rate))
    end_sample = min(waveform.size(1), int((end_time + padding) * sample_rate))
    
    # Extract the relevant audio segment
    segment = waveform[:, start_sample:end_sample]
    
    # Resample if needed
    segment = F.resample(segment, sample_rate, W2V_BUNDLE.sample_rate)
    segment = segment.to(W2V_DEVICE)
    
    # Get emission probabilities for the segment
    with torch.inference_mode():
        emission, _ = W2V_MODEL(segment)
    
    # Prepare the word for alignment
    cleaned_word = ''.join(c.lower() for c in word if c.isalnum() or c.isspace())
    word_tokens = [W2V_DICTIONARY[c] for c in cleaned_word]
    
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
    
    return refined_start, refined_end

def refine_deepgram_alignment(audio_path: str, 
                            deepgram_words: List[dict]) -> List[Tuple[str, float, float]]:
    """Refines Deepgram word-level alignments using Wav2Vec2.
    
    Args:
        audio_path: Path to the audio file
        deepgram_words: List of Deepgram word objects with 'word', 'start', and 'end' keys
    
    Returns:
        List of (word, refined_start_time, refined_end_time) tuples
    """
    refined_alignments = []
    
    for word_info in deepgram_words:
        word = word_info['word']
        start = word_info['start']
        end = word_info['end']
        
        refined_start, refined_end = refine_word_alignment(
            audio_path, word, start, end
        )
        refined_alignments.append({
            'word': word,
            'start': refined_start,
            'end': refined_end
        })
    
    return refined_alignments

if __name__ == "__main__":
    # Example usage
    test_pairs = [
        ("https://newmark.s3.amazonaws.com/temp_e52184c0-4d7c-42aa-b3a8-5113e617d744_left.wav",
         "Hey, can I book an appointment please? My name is Johnny Appleseed. To get my teeth looked at. Where's my phone? why are you transferring"),
        ("https://newmark.s3.amazonaws.com/temp_e52184c0-4d7c-42aa-b3a8-5113e617d744_right.wav",
         "Hello, this is Mary from Mary's Dental. How can I assist you today? Of course. What's your full name? Nice name, Johnny. What's the purpose of your appointment? Sure thing. When would you like to come in? Give me your preferred date and time. Transferring the call now. Hold on. I'm transferring you to someone who can assist better.")
    ]
    all_alignments = w2v_align(test_pairs)
    for i, alignments in enumerate(all_alignments):
        print(f"\nAlignments for audio {i}:")
        for word, start, end in alignments:
            print(f"{word}: {start:.3f}s - {end:.3f}s")

