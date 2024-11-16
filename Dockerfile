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


RUN --mount=type=secret,id=DATABASE_URL \
  --mount=type=secret,id=DIRECT_URL \
  --mount=type=secret,id=OPENAI_API_KEY \
  --mount=type=secret,id=VAPI_API_KEY \
  --mount=type=secret,id=AWS_ACCESS_KEY_ID \
  --mount=type=secret,id=AWS_SECRET_ACCESS_KEY \
  --mount=type=secret,id=DEEPGRAM_API_KEY \
  DATABASE_URL="$(cat /run/secrets/DATABASE_URL)" \
  DIRECT_URL="$(cat /run/secrets/DIRECT_URL)" \
  OPENAI_API_KEY="$(cat /run/secrets/OPENAI_API_KEY)" \
  VAPI_API_KEY="$(cat /run/secrets/VAPI_API_KEY)" \
  AWS_ACCESS_KEY_ID="$(cat /run/secrets/AWS_ACCESS_KEY_ID)" \
  AWS_SECRET_ACCESS_KEY="$(cat /run/secrets/AWS_SECRET_ACCESS_KEY)" \
  DEEPGRAM_API_KEY="$(cat /run/secrets/DEEPGRAM_API_KEY)" \
  && npx prisma generate

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN pnpm build

# Expose port
EXPOSE 3003

# Start the server with NODE_ENV set
CMD ["sh", "-c", "NODE_ENV=production node dist/index.js"]  