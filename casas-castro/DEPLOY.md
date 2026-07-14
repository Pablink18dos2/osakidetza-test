# Despliegue en producción (Vercel + Postgres)

La web está lista para desplegar. Como Vercel es _serverless_ (sistema de
archivos efímero), en producción **no se usa SQLite sino PostgreSQL**. El
proyecto ya está configurado para ello; solo hay que enchufar tres servicios.

## Resumen: 3 cosas que necesitas

1. **Una base de datos PostgreSQL** (gratis): [Neon](https://neon.tech) o
   [Supabase](https://supabase.com), o **Vercel Postgres** desde el propio panel.
2. **Una clave de [Resend](https://resend.com)** para enviar los emails (tiene
   capa gratuita). Opcional al principio: sin ella, los emails se registran en
   los logs y no se envían.
3. **Una cuenta de [Vercel](https://vercel.com)** (gratis) conectada a tu GitHub.

---

## Paso 1 · Base de datos

En Neon o Supabase, crea un proyecto y copia **dos** cadenas de conexión:

- `DATABASE_URL` → la **pooled** (con PgBouncer; suele incluir `?pgbouncer=true`).
- `DIRECT_URL` → la **directa** (para las migraciones).

En Vercel Postgres te dan las variables ya hechas; usa la _pooled_ para
`DATABASE_URL` y la _non-pooling_ para `DIRECT_URL`.

## Paso 2 · Importar el proyecto en Vercel

1. En Vercel: **Add New → Project** e importa el repositorio de GitHub.
2. **Importante:** en _Root Directory_ selecciona **`casas-castro`** (la web
   vive en esa subcarpeta del repo).
3. Framework: Next.js (se detecta solo). No cambies el _Build Command_: Vercel
   usa automáticamente el script `vercel-build`, que aplica las migraciones y
   compila.

## Paso 3 · Variables de entorno en Vercel

En _Settings → Environment Variables_ añade (ver `.env.example`):

| Variable | Valor |
| --- | --- |
| `DATABASE_URL` | cadena pooled de Postgres |
| `DIRECT_URL` | cadena directa de Postgres |
| `AUTH_SECRET` | texto largo y aleatorio (p. ej. `openssl rand -hex 32`) |
| `ADMIN_PASSWORD` | la contraseña del panel `/admin` |
| `NEXT_PUBLIC_SITE_URL` | la URL final del sitio (p. ej. `https://tusitio.vercel.app`) |
| `CRON_SECRET` | texto aleatorio (Vercel lo usa para autenticar el cron) |
| `RESEND_API_KEY` | tu clave de Resend (opcional al principio) |
| `EMAIL_FROM` | remitente verificado en Resend |
| `EMAIL_PROPIETARIO` | email donde quieres recibir las solicitudes |

Pulsa **Deploy**. El primer despliegue creará las tablas automáticamente.

## Paso 4 · Cargar los datos iniciales (una vez)

Las tablas se crean vacías. Para tener las dos casas de ejemplo, ejecuta el
seed una vez apuntando a la base de datos de producción (desde tu ordenador):

```bash
cd casas-castro
DATABASE_URL="<tu DATABASE_URL de prod>" \
DIRECT_URL="<tu DIRECT_URL de prod>" \
npm run db:seed
```

Después entra en `/admin` (contraseña = `ADMIN_PASSWORD`) y sustituye los
datos de ejemplo por los reales: nombres, descripciones, precios, fotos y
reseñas.

## Notas

- **Cron:** libera reservas provisionales caducadas. Está configurado a diario
  (`vercel.json`) para ser compatible con el plan gratuito; además, las fechas
  caducadas se liberan igualmente cada vez que alguien abre un calendario, así
  que no dependen solo del cron.
- **Fotos:** ahora son imágenes de ejemplo en `public/placeholder`. Para las
  reales, súbelas (a `public/` o a un almacenamiento como Vercel Blob/Supabase
  Storage) y pon sus URLs en el panel de administración (una por línea).
- **Migraciones futuras:** si cambias el modelo de datos, genera una migración
  con `npm run db:migrate` en local y súbela; Vercel la aplicará en el deploy.
