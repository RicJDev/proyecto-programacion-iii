# Semilla de Datos Base y Geografía Nacional (`seed.base.sql`, `seed.base.ts` y `seed.dev.ts`)

Este documento describe la arquitectura de semillas del sistema para garantizar que los datos fundamentales —la división político-territorial completa de Venezuela (**Estados, Municipios y Parroquias**) en SQL, los datos base (**Vacunas, Permisos y Roles**) en `seed.base.ts` y los datos de desarrollo en `seed.dev.ts`— se carguen siempre de forma idempotente en la base de datos.

## 1. Estructura de Archivos de Semilla

- **[`app/backend/prisma/seed.base.sql`](../app/backend/prisma/seed.base.sql)** (y copia de referencia en **[`docs/seed.base.sql`](./seed.base.sql)**):
  Contiene exclusivamente las sentencias SQL (`INSERT INTO ... ON DUPLICATE KEY UPDATE`) de la división político-territorial de Venezuela que se cargan **siempre**:
  - **25 Estados / Entidades Federales** (`estado`)
  - **335 Municipios** (`municipio`)
  - **1,138 Parroquias** (`parroquia`)
- **[`app/backend/prisma/seed.base.ts`](../app/backend/prisma/seed.base.ts)**:
  Módulo TypeScript exportado (`seedBase(prisma)`) e importado en `seed.ts` que carga el resto de los datos base mediante el cliente de Prisma (`upsert`):
  - **11 Vacunas del Esquema Nacional** (`vacuna`)
  - **27 Permisos RBAC** (`permiso`)
  - **3 Roles Jerárquicos y sus asignaciones de permisos** (`rol`, `_PermissionToRole`)
- **[`app/backend/prisma/seed.dev.ts`](../app/backend/prisma/seed.dev.ts)**:
  Módulo TypeScript exportado (`seedDev(prisma)`) e importado en `seed.ts` que carga los datos de desarrollo usando el cliente de Prisma y `bcrypt` para generar los hashes de contraseñas:
  - Usuarios de prueba por rol (contraseña hasheada con `bcrypt`)
  - Centros de salud vinculados a parroquias reales de `seed.base.sql`
  - Esquemas de vacunación, lotes, inventario, personas, representaciones, tarjetas, inmunizaciones, exámenes médicos, parámetros, certificados y resultados
- **[`app/backend/prisma/seed.prod.sql`](../app/backend/prisma/seed.prod.sql)**:
  Datos mínimos iniciales para producción (usuario Administrador Maestro inicial).
- **[`app/backend/prisma/seed.ts`](../app/backend/prisma/seed.ts)**:
  Punto de entrada ejecutado por Prisma (`pnpm --filter backend db:seed`):
  1. Ejecuta `seed.base.sql` directamente mediante `prisma.$executeRawUnsafe`.
  2. Ejecuta `seedBase(prisma)` importado desde `./seed.base`.
  3. Ejecuta `seedDev(prisma)` (en desarrollo) o `seed.prod.sql` (cuando `NODE_ENV === 'production'`).

## 2. Fuente de Información Geográfica

La división político-territorial oficial (estados, municipios y parroquias de Venezuela con sus llaves foráneas relacionales) fue extraída e integrada desde el repositorio [`marydn/venezuela-sql`](https://github.com/marydn/venezuela-sql.git).

## 3. Ejecución de la Semilla

Para cargar la semilla completa en la base de datos MariaDB:

```bash
pnpm --filter backend db:seed
```

O para cargar únicamente la división geográfica directamente desde MariaDB / phpMyAdmin:

```bash
mysql -u vacunas -p vacunas < docs/seed.base.sql
```
