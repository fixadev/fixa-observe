#!/bin/bash

# Start Xvfb
Xvfb :99 -screen 0 1280x720x24 &

# Wait for Xvfb to be ready
sleep 1

# Start fluxbox (a lightweight window manager)
fluxbox &

# Start VNC server
x11vnc -display :99 -nopw -forever &

# Set DISPLAY variable
export DISPLAY=:99

# Start your FastAPI application
uvicorn main:app --host 0.0.0.0 --port 8000