He aquí la información mínima para instalar lo necesario para el desarrollo.

## Requerimientos

- Node.js 20.19.0 o superior
- pnpm 10.33.0 o superior
- Docker y Docker Compose (recomendado para trabajar con la base de datos)

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

## Desarrollo con Docker

El proyecto incluye un `docker-compose.yml` con MariaDB, phpMyAdmin y el backend en modo desarrollo (sí, con hot reload).

1. Copia el archivo de variables de entorno y ajusta las credenciales si lo deseas:

```bash
echo example.env > .env
```

2. Levanta los servicios:

```bash
docker compose up --build
```

El backend quedará disponible en `http://localhost:5000`, MariaDB en `localhost:3306` y phpMyAdmin en `http://localhost:8080`.

Para entrar a phpMyAdmin usa el usuario y la contraseña de la base de datos (por defecto `vacunas` / `vacunas`). También puedes iniciar sesión como `root` con la contraseña definida en `DB_ROOT_PASSWORD`.

Para conectarte a la base de datos desde tu equipo usa las credenciales definidas en `.env`:

| Variable            | Valor por defecto |
| ------------------- | ----------------- |
| Host                | `127.0.0.1`       |
| Puerto              | `3306`            |
| Base de datos       | `vacunas`         |
| Usuario             | `vacunas`         |
| Contraseña          | `vacunas`         |
| Usuario root        | `root`            |
| Contraseña root     | `root`            |

Para detener los servicios:

```bash
docker compose down
```

Si necesitas reiniciar la base de datos desde cero (elimina los datos guardados):

```bash
docker compose down -v
```

El backend se monta como volumen, por lo que los cambios en `app/backend` se reflejan automáticamente sin reconstruir la imagen.
