FROM node:26-alpine AS base
RUN npm install -g pnpm@10.33.0
WORKDIR /app

FROM base AS deps
COPY app/panel/package.json  ./
RUN pnpm install

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY app/panel/package.json ./
COPY app/panel/tsconfig.app.json app/panel/tsconfig.node.json app/panel/tsconfig.json ./
COPY app/panel/vite.config.ts app/panel/index.html ./
COPY app/panel/src ./src
COPY app/panel/public ./public
RUN pnpm run build
RUN pnpm prune --prod

FROM nginx:alpine
WORKDIR /app
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]