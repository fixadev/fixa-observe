# Use Node.js LTS image as base
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl

# Set working directory
WORKDIR /app

# Copy root workspace files
COPY pnpm-lock.yaml package.json ./
COPY pnpm-workspace.yaml ./

# Copy the package.json from your server
COPY apps/node-server/package.json ./apps/node-server/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/node-server ./apps/node-server/

# Set working directory to the server app
WORKDIR /app/apps/node-server

# Generate Prisma Client with secrets mounted
RUN --mount=type=secret,id=DATABASE_URL \
  --mount=type=secret,id=DIRECT_URL \
  export DATABASE_URL="$(cat /run/secrets/DATABASE_URL)" && \
  export DIRECT_URL="$(cat /run/secrets/DIRECT_URL)" && \
  npx prisma generate

# Build TypeScript
RUN pnpm build

# Expose port
EXPOSE 3003

# Start the server with secrets mounted and environment variables set
CMD --mount=type=secret,id=OPENAI_API_KEY \
  --mount=type=secret,id=VAPI_API_KEY \
  --mount=type=secret,id=AWS_ACCESS_KEY_ID \
  --mount=type=secret,id=AWS_SECRET_ACCESS_KEY \
  --mount=type=secret,id=DEEPGRAM_API_KEY \
  --mount=type=secret,id=DATABASE_URL \
  --mount=type=secret,id=DIRECT_URL \
  export OPENAI_API_KEY="$(cat /run/secrets/OPENAI_API_KEY)" && \
  export VAPI_API_KEY="$(cat /run/secrets/VAPI_API_KEY)" && \
  export AWS_ACCESS_KEY_ID="$(cat /run/secrets/AWS_ACCESS_KEY_ID)" && \
  export AWS_SECRET_ACCESS_KEY="$(cat /run/secrets/AWS_SECRET_ACCESS_KEY)" && \
  export DEEPGRAM_API_KEY="$(cat /run/secrets/DEEPGRAM_API_KEY)" && \
  export DATABASE_URL="$(cat /run/secrets/DATABASE_URL)" && \
  export DIRECT_URL="$(cat /run/secrets/DIRECT_URL)" && \
  NODE_ENV=production node dist/index.js