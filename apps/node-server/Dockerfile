# Use Node.js LTS image as base
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl ffmpeg

WORKDIR /usr/src/app

COPY . . 

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

RUN pnpm --filter @repo/db generate
RUN pnpm run build --filter node-server 

# RUN pnpm deploy --filter=node-server --prod /prod/node-server
# WORKDIR /prod/node-server
# RUN pnpm dlx prisma generate

EXPOSE 3003

CMD ["node", "apps/node-server/dist/index.js"]