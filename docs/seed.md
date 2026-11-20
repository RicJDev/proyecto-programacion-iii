# Semilla de Datos Base y Geografía Nacional (`seed.base.sql`)

Este documento describe la arquitectura de semillas SQL del sistema para garantizar que los datos fundamentales —especialmente la división político-territorial completa de Venezuela (**Estados, Municipios y Parroquias**), junto con el catálogo de vacunas, roles y permisos RBAC— se carguen siempre de forma directa e idempotente en la base de datos.

## 1. Archivos de Semilla SQL

- **[`app/backend/prisma/seed.base.sql`](../app/backend/prisma/seed.base.sql)** (y copia de referencia en **[`docs/seed.base.sql`](./seed.base.sql)**):
  Contiene las sentencias `INSERT INTO ... ON DUPLICATE KEY UPDATE` con los datos base obligatorios que se cargan **siempre** en cualquier entorno:
  - **25 Estados / Entidades Federales** (`states`)
  - **335 Municipios** (`municipalities`)
  - **1,138 Parroquias** (`parishes`)
  - **11 Vacunas del Esquema Nacional** (`vaccines`)
  - **23 Permisos RBAC** (`permissions`)
  - **4 Roles Jerárquicos y sus asignaciones** (`roles`, `_PermissionToRole`)
- **[`app/backend/prisma/seed.dev.sql`](../app/backend/prisma/seed.dev.sql)**:
  Datos de prueba para entornos de desarrollo (usuarios demostrativos por rol, centros de salud vinculados a parroquias reales, lotes, inventario, pacientes, relaciones parentales, inmunizaciones, exámenes médicos y certificados).
- **[`app/backend/prisma/seed.prod.sql`](../app/backend/prisma/seed.prod.sql)**:
  Datos mínimos iniciales para producción (usuario Administrador Maestro inicial).
- **[`app/backend/prisma/seed.ts`](../app/backend/prisma/seed.ts)**:
  Script ejecutado por Prisma (`pnpm --filter backend db:seed`) que lee y ejecuta directamente `seed.base.sql` mediante SQL (`prisma.$executeRawUnsafe`), seguido de `seed.dev.sql` o `seed.prod.sql` según `NODE_ENV`.

## 2. Fuente de Información Geográfica

La división político-territorial oficial (estados, municipios y parroquias de Venezuela con sus llaves foráneas relacionales) fue extraída e integrada desde el repositorio [`marydn/venezuela-sql`](https://github.com/marydn/venezuela-sql.git).

## 3. Ejecución de la Semilla

Para cargar la semilla en la base de datos MariaDB:

```bash
pnpm --filter backend db:seed
```

O ejecutando directamente el archivo SQL en el cliente de MariaDB / phpMyAdmin:

```bash
mysql -u vacunas -p vacunas < docs/seed.base.sql
```
