# Use Node.js LTS image as base
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl ffmpeg

# Set working directory
WORKDIR /app

# Copy root workspace files
COPY pnpm-lock.yaml package.json tsconfig.json ./
COPY pnpm-workspace.yaml ./

# Copy all package.json files
COPY apps/node-server/package.json ./apps/node-server/
COPY packages/types/package.json ./packages/types/
COPY packages/db/package.json ./packages/db/
COPY packages/services/package.json ./packages/services/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source code and config files
COPY packages ./packages/
COPY apps/node-server ./apps/node-server/
COPY packages/typescript-config ./packages/typescript-config/

# Generate Prisma Client (after source code is available)
RUN cd /app/packages/db && pnpm generate

# Build shared packages first
RUN cd /app/packages/types && pnpm build
RUN cd /app/packages/services && pnpm build

# Set working directory to the server app
WORKDIR /app/apps/node-server

# Build TypeScript
RUN pnpm build

# Verify the build output exists
RUN ls -la dist/

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3003

# Start the server
CMD ["node", "--experimental-specifier-resolution=node", "dist/index.js"]