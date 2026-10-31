# Documento Técnico de Especificaciones del Sistema Nacional de Inmunización y Control de Vacunación

## 1. Descripción General del Sistema

El **Sistema Nacional de Inmunización y Control de Vacunación** es una plataforma centralizada de gestión de salud pública diseñada para el registro, trazabilidad, administración y validación del esquema de vacunación a nivel nacional.

Su arquitectura garantiza la integridad de los datos mediante una estructura territorial jerárquica (Estado, Municipio, Parroquia y Centro de Salud), un control de acceso basado en roles dinámico y granular (RBAC), y un módulo público independiente que permite al ciudadano consultar y certificar su estado de inmunización en tiempo real.

## 2. Estructura de Roles y Niveles de Permiso (RBAC)

El sistema define 4 niveles jerárquicos de administración interna, acompañados por un nivel de acceso público para el ciudadano:

- Administrador Maestro (El Ministerio)
- Administradores Regionales (SACS / Direcciones Regionales)
- Administradores Locales (Centro de Salud / Institución)
- Personal Inmunizador (Operadores en Campo)

### 1. Administrador Maestro (El Ministerio)

Nivel de autoridad máxima con acceso global sin restricciones.

- **Gestión de Cuentas y Roles:** Creación, modificación, suspensión y asignación de roles y permisos a nivel nacional.
- **Consolidación Nacional de Datos:** Acceso unificado a los registros de vacunación, exámenes e inventarios de todo el país.
- **Dashboard Centralizado:** Visualización de métricas nacionales en tiempo real, análisis de coberturas epidemiológicas y cuadros comparativos por estado y municipio.

### 2. Administradores Regionales (SACS / Direcciones Regionales)

Supervisan la gestión de salud pública dentro de una jurisdicción geográfica específica (`STATE`).

- **Gestión de Infraestructura Regional:** Registro, habilitación y actualización de centros de salud dentro de sus municipios y parroquias.
- **Gestión de Administradores Locales:** Alta y asignación de administradores para los centros habilitados en su región.
- **Supervisión y Análisis:** Monitoreo de coberturas y mapas interactivos de distribución a nivel regional.

### 3. Administradores Locales (Centro de Salud / Institución)

Supervisan las operaciones diarias de vacunación e inventario dentro de una institución médica específica (`HEALTH_CENTER`).

- **Gestión del Personal Inmunizador:** Alta, suspensión y control de operadores de campo asociados al centro.
- **Control de Inventario y Dosis:** Registro de lotes de vacunas, recepción y control de stock disponible.
- **Módulo de Validación y Emisión:** Verificación de certificados presentados físicamente y emisión del Certificado Oficial de Salud del centro.

### 4. Personal Inmunizador (Operadores en Campo)

Perfil optimizado para la atención directa y expedita en el punto de vacunación.

- **Registro de Pacientes (`RECIPIENT`):** Alta de nuevos ciudadanos en el sistema.
- **Consulta y Actualización:** Verificación del historial de dosis administradas y actualización de datos demográficos o clínicos.
- **Aplicación de Vacunas (`IMMUNIZATION`):** Registro de la dosis administrada, fecha/hora, lote y tipo de vacuna aplicada.
- **Emisión de Carnet Local:** Generación e impresión de la tarjeta de vacunación del paciente.

### 5. Módulo Ciudadano: "Tu Tarjeta"

Portal web público e independiente orientado a la consulta soberana del ciudadano.

- **Consulta Express:** Verificación del estado de inmunización mediante el número de documento de identidad (`identification_number`).
- **Emisión Digital:** Reenvío automático del Certificado de Salud digitalizado firmado electrónicamente al correo registrado.

## 3. Arquitectura General y Módulos del Sistema

