from multiprocessing import Value, Lock
import logging

logger = logging.getLogger(__name__)

# Shared counter for subprocesses
subprocess_count = Value('i', 0)
subprocess_lock = Lock()

def log_subprocess_count():
    with subprocess_count.get_lock():
        logger.info(f"Current active subprocesses: {subprocess_count.value}")

def increment_subprocess_count():
    with subprocess_count.get_lock():
        subprocess_count.value += 1
    log_subprocess_count()

def decrement_subprocess_count():
    with subprocess_count.get_lock():
        subprocess_count.value -= 1
    log_subprocess_count()