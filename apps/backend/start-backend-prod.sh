#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)
crontab -r
echo "* * * * * /usr/bin/python3 /cron/delete_videos.py" | crontab -
echo "Existing cron jobs removed and new job added successfully."

echo "Starting FastAPI backend"
screen -XS pixa-backend quit; screen -dmS pixa-backend bash -c "uvicorn main:app --port 8000 --workers 9 --log-config=log_conf.yaml >> logs/log.txt"