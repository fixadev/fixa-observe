FROM python:3.11 AS builder

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    ffmpeg \
    # python3-pyaudio \
    portaudio19-dev python3-pyaudio \
    # libasound-dev portaudio19-dev libportaudio2 libportaudiocpp0 python3-pyaudio python3-all-dev \
    # libportaudio0 libportaudio2 libportaudiocpp0 portaudio19-dev python3-pyaudio \
    && rm -rf /var/lib/apt/lists/*

RUN ldconfig

# another comment
RUN python -m venv .venv
COPY requirements.txt ./
ARG CACHEBUST=2
RUN .venv/bin/pip install -r requirements.txt

# fun comment 
FROM python:3.11-slim
WORKDIR /app

# Install required runtime libraries
RUN apt-get update && apt-get install -y \
    libportaudio2 \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.venv .venv/
COPY . .
CMD ["/app/.venv/bin/python", "src/main.py"]
