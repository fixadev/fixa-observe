from vapi import Vapi

def create_vapi_client(api_key: str) -> Vapi:
    return Vapi(token=api_key) 