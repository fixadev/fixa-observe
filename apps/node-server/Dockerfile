# Use Node.js LTS image as base
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl ffmpeg

WORKDIR /usr/src/app

COPY . . 

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

ARG DATABASE_URL=""
ARG DIRECT_URL=""
ARG TEST_SECRET=""

ENV DATABASE_URL=${DATABASE_URL}
ENV DIRECT_URL=${DIRECT_URL}
ENV TEST_SECRET=${TEST_SECRET}

RUN echo "DATABASE_URL: ${DATABASE_URL}"
RUN echo "DIRECT_URL: ${DIRECT_URL}"
RUN echo "TEST_SECRET: ${TEST_SECRET}"


RUN pnpm --filter @repo/db db:generate

RUN mkdir -p /usr/node_modules/.pnpm/@prisma+client@5.21.1_prisma@5.21.1/node_modules/.prisma/client
RUN cp node_modules/.pnpm/@prisma+client@5.21.1_prisma@5.21.1/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node \
  /usr/node_modules/.pnpm/@prisma+client@5.21.1_prisma@5.21.1/node_modules/.prisma/client/

RUN pnpm run build --filter node-server 

# RUN pnpm deploy --filter=node-server --prod /prod/node-server
# WORKDIR /prod/node-server
# RUN pnpm dlx prisma generate

EXPOSE 3003

CMD ["node", "apps/node-server/dist/index.js"]