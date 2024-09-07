FROM python:3.11.3

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libgles2-mesa \
    libegl1-mesa \
    libpango1.0-dev \
    pkg-config \
    libcairo2-dev \
    ffmpeg \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libfontconfig1 \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONPATH="${PYTHONPATH}:/app"

COPY start.sh .
CMD ["./start.sh"]