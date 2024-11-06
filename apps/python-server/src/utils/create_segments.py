def create_segments_from_words(user_words, agent_words):
    """Create segments representing conversation turns between user and agent."""
    # Combine and sort all words by start time
    all_words = [(word, 'user') for word in user_words] + [(word, 'agent') for word in agent_words]
    all_words.sort(key=lambda x: x[0].start)
    
    segments = []
    current_words = []
    current_speaker = all_words[0][1] if all_words else None

    print("=========all_words=========")
    # Debug print
    print("Words in conversation:")
    for word in all_words:
        print(f"Word: {word[0].word:<20} "
              f"Start: {word[0].start:<8.2f} "
              f"End: {word[0].end:<8.2f} "
              f"Speaker: {word[1]}")
    
    for word, speaker in all_words:
        if speaker != current_speaker:
            # Speaker changed, create new segment
            if current_words:
                segments.append({
                    'text': f"{'User' if current_speaker == 'user' else 'AI'}: {' '.join(w.word for w in current_words)}",
                    'start': current_words[0].start,
                    'end': current_words[-1].end
                })
            current_words = []
            current_speaker = speaker
        current_words.append(word)
        
    # Add final segment
    if current_words:
        segments.append({
            'text': f"{'User' if current_speaker == 'user' else 'AI'}: {' '.join(w.word for w in current_words)}",
            'start': current_words[0].start,
            'end': current_words[-1].end
        })
        
    return segments