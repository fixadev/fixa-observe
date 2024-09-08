#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)
echo "Starting FastAPI backend"
screen -XS pixa-backend quit; screen -dmS pixa-backend bash -c "uvicorn main:app --port 8000 --workers 9 --log-config=log_conf.yaml >> logs/log.txt"