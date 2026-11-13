# Backend — SINACIMN

API REST del sistema, construida con **Express**, **TypeScript** y **Prisma** sobre **MariaDB**.

- Puerto por defecto: `5000`

## Requisitos

- Node.js 20.19.0 o superior
- pnpm 10.33.0 o superior
- MariaDB 11 (puede levantarse con Docker)

## Variables de entorno

El backend leen el archivo `.env` de su carpeta. Si aún no existe, créalo a partir del ejemplo:

```bash
cp example.env app/backend/.env
```

Variables utilizadas:

| Variable         | Descripción                         | Valor por defecto |
| ---------------- | ----------------------------------- | ----------------- |
| `BACKEND_HOST`   | Host donde escucha la API           | `localhost`       |
| `BACKEND_PORT`   | Puerto de la API                    | `5000`            |
| `DB_HOST`        | Host de MariaDB                     | `localhost`       |
| `DB_PORT`        | Puerto de MariaDB                   | `3306`            |
| `DB_NAME`        | Nombre de la base de datos          | `vacunas`         |
| `DB_USER`        | Usuario de la base de datos         | `vacunas`         |
| `DB_PASSWORD`    | Contraseña de la base de datos      | `vacunas`         |
| `DB_URL`         | Cadena de conexión usada por Prisma | —                 |
| `JWT_SECRET`     | Clave para firmar tokens JWT        | —                 |
| `JWT_EXPIRES_IN` | Vigencia de los tokens JWT          | `24h`             |

> [!NOTE]
> Si ejecutas MariaDB fuera de Docker, usa `DB_HOST=localhost` y una `DB_URL` como `mysql://root:root123@localhost:3306/vacunas`. El `.env` de Docker usa `DB_HOST=db`, que solo funciona dentro de la red de Docker Compose.

## Ejecución independiente

1. Instala las dependencias (desde la raíz instala todos los paquetes):

```bash
pnpm install
```

O solo las del backend:

```bash
cd app/backend
pnpm install
```

2. Levanta únicamente la base de datos con Docker (opcional si ya tienes MariaDB local):

```bash
docker compose up -d db
```

Para administrar la base desde el navegador puedes añadir phpMyAdmin:

```bash
docker compose up -d db phpmyadmin
```

3. Genera el cliente de Prisma, prepara el esquema y sincroniza con la base de datos:

```bash
cd app/backend
pnpm prisma generate
pnpm prisma db push
```

4. Inicia el servidor en modo desarrollo:

```bash
pnpm dev
```

La API quedará disponible en `http://localhost:5000`.

Desde la raíz también puedes ejecutarlo con:

```bash
pnpm --filter backend dev
```

## Scripts disponibles

| Comando          | Descripción                                     |
| ---------------- | ----------------------------------------------- |
| `pnpm run dev`   | Inicia el servidor con recarga automática (tsx) |
| `pnpm run build` | Compila TypeScript a `dist/`                    |

## Docker

Si prefieres ejecutar solo este módulo en un contenedor, construye la imagen desde la
raíz del repositorio (el contexto de build es la raíz):

```bash
docker build -f app/backend/Dockerfile -t sinacimn-backend .
docker run --rm -p 5000:5000 --env-file .env sinacimn-backend
```

Ajusta `DB_HOST` y `DB_URL` en `.env` para que apunten a una base de datos accesible
desde el contenedor.
