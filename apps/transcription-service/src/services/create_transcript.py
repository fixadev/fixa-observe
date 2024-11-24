def create_transcript_from_deepgram(user_words, agent_words):
    # print(user_words)
    print(agent_words)
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

    for i, word in enumerate(agent_words):
        if not current_start:
            current_start = word['start']
        current_text.append(word['punctuated_word'])
        current_end = word['end']
       
        # Check for gap with previous word
        if i < len(agent_words) - 1 and (agent_words[i+1]['start'] - word['end']) > 1:
            print(f"gap found for {word['punctuated_word']}")
            print(f"current text is {current_text}")
            # Create chunk for previous text if exists
            if current_text:
                all_chunks.append(({
                    'timestamp': [current_start, current_end],
                    'text': ' '.join(current_text)
                }, 'agent'))
                current_text = []
                current_start = None
            continue
        
        # If word ends with punctuation
        if word['punctuated_word'][-1] in '.?!':
            all_chunks.append(({
                'timestamp': [current_start, current_end],
                'text': ' '.join(current_text)
            }, 'agent'))
            current_text = []
            current_start = None
            continue
    
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

        # splits new utterances
        if speaker != current_speaker or (current_chunks and (chunk['timestamp'][0] - current_chunks[-1]['timestamp'][1]) > 1 and chunk['text'][0].isupper()):
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

