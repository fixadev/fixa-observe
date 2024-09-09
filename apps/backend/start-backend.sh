#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)

echo "Starting FastAPI backend"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
