FROM node:26-alpine AS base
RUN npm install -g pnpm@10.33.0
WORKDIR /app

FROM base AS deps
COPY app/tu-tarjeta/package.json  ./
RUN pnpm install

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY app/tu-tarjeta/ ./
RUN pnpm run build
RUN pnpm prune --prod

FROM nginx:alpine
WORKDIR /app
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]