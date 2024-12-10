# syntax=docker/dockerfile:1
FROM selenium/standalone-chrome

USER root

# Prevent timezone prompt
ENV DEBIAN_FRONTEND=noninteractive
ENV SE_ENABLE_TRACING=false

# Update package lists
RUN apt-get update 

# Install Python and other dependencies
RUN apt-get install -y \
  python3 python3-pip python3-dev python3-venv \
  libsndfile1 libportaudio2 \
  portaudio19-dev python3-pyaudio  \
  build-essential gcc  \
  pulseaudio pulseaudio-utils  \
  screen

# Clean up
RUN apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python3 -m venv .venv

# Copy only requirements files first
COPY requirements.txt .

# Install Python dependencies
RUN .venv/bin/pip install -r requirements.txt

# Now copy the rest of the application code
COPY . .

# Init audio devices
RUN chmod +x ./start.sh
RUN chmod +x ./init_audio_devices.sh

# RUN useradd -ms /bin/bash seluser
USER seluser

# Set the entrypoint
ENTRYPOINT ["./start.sh"]