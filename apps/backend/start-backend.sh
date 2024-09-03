#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)

uvicorn main:app --port 8000 --workers 4