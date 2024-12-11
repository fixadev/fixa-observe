#!/bin/bash

# Initialize audio devices
bash init_audio_devices.sh

# Pass all arguments to the Python application
exec .venv/bin/python selenium_agent.py "$@" 
