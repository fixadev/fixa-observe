#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)

echo "Starting FastAPI backend"
uvicorn main:app --port 8000 --workers 4
