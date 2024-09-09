#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)

crontab -r
# command="/usr/bin/python3 /home/ubuntu/apps/pixa.dev/apps/backend/cron/delete_videos.py >> /home/ubuntu/apps/pixa.dev/apps/backend/logs/cron.txt"
# job="* * * * * $command"
# cat <(fgrep -i -v "$command" <(crontab -l)) <(echo "$job") | crontab -
# echo "Cron job updated."

echo "Starting FastAPI backend"
screen -XS pixa-backend quit; screen -L -dmS pixa-backend bash -c "uvicorn main:app --port 8000 --workers 2 --log-config=log_conf.yaml >> logs/log.txt"