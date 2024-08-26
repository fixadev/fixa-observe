#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

uvicorn main:app --reload