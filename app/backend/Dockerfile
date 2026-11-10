FROM node:26-alpine AS base
RUN npm install -g pnpm@10.33.0
WORKDIR /app

FROM base AS deps
COPY app/backend/package.json app/backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY app/backend/package.json app/backend/pnpm-lock.yaml ./
COPY app/backend/prisma ./prisma
COPY app/backend/prisma.config.ts app/backend/tsconfig.json ./
COPY app/backend/src ./src
ENV DB_URL="mysql://build:build@localhost:3306/build"
RUN pnpm exec prisma generate
RUN pnpm run build
RUN pnpm prune --prod

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/index.js"]
