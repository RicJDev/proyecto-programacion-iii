# Catálogo y Matriz de Permisos (RBAC)

## Sistema Nacional de Inmunización y Control de Vacunación

Este documento define formalmente la lista y granularidad de permisos del sistema conforme a la entidad `PERMISSION` y la tabla intermedia `ROLE_PERMISSION` especificadas en [`docs/specs.md`](./specs.md) y [`docs/erd.md`](./erd.md).

---

## 1. Catálogo Oficial de Registros (Entidad `PERMISSION`)

Convención de nomenclatura: `recurso:accion`

| ID | Nombre de Permiso (`permission_name`) | Módulo Funcional | Descripción Oficial |
| :-: | :--- | :--- | :--- |
| **1** | `users:create` | Seguridad & Usuarios | Crear y registrar nuevos usuarios en el sistema. |
| **2** | `users:read` | Seguridad & Usuarios | Consultar y listar cuentas de usuario existentes. |
| **3** | `users:update` | Seguridad & Usuarios | Actualizar datos, credenciales y perfiles de usuarios. |
| **4** | `users:suspend` | Seguridad & Usuarios | Suspender, desactivar o revocar el acceso a un usuario. |
| **5** | `roles:manage` | Seguridad & Usuarios | Crear roles y gestionar la asignación de permisos globales. |
| **6** | `centers:create` | Geografía & Centros | Registrar y dar de alta un nuevo centro de salud en el sistema. |
| **7** | `centers:read` | Geografía & Centros | Consultar el directorio y detalles de centros de salud. |
| **8** | `centers:update` | Geografía & Centros | Modificar datos, estatus operativo e información de centros. |
| **9** | `recipients:create` | Pacientes | Dar de alta a un nuevo ciudadano/paciente en el padrón nacional. |
| **10** | `recipients:read` | Pacientes | Buscar y consultar expedientes de pacientes por cédula o nombre. |
| **11** | `recipients:update` | Pacientes | Actualizar información demográfica o de residencia de pacientes. |
| **12** | `vaccines:manage` | Vacunas e Inventario | Administrar el catálogo nacional de vacunas y biológicos. |
| **13** | `inventory:read` | Vacunas e Inventario | Consultar existencias de stock y lotes disponibles en el centro. |
| **14** | `inventory:manage` | Vacunas e Inventario | Recepcionar lotes, registrar entradas y controlar el stock del centro. |
| **15** | `immunizations:create` | Inmunización | Registrar formalmente la aplicación de una dosis a un paciente. |
| **16** | `immunizations:read` | Inmunización | Consultar el historial de dosis aplicadas de un paciente. |
| **17** | `exams:create` | Clínico & Exámenes | Registrar resultados de evaluaciones médicas previas a la dosis. |
| **18** | `exams:read` | Clínico & Exámenes | Consultar el historial de exámenes médicos de un paciente. |
| **19** | `certificates:issue` | Certificación | Emitir y firmar certificados sanitarios oficiales y carnets locales. |
| **20** | `certificates:verify` | Certificación | Validar la autenticidad e integridad de certificados (código único / QR). |
| **21** | `reports:national` | Supervisión & Reportes | Acceder al dashboard de métricas epidemiológicas nacionales. |
| **22** | `reports:regional` | Supervisión & Reportes | Visualizar mapas y estadísticas de cobertura a nivel de estado/municipio. |
| **23** | `reports:local` | Supervisión & Reportes | Generar el reporte diario de dosis aplicadas por el centro y vacunador. |

---

## 2. Matriz de Asignación por Rol (`ROLE_PERMISSION`)

| Permiso | Administrador Maestro (Ministerio) | Administrador Regional (SACS) | Administrador Local (Centro de Salud) | Personal Inmunizador (Campo) |
| :--- | :---: | :---: | :---: | :---: |
| `users:create` | ✅ (Cualquier rol) | ✅ (Local e Inmunizador) | ✅ (Inmunizador) | ❌ |
| `users:read` | ✅ | ✅ | ✅ | ❌ |
| `users:update` | ✅ | ✅ | ✅ | ❌ |
| `users:suspend` | ✅ | ✅ | ✅ | ❌ |
| `roles:manage` | ✅ | ❌ | ❌ | ❌ |
| `centers:create` | ✅ | ✅ (En su estado) | ❌ | ❌ |
| `centers:read` | ✅ | ✅ | ✅ | ✅ |
| `centers:update` | ✅ | ✅ (En su estado) | ❌ | ❌ |
| `recipients:create` | ❌ | ❌ | ✅ | ✅ |
| `recipients:read` | ✅ | ✅ | ✅ | ✅ |
| `recipients:update` | ❌ | ❌ | ✅ | ✅ |
| `vaccines:manage` | ✅ | ❌ | ❌ | ❌ |
| `inventory:read` | ✅ | ✅ | ✅ | ✅ |
| `inventory:manage` | ✅ | ❌ | ✅ (En su centro) | ❌ |
| `immunizations:create` | ❌ | ❌ | ❌ | ✅ |
| `immunizations:read` | ✅ | ✅ | ✅ | ✅ |
| `exams:create` | ❌ | ❌ | ✅ | ✅ |
| `exams:read` | ✅ | ✅ | ✅ | ✅ |
| `certificates:issue` | ❌ | ❌ | ✅ (Certificado Oficial) | ✅ (Carnet Local) |
| `certificates:verify` | ✅ | ✅ | ✅ | ✅ |
| `reports:national` | ✅ | ❌ | ❌ | ❌ |
| `reports:regional` | ✅ | ✅ | ❌ | ❌ |
| `reports:local` | ✅ | ✅ | ✅ | ✅ |

