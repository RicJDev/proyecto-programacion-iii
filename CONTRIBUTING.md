He aquí la información mínima para instalar lo necesario para el desarrollo.

## Requerimientos

- Node.js 20.19.0 o superior
- pnpm 10.33.0 o superior

## Instalación de dependencias

Para instalar todas las dependencias, ejecuta el siguiente comando desde la raíz del proyecto:

```bash
pnpm recursive install
```

También es posible instalar las dependencias de cada paquete por separado.

Por ejemplo, para el backend sería así:

```bash
cd backend
pnpm install
```

La únicas dependencias en la raíz son Prettier, que se utiliza para mantener la consistencia del formato del código, y Oxlint, nuestro linter ya configurado. Aunque no son estrictamente necesarias para el desarrollo, se recomienda instalarlas:

```bash
# estando en la raíz
pnpm install
```

## Scripts

Aunque cada paquete (frontend y backend) cuenta con sus propios scripts definidos en sus respectivos `package.json`, se han añadido algunos scripts en la raíz para mayor comodidad. Para utilizarlos, es necesario haber instalado las dependencias previamente.

| Comando                 | Descripción                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| `pnpm run dev`          | Inicia todos los servidores de desarrollo en paralelo              |
| `pnpm run build`        | Compila los paquetes y los prepara para su distribución            |
| `pnpm run format`       | Aplica el formato a los archivos usando Prettier                   |
| `pnpm run format:check` | Verifica que los archivos estén formateados según la configuración |
