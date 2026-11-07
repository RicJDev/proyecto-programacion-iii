FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@10.33.0
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY app/tu-tarjeta ./app/tu-tarjeta

RUN pnpm install --frozen-lockfile
WORKDIR /app/app/tu-tarjeta
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/app/tu-tarjeta/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]