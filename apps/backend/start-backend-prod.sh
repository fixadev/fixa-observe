#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)
crontab -r
command="python cron/delete_videos.py"
job="* * * * * $command"
cat <(fgrep -i -v "$command" <(crontab -l)) <(echo "$job") | crontab -
echo "Cron job updated."

echo "Starting FastAPI backend"
screen -XS pixa-backend quit; screen -dmS pixa-backend bash -c "uvicorn main:app --port 8000 --workers 9 --log-config=log_conf.yaml >> logs/log.txt"