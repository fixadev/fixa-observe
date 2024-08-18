#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)
source .venv/bin/activate
uvicorn main:app --reload