---

## 3. Script SQL de Inserción (Seed de Base de Datos)

```sql
-- 1. Insertar Catálogo de Permisos
INSERT INTO PERMISSION (id_permission, permission_name, description) VALUES
(1, 'users:create', 'Crear y registrar nuevos usuarios en el sistema'),
(2, 'users:read', 'Consultar y listar cuentas de usuario existentes'),
(3, 'users:update', 'Actualizar datos, credenciales y perfiles de usuarios'),
(4, 'users:suspend', 'Suspender, desactivar o revocar el acceso a un usuario'),
(5, 'roles:manage', 'Crear roles y gestionar la asignación de permisos globales'),
(6, 'centers:create', 'Registrar y dar de alta un nuevo centro de salud'),
(7, 'centers:read', 'Consultar el directorio y detalles de centros de salud'),
(8, 'centers:update', 'Modificar datos y estatus operativo de centros'),
(9, 'recipients:create', 'Dar de alta a un nuevo paciente en el padrón nacional'),
(10, 'recipients:read', 'Buscar y consultar expedientes de pacientes'),
(11, 'recipients:update', 'Actualizar información de pacientes'),
(12, 'vaccines:manage', 'Administrar el catálogo nacional de vacunas'),
(13, 'inventory:read', 'Consultar existencias de stock y lotes disponibles'),
(14, 'inventory:manage', 'Recepcionar y controlar el stock de biológicos'),
(15, 'immunizations:create', 'Registrar formalmente la aplicación de una dosis'),
(16, 'immunizations:read', 'Consultar historial de dosis aplicadas'),
(17, 'exams:create', 'Registrar resultados de evaluaciones médicas'),
(18, 'exams:read', 'Consultar historial de exámenes médicos'),
(19, 'certificates:issue', 'Emitir y firmar certificados sanitarios oficiales y carnets'),
(20, 'certificates:verify', 'Validar autenticidad de certificados mediante código QR'),
(21, 'reports:national', 'Acceder al dashboard de métricas epidemiológicas nacionales'),
(22, 'reports:regional', 'Visualizar estadísticas de cobertura regional'),
(23, 'reports:local', 'Generar reporte diario de dosis del centro de salud');

-- 2. Insertar Roles Principales
INSERT INTO ROLE (id_role, role_name, description) VALUES
(1, 'admin_maestro', 'Autoridad central máxima del Ministerio de Salud con acceso irrestricto'),
(2, 'admin_regional', 'Dirección regional de salud para supervisión de estado'),
(3, 'admin_local', 'Administración y control operativo directo de un centro de salud'),
(4, 'personal_inmunizador', 'Operador de campo para registro de pacientes y aplicación de dosis');

-- 3. Vincular Permisos a Roles (ROLE_PERMISSION)

-- Rol 1: Administrador Maestro (Nivel Nacional)
INSERT INTO ROLE_PERMISSION (id_role, id_permission) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
(1, 10), (1, 12), (1, 13), (1, 14), (1, 16), (1, 18), (1, 20),
(1, 21), (1, 22), (1, 23);

-- Rol 2: Administrador Regional (Nivel Estado)
INSERT INTO ROLE_PERMISSION (id_role, id_permission) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), (2, 6), (2, 7), (2, 8),
(2, 10), (2, 13), (2, 16), (2, 18), (2, 20), (2, 22), (2, 23);

-- Rol 3: Administrador Local (Centro de Salud)
INSERT INTO ROLE_PERMISSION (id_role, id_permission) VALUES
(3, 1), (3, 2), (3, 3), (3, 4), (3, 7), (3, 9), (3, 10), (3, 11),
(3, 13), (3, 14), (3, 16), (3, 17), (3, 18), (3, 19), (3, 20), (3, 23);

-- Rol 4: Personal Inmunizador (Campo)
INSERT INTO ROLE_PERMISSION (id_role, id_permission) VALUES
(4, 7), (4, 9), (4, 10), (4, 11), (4, 13), (4, 15), (4, 16),
(4, 17), (4, 18), (4, 19), (4, 20), (4, 23);
```

---

## 4. Tipado Reutilizable para TypeScript (`src/types/permissions.ts`)

```typescript
export const PERMISSIONS = {
  // Usuarios & Roles
  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_SUSPEND: 'users:suspend',
  ROLES_MANAGE: 'roles:manage',

  // Centros de Salud
  CENTERS_CREATE: 'centers:create',
  CENTERS_READ: 'centers:read',
  CENTERS_UPDATE: 'centers:update',

  // Pacientes
  RECIPIENTS_CREATE: 'recipients:create',
  RECIPIENTS_READ: 'recipients:read',
  RECIPIENTS_UPDATE: 'recipients:update',

  // Vacunas & Inventario
  VACCINES_MANAGE: 'vaccines:manage',
  INVENTORY_READ: 'inventory:read',
  INVENTORY_MANAGE: 'inventory:manage',

  // Inmunizaciones
  IMMUNIZATIONS_CREATE: 'immunizations:create',
  IMMUNIZATIONS_READ: 'immunizations:read',

  // Exámenes & Certificados
  EXAMS_CREATE: 'exams:create',
  EXAMS_READ: 'exams:read',
  CERTIFICATES_ISSUE: 'certificates:issue',
  CERTIFICATES_VERIFY: 'certificates:verify',

  // Reportes y Métricas
  REPORTS_NATIONAL: 'reports:national',
  REPORTS_REGIONAL: 'reports:regional',
  REPORTS_LOCAL: 'reports:local',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
```

