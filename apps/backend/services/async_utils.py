import asyncio
import sys

def run_cor(obj):
    if asyncio.iscoroutine(obj):
        try:
            loop = asyncio.new_event_loop()
            result = loop.run_until_complete(obj)
            return result
        except Exception as e:
            print(f"Error in run_cor: {e}", file=sys.stderr)
            return None
    else:
        print(f"INFO: run_cor obj is not a coroutine: {obj}", flush=True)
        return obj