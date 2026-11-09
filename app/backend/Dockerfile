FROM node:26-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@10.33.0
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY app/backend ./app/backend

RUN pnpm install --frozen-lockfile
WORKDIR /app/app/backend
ENV DB_URL="mysql://vacunas:vacunas@db:3306/vacunas"
RUN pnpm prisma generate
RUN pnpm run build

FROM node:26-alpine
WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app/backend/package.json ./app/backend/package.json
COPY --from=builder /app/app/backend/dist ./app/backend/dist
COPY --from=builder /app/app/backend/prisma ./app/backend/prisma
COPY --from=builder /app/app/backend/node_modules ./app/backend/node_modules

WORKDIR /app/app/backend
EXPOSE 5000
CMD ["node", "dist/index.js"]
