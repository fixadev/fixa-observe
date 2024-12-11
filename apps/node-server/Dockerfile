# Use Node.js LTS image as base
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl ffmpeg

# Set working directory
WORKDIR /app

# Copy root workspace files
COPY pnpm-lock.yaml package.json tsconfig.json ./
COPY pnpm-workspace.yaml ./

# Copy all packages first
COPY packages ./packages/
COPY apps/node-server/package.json ./apps/node-server/

# Install pnpm
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

RUN cd packages/db && pnpm generate
RUN cd packages/types && pnpm build
RUN cd packages/services && pnpm build

COPY apps/node-server ./apps/node-server/
RUN cd apps/node-server && pnpm build

EXPOSE 3003

CMD ["sh", "-c", "NODE_ENV=production && node apps/node-server/dist/main.js"]