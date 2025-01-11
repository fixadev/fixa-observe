import os
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def authenticate_request(credentials: HTTPAuthorizationCredentials = Depends(security)):
    api_key = credentials.credentials
    node_server_secret = os.getenv('TRANSCRIPTION_SERVICE_SECRET')
    if not node_server_secret:
        raise HTTPException(status_code=500, detail="TRANSCRIPTION_SERVICE_SECRET not configured")
    if api_key != node_server_secret:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return credentials