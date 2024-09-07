import multiprocessing
import queue

# Source: https://stackoverflow.com/questions/48705408/sharing-a-queue-instance-between-different-modules
class _QueueProxy(object):
    def __init__(self):
        self._queueimp = None

    @property
    def _queue(self):
        if self._queueimp is None:
            isMonoCPU = multiprocessing.cpu_count() == 1
            self._queueimp = queue.Queue() if isMonoCPU else multiprocessing.Queue() 

        return self._queueimp

    def get(self, *args, **kw):
        return self._queue.get(*args, **kw)

    def put(self, *args, **kw):
        return self._queue.put(*args, **kw)

    def empty(self):
        return self._queue.empty()

    def get_nowait(self):
        return self._queue.get_nowait()

   # etc... only expose public methods and attributes of course


# and now our `shared_queue` instance    
# frame_queue = _QueueProxy()
frame_queue = multiprocessing.Queue()