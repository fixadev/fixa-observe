def create_transcript_from_deepgram(user_words, agent_words):
    """Create segments representing conversation turns between user and agent from Deepgram word alignments."""
    # Convert alignments to common format
    all_chunks = []
    
    # Add user alignments
    current_text = []
    current_start = None
    current_end = None
    
    for word in user_words:
        if not current_start:
            current_start = word['start']
        current_text.append(word['punctuated_word'])
        current_end = word['end']
        
        # If word ends with punctuation, create a new chunk
        if word['punctuated_word'][-1] in '.?!':
            all_chunks.append(({
                'timestamp': [current_start, current_end],
                'text': ' '.join(current_text)
            }, 'user'))
            current_text = []
            current_start = None
    
    # Add remaining user text if any
    if current_text:
        all_chunks.append(({
            'timestamp': [current_start, current_end],
            'text': ' '.join(current_text)
        }, 'user'))
    
    # Add agent alignments
    current_text = []
    current_start = None
    current_end = None
    
    for word in agent_words:
        if not current_start:
            current_start = word['start']
        current_text.append(word['punctuated_word'])
        current_end = word['end']
        
        # If word ends with punctuation, create a new chunk
        if word['punctuated_word'][-1] in '.?!':
            all_chunks.append(({
                'timestamp': [current_start, current_end],
                'text': ' '.join(current_text)
            }, 'agent'))
            current_text = []
            current_start = None
    
    # Add remaining agent text if any
    if current_text:
        all_chunks.append(({
            'timestamp': [current_start, current_end],
            'text': ' '.join(current_text)
        }, 'agent'))

    # Sort by start time
    all_chunks.sort(key=lambda x: x[0]['timestamp'][0])
    
    segments = []
    current_chunks = []
    current_speaker = all_chunks[0][1] if all_chunks else None
    
    for chunk, speaker in all_chunks:
        if speaker != current_speaker:
            # Speaker changed, create new segment
            if current_chunks:
                segments.append({
                    'role': current_speaker,
                    'text': f"{' '.join(c['text'].strip() for c in current_chunks)}",
                    'start': current_chunks[0]['timestamp'][0],
                    'end': current_chunks[-1]['timestamp'][1]
                })
                current_chunks = []
            current_speaker = speaker
        current_chunks.append(chunk)
    
    # Add final segment
    if current_chunks:
        segments.append({
            'role': current_speaker,
            'text': f"{' '.join(c['text'].strip() for c in current_chunks)}",
            'start': current_chunks[0]['timestamp'][0],
            'end': current_chunks[-1]['timestamp'][1]
        })
    
    return segments

