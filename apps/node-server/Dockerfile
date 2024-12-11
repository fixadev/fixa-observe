# Use Node.js LTS image as base
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl ffmpeg

WORKDIR /usr/src/app

# Copy package files first
COPY package.json pnpm-lock.yaml ./
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY packages/services/package.json ./packages/services/
COPY apps/node-server/package.json ./apps/node-server/

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN npm install -g prisma
RUN npm install -g zod-prisma-types

COPY . . 

RUN pnpm --filter @repo/db generate
RUN pnpm run build --filter node-server 

# RUN pnpm deploy --filter=node-server --prod /prod/node-server
# WORKDIR /prod/node-server
# RUN pnpm dlx prisma generate

EXPOSE 3003

CMD ["node", "apps/node-server/dist/index.js"]