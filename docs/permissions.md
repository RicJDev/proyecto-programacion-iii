# Catálogo de Permisos

Este documento define formalmente la lista de permisos del **Sistema Nacional de Inmunización y Control de Vacunación (SINACIMN)**, así como su asignación a cada rol predefinido.

## 1. Listado de Permisos

Convención de nomenclatura: `recurso:accion`

| Permiso                  | Módulo Funcional                         | Descripción Oficial                                                                           |
| :----------------------- | :--------------------------------------- | :-------------------------------------------------------------------------------------------- |
| `users:create`           | Identidades y Acceso                     | Crear y registrar nuevas cuentas de usuario administrativas en el sistema.                    |
| `users:read`             | Identidades y Acceso                     | Consultar y listar cuentas de usuario existentes.                                             |
| `users:update`           | Identidades y Acceso                     | Actualizar datos, credenciales y perfiles de usuarios administrativos.                        |
| `users:suspend`          | Identidades y Acceso                     | Suspender, desactivar o revocar el acceso a un usuario.                                       |
| `roles:manage`           | Identidades y Acceso                     | Crear roles y gestionar la asignación granular de permisos.                                   |
| `centers:create`         | Estructura Territorial e Infraestructura | Registrar y habilitar un nuevo centro de salud asociado a su parroquia, municipio y estado.   |
| `centers:read`           | Estructura Territorial e Infraestructura | Consultar el directorio, ubicación y detalles de centros de salud.                            |
| `centers:update`         | Estructura Territorial e Infraestructura | Modificar datos, estatus operativo e información de centros de salud.                         |
| `recipients:create`      | Registro Demográfico y Pacientes         | Dar de alta a un nuevo ciudadano/paciente en el sistema.                                      |
| `recipients:read`        | Registro Demográfico y Pacientes         | Buscar y consultar expedientes de pacientes por cédula de identidad o nombre.                 |
| `recipients:update`      | Registro Demográfico y Pacientes         | Actualizar información demográfica, peso o datos clínicos base de los pacientes.              |
| `representations:manage` | Registro Demográfico y Pacientes         | Crear y gestionar vínculos de representación legal para menores o dependientes.               |
| `vaccines:manage`        | Cadena de Suministro e Inventario        | Administrar el catálogo nacional de vacunas y biológicos.                                     |
| `schemes:manage`         | Registro Clínico y Esquemas              | Definir y publicar esquemas de vacunación por rango de edad y vacunas asociadas.              |
| `shipments:manage`       | Cadena de Suministro e Inventario        | Registrar órdenes de envío, remitentes y detalles de lotes despachados a los centros.         |
| `inventory:read`         | Cadena de Suministro e Inventario        | Consultar existencias de stock, lotes y fechas de expiración disponibles en el centro.        |
| `inventory:manage`       | Cadena de Suministro e Inventario        | Recepcionar lotes, actualizar existencias y controlar el inventario local del centro.         |
| `immunizations:create`   | Registro Clínico y Esquemas              | Registrar la aplicación de una dosis vinculando paciente, tarjeta, lote, fecha/hora y centro. |
| `immunizations:read`     | Registro Clínico y Esquemas              | Consultar el historial de dosis aplicadas de un paciente.                                     |
| `exams:create`           | Registro Clínico y Esquemas              | Configurar exámenes médicos, parámetros (mínimo/máximo) y registrar resultados de aptitud.    |
| `exams:read`             | Registro Clínico y Esquemas              | Consultar el historial de evaluaciones y resultados de exámenes médicos de un paciente.       |
| `cards:issue`            | Certificación y Validación               | Generar, actualizar e imprimir/reenviar la tarjeta digital de vacunación con código QR único. |
| `certificates:issue`     | Certificación y Validación               | Emitir y firmar electrónicamente el Certificado Oficial de Salud del paciente.                |
| `certificates:verify`    | Certificación y Validación               | Validar públicamente la autenticidad de tarjetas y certificados mediante su código único/QR.  |
| `reports:national`       | Analítica y Monitoreo Epidemiológico     | Acceder al dashboard centralizado de métricas epidemiológicas y comparativas nacionales.      |
| `reports:regional`       | Analítica y Monitoreo Epidemiológico     | Visualizar mapas interactivos y estadísticas de cobertura a nivel estatal/regional.           |
| `reports:local`          | Analítica y Monitoreo Epidemiológico     | Generar reportes operativos de dosis aplicadas y movimientos de inventario por centro.        |

## 2. Matriz de Asignación por Rol

| Permiso                  | Administrador Maestro (Ministerio) | Administrador Regional (Dir. Regionales) | Administrador Local (Centro de Salud) |
| :----------------------- | :--------------------------------: | :--------------------------------------: | :-----------------------------------: |
| `users:create`           |         SI (Cualquier rol)         |       SI (Administradores Locales)       |                  NO                   |
| `users:read`             |                 SI                 |              SI (Su región)              |            SI (Su perfil)             |
| `users:update`           |                 SI                 |              SI (Su región)              |            SI (Su perfil)             |
| `users:suspend`          |                 SI                 |       SI (Administradores Locales)       |                  NO                   |
| `roles:manage`           |                 SI                 |                    NO                    |                  NO                   |
| `centers:create`         |                 SI                 |              SI (Su estado)              |                  NO                   |
| `centers:read`           |                 SI                 |                    SI                    |                  SI                   |
| `centers:update`         |                 SI                 |              SI (Su estado)              |                  NO                   |
| `recipients:create`      |                 NO                 |                    NO                    |                  SI                   |
| `recipients:read`        |                 SI                 |                    SI                    |                  SI                   |
| `recipients:update`      |                 NO                 |                    NO                    |                  SI                   |
| `representations:manage` |                 NO                 |                    NO                    |                  SI                   |
| `vaccines:manage`        |                 SI                 |                    NO                    |                  NO                   |
| `schemes:manage`         |                 SI                 |                    NO                    |                  NO                   |
| `shipments:manage`       |                 SI                 |              SI (Su región)              |                  NO                   |
| `inventory:read`         |                 SI                 |              SI (Su región)              |            SI (Su centro)             |
| `inventory:manage`       |                 SI                 |                    NO                    |            SI (Su centro)             |
| `immunizations:create`   |                 NO                 |                    NO                    |            SI (Su centro)             |
| `immunizations:read`     |                 SI                 |                    SI                    |                  SI                   |
| `exams:create`           |      SI (Catálogo/Parámetros)      |                    NO                    |       SI (Resultados pacientes)       |
| `exams:read`             |                 SI                 |                    SI                    |                  SI                   |
| `cards:issue`            |                 NO                 |                    SI                    |        SI (Impresión/Emisión)         |
| `certificates:issue`     |                 NO                 |         SI (Certificado Oficial)         |                  NO                   |
| `certificates:verify`    |                 SI                 |                    SI                    |                  SI                   |
| `reports:national`       |                 SI                 |                    NO                    |                  NO                   |
| `reports:regional`       |                 SI                 |              SI (Su estado)              |                  NO                   |
| `reports:local`          |                 SI                 |              SI (Su estado)              |            SI (Su centro)             |
