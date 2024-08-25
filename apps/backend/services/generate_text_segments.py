import re
import logging
import time
from services.call_llm import call_llm

from services.call_llm import call_llm
logging = logging.getLogger(__name__)

def generate_segments(input_text):
    start_time = time.time()

    system_prompt="""You are an AI teacher. Respond with a concise answer to the question asked by the user that is no more than 100 words. 
    
    Be clear, concise, and to the point.
    Break the answer into 3-5 brief segments of around 10 seconds when read aloud.  
    Separate the segments with '---SEGMENT---' on a new line. 
    Generate only the segments, do not include any other text.
    """
    llm_response = call_llm(system_prompt, input_text, provider="anthropic")

    print('llm_response', llm_response)

    # Split the response into segments
    segments = re.split(r'---SEGMENT---', llm_response)
    
    # Remove any leading/trailing whitespace from each segment
    segments = [segment.strip() for segment in segments if segment.strip()]
    
    end_time = time.time()
    execution_time = end_time - start_time
    logging.info(f"AI response generation time: {execution_time:.2f} seconds")
    
    return segments