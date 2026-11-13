# Panel de administración — SINACIMN

Interfaz interna para los distintos roles administrativos del sistema. Construida con **React 19**, **TypeScript**, **Vite** y **Tailwind CSS 4**.

- Puerto de desarrollo: `5001`

## Requisitos

- Node.js 20.19.0 o superior
- pnpm 10.33.0 o superior

## Ejecución independiente

1. Instala las dependencias (desde la raíz instala todos los paquetes):

   ```bash
   pnpm install
   ```

   O solo las del panel:

   ```bash
   cd app/panel
   pnpm install
   ```

2. Inicia el servidor de desarrollo:

   ```bash
   pnpm dev
   ```

   Abre `http://localhost:5001`.

Desde la raíz también puedes ejecutarlo con:

```bash
pnpm --filter panel dev
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
cd app/panel
pnpm build
pnpm preview
```

La salida se genera en `dist/`.

## Docker

Construye la imagen desde la raíz del repositorio (el contexto de build es la raíz):

```bash
docker build -f app/panel/Dockerfile -t sinacimn-panel .
docker run --rm -p 8081:80 sinacimn-panel
```

El panel quedará disponible en `http://localhost:8081`.
