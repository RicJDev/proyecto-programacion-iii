FROM node:26-alpine AS base
RUN npm install -g pnpm@10.33.0
WORKDIR /app

FROM base AS deps
COPY app/backend/package.json ./
RUN pnpm install --no-frozen-lockfile

FROM base AS development
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY app/backend ./
EXPOSE 5000
CMD ["pnpm", "run", "dev"]

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY app/backend ./
RUN pnpm run build

FROM node:26-alpine AS production
RUN npm install -g pnpm@10.33.0
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 5000
CMD ["pnpm", "run", "start"]
