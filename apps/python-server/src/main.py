from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from cron.analyze_call import analyze_call
from config import settings

# Create FastAPI app
app = FastAPI(
    title="VAPI Python Server",
    debug=settings.debug
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if not settings.is_production else [],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze/{call_id}")
async def analyze_call_endpoint(call_id: str):
    try:
        await analyze_call(call_id)
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host=settings.host, 
        port=settings.port,
        reload=settings.debug
    ) 