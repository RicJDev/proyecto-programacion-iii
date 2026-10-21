# Descripción general de la 

## Estructura de Roles y Niveles de Permiso

El sistema cuenta con 4 niveles de acceso claramente definidos para garantizar la seguridad de la información y la trazabilidad del proceso de inmunización:

```
[ Administrador Maestro (El Ministerio) ]
  │
  ▼
[ Administradores Regionales (SACS y Direcciones Regionales) ]
  │
  ▼
[ Administradores Locales (Institución / Centro de Salud) ]
  │
  ▼
[ Personal Inmunizador (Operadores en campo) ]
```

### 1. Administrador Maestro (El Ministerio)

Es el nivel más alto de autoridad dentro del sistema. Posee acceso global sin restricciones a la plataforma.

- **Gestión de Usuarios:** Creación, suspensión, modificación y eliminación de usuarios de cualquier nivel (administradores regionales, locales y personal operativo).
- **Consolidación de Datos:** Acceso unificado a la información de todas las regiones y centros de salud del país.
- **Dashboard Centralizado:**
  - Métricas nacionales de vacunación en tiempo real.
  - Tablas y gráficos comparativos por región, municipio y centro de salud.
  - Análisis de coberturas y tendencias epidemiológicas.

### 2. Administradores Regionales (SACS y Direcciones Regionales)

Encargados de supervisar la gestión de la salud pública dentro de una jurisdicción o región geográfica específica.

- **Gestión de Centros de Salud:** Registro, habilitación y administración de centros de salud dentro de su cobertura geográfica.
- **Gestión de Administradores Locales:** Asignación y registro de administradores locales para los centros autorizados en su región.
- **Supervisión Regional:**
  - Mismas capacidades operativas que los admins locales, pero aplicadas a todos los centros de su región.
  - Visualización geoespacial de centros y datos en mapa interactivo regional.

### 3. Administradores Locales (Centro de Salud / Institución)

Supervisan las operaciones diarias de vacunación e inventario dentro de una institución o centro de vacunación específico.

- **Gestión del Personal Inmunizador:** Crear, suspender, reactivar o eliminar usuarios de tipo _Personal Inmunizador_.
- **Control de Registros e Inventario:**
  - Registro completo de vacunas aplicadas en la institución.
  - Filtrado avanzado de datos por tipo de vacuna, número de lote, rangos de fecha y paciente.
  - Métrica e indicadores de inventario y aplicación local.
- **Módulo de Validación de Documentos:**
  - Verificación de la autenticidad de certificados o tarjetas presentadas físicamente por los ciudadanos.
  - Emisión y generación oficial del Certificado de Salud oficial del centro.

### 4. Personal Inmunizador

Perfil con el menor nivel de permisos, optimizado para la atención directa y ágil en el punto de vacunación.

- **Registro de Pacientes:** Alta e ingreso de nuevos ciudadanos al sistema.
- **Consulta y Actualización:** Verificación del historial del paciente y actualización de datos demográficos o clínicos.
- **Aplicación de Vacunas:** Registro rápido del lote y dosis administrada.
- **Emisión de Tarjeta:** Generación e impresión del documento oficial con la tarjeta de vacunación del paciente.

## Módulo Ciudadano: "Tu Tarjeta"

Módulo público e independiente orientado al ciudadano para la consulta rápida de su estado de inmunización.

- **Consulta Express:** Acceso al status de la tarjeta de vacunación introduciendo el documento de identidad o correo registrado.
- **Envío Digital:** Opción integrada para reenviar la tarjeta de vacunación digitalizada directamente a la cuenta de correo electrónico del ciudadano.
