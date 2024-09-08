import os
import time
import shutil

def cleanup_old_files(directory, max_age_seconds=60):
    now = time.time()
    for dirpath, dirnames, filenames in os.walk(directory):
        for dirname in dirnames:
            dir_full_path = os.path.join(dirpath, dirname)
            dir_age = now - os.path.getmtime(dir_full_path)
            if dir_age > max_age_seconds:
                shutil.rmtree(dir_full_path)

if __name__ == "__main__":
    cleanup_old_files("./public/hls")