# Casas en Castro Urdiales

Web para mostrar y gestionar el alquiler de dos casas en Castro Urdiales:
fotos, precios, ubicación, disponibilidad y solicitud de reserva **sin pago
online** (confirmación manual del propietario por email).

> Proyecto autónomo. Vive dentro del repo `osakidetza-test` en la carpeta
> `casas-castro/`, pero es independiente de la app de tests que hay en la raíz.
> Puede extraerse a su propio repositorio copiando esta carpeta.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Prisma** como ORM sobre **PostgreSQL** (Neon/Supabase/Vercel Postgres).
- **Resend** para emails (simulados por consola si no hay API key).
- Desplegable en **Vercel** (incluye `vercel.json` con el cron). Ver
  **[DEPLOY.md](./DEPLOY.md)**.

## Puesta en marcha

Necesitas una base de datos PostgreSQL (p. ej. una gratis en Neon o Supabase;
en local también vale un Postgres por Docker).

```bash
cd casas-castro
npm install
cp .env.example .env      # pon tus DATABASE_URL y DIRECT_URL de Postgres
npm run db:deploy         # aplica las migraciones (crea las tablas)
npm run db:seed           # datos de ejemplo (2 casas + reseñas)
npm run dev               # http://localhost:3000
```

### Scripts útiles

| Script               | Qué hace                                              |
| -------------------- | ---------------------------------------------------- |
| `npm run dev`        | Servidor de desarrollo                               |
| `npm run build`      | Compila (genera cliente Prisma + build de Next)      |
| `npm run vercel-build` | Build de producción (migraciones + build)          |
| `npm run db:migrate` | Crea/aplica una migración en desarrollo              |
| `npm run db:deploy`  | Aplica migraciones pendientes (producción)           |
| `npm run db:seed`    | Carga datos de ejemplo                               |
| `npm run db:studio`  | Explora la base de datos (Prisma Studio)             |

## Estructura

```
src/
├── app/                      # Rutas (App Router)
│   ├── page.tsx              # Home
│   ├── casas/[slug]/         # Ficha de cada casa
│   ├── el-pueblo/            # Castro Urdiales y alrededores
│   ├── contacto/
│   ├── aviso-legal/ · privacidad/
│   ├── admin/                # Panel del propietario (placeholder)
│   ├── reserva/confirmar|rechazar/[token]/  # enlaces de los emails (placeholder)
│   └── api/
│       ├── reservas/         # crear solicitud (stub, fase reservas)
│       └── cron/liberar-provisionales/      # libera provisionales caducadas
├── components/               # UI (layout, casas, reseñas, ui)
├── content/                  # Textos y config editables (site, pueblo, servicios)
├── lib/
│   ├── prisma.ts             # cliente Prisma (singleton)
│   ├── data/                 # acceso a datos (casas, reseñas)
│   ├── email/                # servicio de email (Resend / consola)
│   └── reservas/             # lógica de dominio (fechas, liberación)
└── types/                    # tipos compartidos (estados, servicios)
prisma/
├── schema.prisma             # modelo de datos
└── seed.ts                   # datos de ejemplo
```

## Variables de entorno

Ver `.env.example`. Resumen:

- `DATABASE_URL` — SQLite en dev, Postgres en prod.
- `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_PROPIETARIO` — envío de emails.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` — acceso al panel de admin.
- `NEXT_PUBLIC_SITE_URL` — para los enlaces de los emails.
- `CRON_SECRET` — protege el endpoint de cron.

## Estado y fases

Este repositorio es el **esqueleto**. Plan de construcción:

1. ✅ **Estructura base** — Next.js + Prisma + modelo de datos + páginas
   públicas con datos de ejemplo + sistema de diseño.
2. ✅ **Flujo de reservas** — calendario con estados (libre / provisional /
   ocupado), formulario, creación de solicitud provisional (48h), emails y
   rutas de confirmar/rechazar.
3. ✅ **Panel de administración** — login del propietario y gestión de
   reservas, bloqueo manual de fechas, precios, descripciones, fotos,
   servicios y reseñas.
4. ✅ **Listo para producción** — PostgreSQL + migraciones Prisma +
   `vercel-build`. Guía completa en **[DEPLOY.md](./DEPLOY.md)**. Pendiente
   solo lo que depende de datos/servicios reales: fotos, textos legales
   definitivos y los datos reales de las casas.

> ⚠️ El contenido actual (nombres, direcciones, precios, descripciones y
> fotos) es **inventado** y debe sustituirse por el real. Los puntos
> pendientes están en la sección 0 del documento de plan original.

## Panel de administración

Accede en `/admin` (redirige a `/admin/login`). La contraseña se define en
`ADMIN_PASSWORD`. Desde el panel puedes:

- **Reservas:** ver todas con filtros por casa/estado, confirmar o rechazar
  solicitudes, eliminar y **bloquear fechas manualmente**.
- **Casas:** editar nombre, descripciones, precios, capacidad, servicios y
  la lista de fotos (una URL por línea).
- **Reseñas:** añadir, eliminar y marcar como destacadas (aparecen en la Home).
