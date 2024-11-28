FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04 AS builder

## nvidia/cuda:12.6.2-cudnn-runtime-ubuntu22.04

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1
WORKDIR /app

# Install Python and system dependencies
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3.11-venv \
    python3.11-dev \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

RUN python3.11 -m venv .venv
COPY requirements.txt ./

# Install PyTorch and torchaudio with CUDA support before other requirements
RUN .venv/bin/pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121
RUN .venv/bin/pip install -r requirements.txt

# Copy the download script early
COPY src/scripts/download_w2v.py ./scripts/

# Create models directory and download model
RUN mkdir -p models && \
    .venv/bin/python scripts/download_w2v.py

FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04
WORKDIR /app

# Install Python and runtime dependencies
RUN apt-get update && apt-get install -y \
    python3.11 \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.venv .venv/
COPY --from=builder /app/models /models
COPY . .

CMD ["/app/.venv/bin/python", "src/main.py"]
