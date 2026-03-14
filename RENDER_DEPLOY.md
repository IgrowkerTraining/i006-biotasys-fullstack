# Render deploy

Servicios previstos:

- `biotasys-frontend`: Static Site desde `apps/frontend`
- `biotasys-backend`: Web Service Node desde `apps/backend`
- `biotasys-db`: Postgres gestionado por Render

Variables que debes completar al crear el blueprint:

- `VITE_API_URL`: URL publica del backend, por ejemplo `https://biotasys-backend.onrender.com`
- `FRONTEND_URL`: URL publica del frontend
- `APP_URL`: URL publica del frontend
- `CORS_ALLOWED_ORIGINS`: lista separada por comas con los origenes permitidos
- credenciales de email y variables de IA si esas funciones se van a usar

Notas:

- El frontend usa `BrowserRouter`, por eso `render.yaml` incluye rewrite a `/index.html`.
- El backend expone `GET /health` para el health check de Render.
- `DB_SYNCHRONIZE=true` se deja activado en el blueprint porque el repositorio no incluye migraciones. Si mas adelante anades migraciones, cambia este valor a `false`.
