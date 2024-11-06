def create_segments_from_words(user_words, agent_words):
    """Create segments representing conversation turns between user and agent."""
    segments = []
    
    # Initialize variables for tracking turns
    current_user_words = []
    current_agent_words = []
    
    # Combine and sort all words by start time
    all_words = [(word, 'user') for word in user_words] + [(word, 'agent') for word in agent_words]
    all_words.sort(key=lambda x: x[0].start)
    
    # Set initial speaker based on first word
    current_speaker = all_words[0][1] if all_words else None
    
    # Process words into turns
    for word, speaker in all_words:
        # If speaker changes, create segment for previous turn
        if speaker != current_speaker:
            if current_speaker == 'user' and current_user_words:
                segments.append({
                    'text': "User: " + ' '.join(w.word for w in current_user_words),
                    'start': current_user_words[0].start,
                    'end': current_user_words[-1].end
                })
                current_user_words = []
            elif current_speaker == 'agent' and current_agent_words:
                segments.append({
                    'text': "AI: " + ' '.join(w.word for w in current_agent_words),
                    'start': current_agent_words[0].start,
                    'end': current_agent_words[-1].end
                })
                current_agent_words = []
            current_speaker = speaker
            
        # Add word to current turn
        if speaker == 'user':
            current_user_words.append(word)
        else:
            current_agent_words.append(word)
    
    # Add final turn if any words remain
    if current_user_words:
        segments.append({
            'text': "User: " + ' '.join(w.word for w in current_user_words),
            'start': current_user_words[0].start,
            'end': current_user_words[-1].end
        })
    if current_agent_words:
        segments.append({
            'text': "AI: " + ' '.join(w.word for w in current_agent_words),
            'start': current_agent_words[0].start,
            'end': current_agent_words[-1].end
        })
    
    return segments