```mermaid
graph TD
    %% Usuarios y Roles
    AM[Administrador Maestro - Ministerio] --> System
    AR[Administrador Regional - SACS] --> System
    AL[Administrador Local - Centro de Salud] --> System
    PI[Personal Inmunizador - Campo] --> System
    CIU[Ciudadano / Paciente] --> TuTarjeta[Módulo Público: Tu Tarjeta]

    subgraph System["Sistema Nacional de Inmunización"]
        ModSec["Módulo de Seguridad & RBAC<br/>(USER, ROLE, PERMISSION)"]
        ModGeo["Módulo Geográfico & Estructura<br/>(STATE, MUNICIPALITY, PARISH, HEALTH_CENTER)"]
        ModPat["Módulo de Pacientes & Aplicaciones<br/>(RECIPIENT, IMMUNIZATION, VACCINE)"]
        ModCert["Módulo Clínico & Certificación<br/>(MEDICAL_EXAM, MEDICAL_CERTIFICATE)"]
    end

    %% Relaciones de módulos
    ModSec --> ModPat
    ModGeo --> ModPat
    ModPat --> ModCert

    %% Almacenamiento
    System <--> DB[(Base de Datos Relacional Centralizada)]
    TuTarjeta <--> DB

```

## 4. Modelo de Datos Relacional (Entidad-Relación)

El modelo relacional garantiza la trazabilidad geográfica, la integridad clínica de las dosis aplicadas y el control de acceso estricto mediante RBAC:

```mermaid
erDiagram
    STATE {
        int id_state PK
        string name
    }

    MUNICIPALITY {
        int id_municipality PK
        string name
        int id_state FK
    }

    PARISH {
        int id_parish PK
        string name
        int id_municipality FK
    }

    HEALTH_CENTER {
        int id_center PK
        string name
        string address
        int id_parish FK
    }

    RECIPIENT {
        int id_person PK
        string name
        string last_name
        string identification_number
    }

    VACCINE {
        int id_vaccine PK
        string name
        string type
    }

    IMMUNIZATION {
        int id_dose PK
        int id_person FK
        int id_vaccine FK
        datetime date_time
        int id_center FK
    }

    MEDICAL_EXAM {
        int id_exam PK
        string data
        int id_person FK
    }

    MEDICAL_CERTIFICATE {
        int id_certificate PK
        int id_exam FK
        int id_dose FK
        string code
        int id_person FK
    }

    USER {
        int id_user PK
        string username
        string password_hash
        int id_role FK
    }

    ROLE {
        int id_role PK
        string role_name
        string description
    }

    PERMISSION {
        int id_permission PK
        string permission_name
        string description
    }

    ROLE_PERMISSION {
        int id_role FK
        int id_permission FK
    }

    STATE ||--o{ MUNICIPALITY : "has"
    MUNICIPALITY ||--o{ PARISH : "has"
    PARISH ||--o{ HEALTH_CENTER : "hosts"

    RECIPIENT ||--o{ IMMUNIZATION : "receives"
    VACCINE ||--o{ IMMUNIZATION : "applied_in"
    HEALTH_CENTER ||--o{ IMMUNIZATION : "administers"

    RECIPIENT ||--o{ MEDICAL_EXAM : "undergoes"
    MEDICAL_EXAM ||--o{ MEDICAL_CERTIFICATE : "generates"
    IMMUNIZATION ||--o{ MEDICAL_CERTIFICATE : "requires"
    RECIPIENT ||--o{ MEDICAL_CERTIFICATE : "owns"

    ROLE ||--o{ USER : "assigned_to"
    ROLE ||--o{ ROLE_PERMISSION : "contains"
    PERMISSION ||--o{ ROLE_PERMISSION : "belongs_to"

```

## 5. Flujos de Trabajo e Interacción de Procesos

### 5.1. Diagrama de Flujo del Proceso de Inmunización y Certificación

Modela el flujo de decisión clínica para la atención de pacientes, evaluación del esquema de vacunación y generación final de certificados médicos sanitarios:

