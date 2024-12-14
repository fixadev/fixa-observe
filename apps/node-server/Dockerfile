# Use Node.js LTS image as base
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl ffmpeg

WORKDIR /usr/src/app

COPY . . 

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# RUN --mount=type=secret,id=DATABASE_URL \
#   --mount=type=secret,id=DIRECT_URL \
#   --mount=type=secret,id=TEST_SECRET \
#   DATABASE_URL="$(cat /run/secrets/DATABASE_URL)" \
#   DIRECT_URL="$(cat /run/secrets/DIRECT_URL)" \
#   TEST_SECRET="$(cat /run/secrets/TEST_SECRET)" \
#   && echo "DATABASE_URL: ${DATABASE_URL}" \
#   && echo "DIRECT_URL: ${DIRECT_URL}" \
#   && echo "TEST_SECRET: ${TEST_SECRET}" \
#   && pnpm --filter @repo/db db:generate

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