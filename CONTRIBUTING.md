# Contribuyendo

Gracias por ayudar a mantener el proyecto. Antes de empezar, revisa los issues y las pull requests abiertas para evitar duplicar trabajo.

## Documentación

Antes de realizar cualquier cambio, consulta la documentación disponible en [esta carpeta](./docs/). Aquí puedes encontrar información relevante como la guía de estilo, especificaciones del sistema, diseño de la api y base de datos, entre otras.

## Flujo de trabajo

**Todo cambio se envía por pull request. No se hace push directo a `dev` ni a `main`.**

1. Actualiza tu rama local de `dev`:

```bash
git switch dev
git pull origin dev
```

2. Crea una rama de trabajo a partir de `dev`.

3. Haz commits pequeños y enfocados en un solo cambio.

4. Antes de abrir la PR, verifica el formato, el linter y la compilación (teniendo las dependencias ya instaladas):

```bash
pnpm run format:check
pnpm run lint
pnpm run build
```

5. Abre la PR contra **`dev`**. Indica qué cambiaste, cómo probarlo y enlaza el issue relacionado si existe.

6. Atiende los comentarios de revisión en la misma rama. Si `dev` avanzó mientras tanto, actualiza la rama desde `dev` y vuelve a ejecutar las verificaciones.

7. Una vez aprobada, la PR se integra en `dev`.

8. Cuando `dev` quede en un estado aprobado como versión, se abre una PR de **`dev` a `main`**. `main` solo recibe esas PRs de versión; no recibe pushes directos ni PRs de ramas de trabajo.

## Convenciones del proyecto

### Ramas

Usa nombres `<tipo>/<descripcion-corta>` en `kebab-case`, por ejemplo:

- `feat/agregar-login`
- `fix/corregir-carga-de-env`
- `docs/actualizar-contributing`
- `refactor/mover-enrutado`
- `chore/actualizar-dependencias`

Los tipos habituales son `feat`, `fix`, `docs`, `refactor` y `chore`. Mantén el alcance de cada rama lo más pequeño posible.

### Commits

Usa mensajes `<tipo>: <descripción corta>`, con la descripción en español y en modo imperativo:

```text
feat: agregar endpoint de login
fix: corregir carga de variables de entorno
docs: actualizar guía de contribución
```

Los scopes son opcionales, por ejemplo `feat(auth): agregar logout`. Evita mensajes genéricos como `cambios` o `arreglos`.

### Código y formato

- Se usa `pnpm` como gestor de paquetes; no mezcles `npm` ni `yarn`.
- El código está en TypeScript y organizado por módulos dentro de `app/`.
- Prettier define el formato: sin punto y coma, comillas simples, indentación de 2 espacios y un atributo por línea en JSX. Ejecuta `pnpm run format` antes de commitear.
- Oxlint es el linter del proyecto. Corrige los avisos en lugar de desactivar reglas.
- Si cambias la API, el modelo de datos o los permisos, actualiza la documentación correspondiente en la misma PR.
- No subas archivos `.env`. Usa `example.env` como plantilla y ajusta las credenciales en tu entorno local.
