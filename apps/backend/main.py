from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.websocket import router as websocket_router
from config import CORS_ORIGINS

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(websocket_router)

@app.get("/")
async def root():
    return {"message": "Hello from FastAPI backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)