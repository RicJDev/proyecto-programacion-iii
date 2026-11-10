FROM node:26-alpine AS base
RUN npm install -g pnpm@10.33.0
WORKDIR /app

FROM base AS deps
COPY app/tu-tarjeta/package.json  ./
RUN pnpm install

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY app/tu-tarjeta/package.json ./
COPY app/tu-tarjeta/tsconfig.app.json app/tu-tarjeta/tsconfig.node.json app/tu-tarjeta/tsconfig.json ./
COPY app/tu-tarjeta/vite.config.ts app/tu-tarjeta/index.html ./
COPY app/tu-tarjeta/src ./src
COPY app/tu-tarjeta/public ./public
RUN pnpm run build
RUN pnpm prune --prod

FROM nginx:alpine
WORKDIR /app
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]