import asyncio
from ..utils.vapi_client import create_vapi_client
from ..config import settings
from .analyze_call import analyze_call


if __name__ == "__main__":
    vapi_client = create_vapi_client(settings.vapi_api_key)
    calls = vapi_client.calls.list()
    call = calls[0]
    asyncio.run(analyze_call(call.id))



  