```mermaid
flowchart TD
    A[Inicio: Llegada del Paciente] --> B{Evaluación de Criterio de Edad}
    B -->|Infante| C[Identificación de Categoría]
    B -->|Niño / Adolescente| C
    B -->|Adulto / Adulto Mayor| C

    C --> D{¿Estatus en Sistema RECIPIENT?}
    D -->|Nuevo Paciente| E[Registro de Datos Personales en RECIPIENT]
    D -->|Registrado Previamente| F[Consulta de Historial de IMMUNIZATION]

    E --> F
    F --> G{¿Esquema de Inmunización?}
    G -->|Pendiente / Incompleto| H[Registro de Aplicación en IMMUNIZATION]
    H --> I{¿Requiere Evaluación Adicional?}

    I -->|Sí| J[Realización de Examen en MEDICAL_EXAM]
    I -->|No| K[Programar Próxima Cita & Recordatorio SMS]
    J --> K
    K --> A

    G -->|Completo & Verificado| L[Emisión de Certificado Oficial MEDICAL_CERTIFICATE]
    L --> M[Generación de Código Único de Certificado]
    M --> N[Fin: Entrega / Envío Digital de Tarjeta]

```

### 5.2. Diagrama de Secuencia: Operación de Registro de Aplicación (DFD de Secuencia)

Describe el intercambio de datos entre el **Personal Inmunizador**, la lógica de aplicación del sistema y las tablas de la base de datos relacional:

```mermaid
sequenceDiagram
    autonumber
    actor PI as Personal Inmunizador
    participant Sys as Sistema de Gestión (API/Web)
    participant DB as Base de Datos (Relacional)

    %% Autenticación
    PI->>Sys: Autenticación (Username / Password)
    Sys->>DB: Consulta USER, ROLE y ROLE_PERMISSION
    DB-->>Sys: Retorna permisos del usuario
    Sys-->>PI: Sesión iniciada con rol Inmunizador

    %% Búsqueda / Registro
    PI->>Sys: Buscar Cédula / Documento (identification_number)
    Sys->>DB: Query SELECT sobre tabla RECIPIENT
    alt Paciente no existe
        DB-->>Sys: Sin resultados
        Sys-->>PI: Solicita formulario de alta
        PI->>Sys: Registrar nuevo RECIPIENT
        Sys->>DB: INSERT INTO RECIPIENT
    else Paciente existe
        DB-->>Sys: Retorna datos de RECIPIENT
    end

    %% Inmunización
    PI->>Sys: Registrar dosis (id_vaccine, id_center, datetime)
    Sys->>DB: INSERT INTO IMMUNIZATION
    DB-->>Sys: Confirmación de inserción (id_dose)

    %% Emisión o Notificación
    alt Esquema Incompleto
        PI->>Sys: Programar recordatorio de próxima dosis
        Sys-->>PI: Confirmación de recordatorio
    else Esquema Completo
        PI->>Sys: Solicitar certificado oficial
        Sys->>DB: INSERT INTO MEDICAL_CERTIFICATE (code, id_dose, id_person)
        DB-->>Sys: Certificado generado
        Sys-->>PI: PDF / Código QR de Certificado para impresión
    end

```

## 6. Especificaciones de Implementación y Seguridad

1. **Autenticación y Seguridad Granular:**

- Las contraseñas deben almacenarse encriptadas con algoritmo hash seguro (`password_hash` en la tabla `USER`).
- Toda petición a la API debe validar la matriz de permisos de la tabla intermedia `ROLE_PERMISSION`.

2. **Trazabilidad Territorial Obligatoria:**

- Cada registro de aplicación en `IMMUNIZATION` requiere la llave foránea obligatoria `id_center`, garantizando la auditoría exacta del centro de salud, parroquia, municipio y estado donde se aplicó el biológico.

3. **Verificación de Certificados:**

- El atributo `code` en la tabla `MEDICAL_CERTIFICATE` contendrá un hash alfanumérico único asociado a un código QR impreso en la tarjeta digital del ciudadano, permitiendo la validación pública e inalterable desde el módulo "Tu Tarjeta".
