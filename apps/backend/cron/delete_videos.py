import os
import time
from pathlib import Path

def cleanup_old_files(directory, max_age_seconds=60):
    now = time.time()
    for file in Path(directory).glob('*'):
        if file.is_file() and (now - file.stat().st_mtime) > max_age_seconds:
            os.remove(file)

if __name__ == "__main__":
    cleanup_old_files("/public/hls")