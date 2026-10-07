# Proyecto de Programación III

Monorepo que contendrá el frontend y el backend del proyecto asignado por el profesor Cherry.

## Requerimientos

- Node.js 20.19.0 o superior
- pnpm 10.33.0 o superior

## Instalación de dependencias

Para instalar todas las dependencias, ejecuta el siguiente comando desde la raíz del proyecto:

```bash
pnpm recursive install
```

También es posible instalar las dependencias de cada paquete por separado.

Para el frontend:

```bash
cd frontend
pnpm install
```

Para el backend:

```bash
cd backend
pnpm install
```

La única dependencia en la raíz es Prettier, que se utiliza para mantener la consistencia del formato del código. Aunque no es estrictamente necesaria para el desarrollo, se recomienda instalarla desde la raíz:

```bash
pnpm install
```

## Scripts

Aunque cada paquete (frontend y backend) cuenta con sus propios scripts definidos en sus respectivos `package.json`, se han añadido algunos scripts en la raíz para mayor comodidad. Para utilizarlos, es necesario haber instalado las dependencias previamente.

| Comando                 | Descripción                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `pnpm run dev`          | Inicia los servidores de desarrollo de frontend y backend en paralelo |
| `pnpm run dev:frontend` | Inicia el servidor de desarrollo del frontend                         |
| `pnpm run dev:backend`  | Inicia el servidor de desarrollo del backend                          |
| `pnpm run build`        | Compila ambos paquetes y los prepara para su distribución             |
| `pnpm run format`       | Aplica el formato a los archivos usando Prettier                      |
| `pnpm run format:check` | Verifica que los archivos estén formateados según la configuración    |
