# Diagrama Entidad-Relación (ERD)

## Sistema Nacional de Inmunización y Control de Vacunación

A continuación se presenta el modelo entidad-relación que rige la persistencia de datos del sistema, garantizando la trazabilidad geográfica, la gestión de inventario y dosis, y la seguridad por roles (RBAC).

```mermaid
erDiagram
    STATE {
        int id_state PK
        string name
        string code
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
        string code
        string name
        string type
        string address
        string sector
        string status
        string phone
        string email
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

## Relaciones Principales

1. **Jerarquía Territorial:**
   - Un `STATE` posee múltiples `MUNICIPALITY`.
   - Un `MUNICIPALITY` posee múltiples `PARISH`.
   - Una `PARISH` alberga múltiples `HEALTH_CENTER`.

2. **Trazabilidad de Inmunización:**
   - Cada dosis registrada en `IMMUNIZATION` vincula obligatoriamente un paciente (`RECIPIENT`), una vacuna (`VACCINE`) y el centro de salud donde fue inoculada (`HEALTH_CENTER`).

3. **Control de Acceso (RBAC):**
   - Los usuarios (`USER`) están asociados a un rol (`ROLE`).
   - Cada rol (`ROLE`) tiene asignados uno o más permisos (`PERMISSION`) a través de la tabla relacional intermedia `ROLE_PERMISSION`.
