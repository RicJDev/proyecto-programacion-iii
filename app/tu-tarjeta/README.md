# "Tu tarjeta" — SINACIMN

Portal público de consulta de la tarjeta de vacunación del ciudadano. Construido con **React 19**, **TypeScript**, **Vite** y **Tailwind CSS 4**.

- Puerto de desarrollo: `5002`

## Requisitos

- Node.js 20.19.0 o superior
- pnpm 10.33.0 o superior

## Ejecución independiente

1. Instala las dependencias (desde la raíz instala todos los paquetes):

   ```bash
   pnpm install
   ```

   O solo las de este módulo:

   ```bash
   cd app/tu-tarjeta
   pnpm install
   ```

2. Inicia el servidor de desarrollo:

   ```bash
   pnpm dev
   ```

   Abre `http://localhost:5002`.

Desde la raíz también puedes ejecutarlo con:

```bash
pnpm --filter tu-tarjeta dev
```

## Scripts disponibles

| Comando        | Descripción                                      |
| -------------- | ------------------------------------------------ |
| `pnpm dev`     | Inicia Vite con recarga en caliente              |
| `pnpm build`   | Verifica tipos y genera la versión de producción |
| `pnpm preview` | Sirve localmente la build de producción          |
| `pnpm lint`    | Ejecuta Oxlint                                   |

## Producción

```bash
cd app/tu-tarjeta
pnpm build
pnpm preview
```

La salida se genera en `dist/`.

## Docker

Construye la imagen desde la raíz del repositorio (el contexto de build es la raíz):

```bash
docker build -f app/tu-tarjeta/Dockerfile -t sinacimn-tu-tarjeta .
docker run --rm -p 8082:80 sinacimn-tu-tarjeta
```

El portal quedará disponible en `http://localhost:8082`.
