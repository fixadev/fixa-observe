FROM python:3.11 AS builder

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    ffmpeg \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

RUN python -m venv .venv
COPY requirements.txt ./

# Install PyTorch and torchaudio before other requirements
RUN .venv/bin/pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
RUN .venv/bin/pip install -r requirements.txt

# Copy the download script early
COPY src/scripts/download_w2v.py ./scripts/

# Create models directory and download model
RUN mkdir -p models && \
    .venv/bin/python scripts/download_w2v.py

FROM python:3.11-slim
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.venv .venv/
COPY . .
CMD ["/app/.venv/bin/python", "src/main.py"]
