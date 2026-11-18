# API de SINACIMN

Este documento define el diseño de la API rest del **Sistema Nacional de Inmunización y Control de Vacunación (SINACIMN)**.

## Convenciones generales

| Aspecto            | Definición                                             |
| ------------------ | ------------------------------------------------------ |
| Base URL           | `TODO` (ej. `https://api.sinacimn.gob.ve/v1`)          |
| Formato            | JSON                                                   |
| Versionado         | `TODO` (ej. prefijo `/v1`, cabecera `Accept`, etc.)    |
| Autenticación      | `TODO` (ej. `Authorization: Bearer <JWT>`)             |
| Autorización       | `TODO` (roles + jurisdicción territorial por petición) |
| Paginación         | `TODO` (ej. `?page=1&limit=20`)                        |
| Filtros / búsqueda | `TODO`                                                 |
| Ordenamiento       | `TODO`                                                 |
| Zona horaria       | `TODO` (ej. ISO 860`America/Caracas`)                  |
| Idioma de errores  | `TODO`                                                 |

### Envoltorio de respuesta (éxito)

```json
{
  "data": {},
  "meta": {}
}
```

> `TODO`: confirmar si se usa envoltorio o se devuelve el recurso directamente.

### Formato de error

```json
{
  "error": {
    "code": "TODO",
    "message": "TODO",
    "details": []
  }
}
```

### Códigos de estado

| Código | Uso    |
| ------ | ------ |
| 2      | `TODO` |
| 2      | `TODO` |
| 2      | `TODO` |
| 4      | `TODO` |
| 4      | `TODO` |
| 4      | `TODO` |
| 4      | `TODO` |
| 4      | `TODO` |
| 4      | `TODO` |
| 5      | `TODO` |

## Cómo documentar un endpoint

Copiar este bloque para cada operación:

````md
#### `MÉTODO /ruta/:id`

Breve descripción. `TODO`

- **Acceso:** `TODO` (público / roles permitidos)
- **Jurisdicción:** `TODO` (global / estado / municipio / centro de salud)

**Parámetros de ruta**

| Nombre | Tipo | Descripción |
| ------ | ---- | ----------- |
| `id`   | int  | `TODO`      |

**Query params**

| Nombre | Tipo | Requerido | Descripción |
| ------ | ---- | --------- | ----------- |
| `TODO` |      |           |             |

**Request body** (`TODO`)

```json
{}
```
````

**Response 200** (`TODO`)

```json
{
  "data": {}
}
```

**Errores**

| Código | Motivo |
| ------ | ------ |
| `TODO` | `TODO` |

````

### Ejemplo rellenado (solo para ilustrar el formato)

#### `GET /ejemplo`

`TODO`: reemplazar por un endpoint real cuando se defina el primero.

- **Acceso:** `TODO`
- **Jurisdicción:** `TODO`

**Query params**

| Nombre | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `limit` | int | No | `TODO` |

**Response 200**

```json
{
  "data": [],
  "meta": { "total": 0 }
}
````

## Módulos (según `specs.md`)

> Cada módulo debe completarse con los endpoints que se decidan. No hay nada definido aún.

### Identidad y Acceso (IAM)

`TODO`: autenticación, usuarios, roles, permisos, suspensión de cuentas, asignación granular.
Entidades: `usuario`, `rol`, `permiso`, `usuario_rol`, `rol_permiso`.
Base de datos: control de acceso (aislada de la clínica).

### Estructura Territorial e Infraestructura

`TODO`: consulta y administración jerárquica; alta/habilitación de centros de salud.
Entidades: `estado`, `municipio`, `parroquia`, `centro_salud`.

### Registro Demográfico y Pacientes

`TODO`: alta, consulta y actualización de personas; vínculos de representación legal.
Entidades: `persona`, `representacion`.

### Cadena de Suministro e Inventario

`TODO`: recepción de envíos, lotes, expiraciones, stock por centro, descuento automático.
Entidades: `lote`, `inventario`, `envio`, `detalle_envio`.

### Registro Clínico y Esquemas de Inmunización

`TODO`: esquemas, vacunas, aplicación de dosis, exámenes y resultados.
Entidades: `esquema_vacunacion`, `vacuna`, `esquema_vacunacion_vacuna`, `inmunizacion`, `examen_medico`, `parametro_examen_medico`, `resultado_examen_medico`.

### Certificación y Validación Criptográfica

`TODO`: tarjetas digitales, firmas, códigos QR/verificación, certificados médicos.
Entidades: `tarjeta_vacunacion`, `certificado_medico`.
Nota: la verificación pública no debe exponer datos sensibles adicionales.

### Analítica y Monitoreo Epidemiológico

`TODO`: métricas, mapas, cuadros comparativos por estado/municipio.

### Módulo Ciudadano "Tu Tarjeta" (público)

`TODO`: consulta por cédula de identidad, reenvío de tarjeta al correo registrado.
Nota: `TODO` definir protección contra abuso (rate limiting, verificación adicional).

## Decisiones pendientes

- `TODO`: definir si la API es REST, GraphQL, RPC, etc.
- `TODO`: contrato de jurisdicción (cómo se propaga el ámbito del usuario a cada consulta).
- `TODO`: estrategia de firma/QR y formato del código de verificación.
- `TODO`: modelo de errores y códigos de negocio.
- `TODO`: contrato de eventos / efectos secundarios (descuento de stock, envío de correo).
