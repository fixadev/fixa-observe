def create_transcript_from_deepgram(user_words, agent_words):
    try: 
        """Create segments representing conversation turns between user and agent from Deepgram word alignments."""
        all_chunks = []
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
        
            # Check for gap with previous word (new utterance)
            if i < len(agent_words) - 1 and (agent_words[i+1]['start'] - word['end']) > 1 and agent_words[i+1]['punctuated_word'][0].isupper():
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

        # Find interruptions
        interruptions = []
        for agent_segment in segments:
            if agent_segment['role'] != 'agent':
                continue
                
            agent_start = agent_segment['start']
            agent_end = agent_segment['end']
            
            # Find overlapping user segments
            for user_segment in segments:
                if user_segment['role'] != 'user':
                    continue
                    
                user_start = user_segment['start']
                user_end = user_segment['end']
                
                # Check for overlap
                if agent_start < user_end and agent_end > user_start:
                    # Find agent words spoken during overlap
                    overlap_start = max(agent_start, user_start)
                    overlap_words = []
                    
                    for word in agent_words:
                        if word['start'] >= overlap_start and word['start'] < agent_end:
                            overlap_words.append(word['punctuated_word'])
                    
                    interruptions.append({
                        'secondsFromStart': overlap_start,
                        'duration': agent_end - overlap_start,
                        'text': ' '.join(overlap_words)
                    })
                    break  # Only count one interruption per agent segment
        
        return {'segments': segments, 'interruptions': interruptions}

    except Exception as e:
        print(e)
        return {'segments': [], 'interruptions': []}