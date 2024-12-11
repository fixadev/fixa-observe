# Use Node.js LTS image as base
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl ffmpeg

# Set working directory
WORKDIR /app

# Copy root workspace files
COPY pnpm-lock.yaml package.json tsconfig.json ./
COPY pnpm-workspace.yaml ./

COPY packages ./packages/

# Copy the package.json from your server
COPY apps/node-server/package.json ./apps/node-server/
COPY packages/types/package.json ./packages/types/
COPY packages/db/package.json ./packages/db/
COPY packages/services/package.json ./packages/services/

# Install pnpm
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

RUN cd packages/db && pnpm generate
RUN cd packages/types && pnpm build
RUN cd packages/services && pnpm build

COPY apps/node-server ./apps/node-server/

WORKDIR /app/apps/node-server

# Build TypeScript
RUN pnpm build

# Verify the build output exists and show contents
RUN ls -la dist/ && echo "Contents of dist directory:"
RUN find dist -type f

# Expose port
EXPOSE 3003

# Start the server with NODE_ENV set
CMD ["sh", "-c", "NODE_ENV=production && node dist/index.js"]