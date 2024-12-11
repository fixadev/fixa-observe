# Use Node.js LTS image as base
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl ffmpeg

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

# Build TypeScript
RUN pnpm build

# Expose port
EXPOSE 3003

# Start the server with NODE_ENV set
CMD ["sh", "-c", "NODE_ENV=production node dist/index.js"]  