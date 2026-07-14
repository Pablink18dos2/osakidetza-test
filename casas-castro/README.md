# Casas en Castro Urdiales

Web para mostrar y gestionar el alquiler de dos casas en Castro Urdiales:
fotos, precios, ubicación, disponibilidad y solicitud de reserva **sin pago
online** (confirmación manual del propietario por email).

> Proyecto autónomo. Vive dentro del repo `osakidetza-test` en la carpeta
> `casas-castro/`, pero es independiente de la app de tests que hay en la raíz.
> Puede extraerse a su propio repositorio copiando esta carpeta.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Prisma** como ORM. **SQLite** en desarrollo; migrable a **Postgres/Supabase**
  en producción sin reescribir el esquema.
- **Resend** para emails (simulados por consola si no hay API key).
- Pensado para desplegar en **Vercel** (incluye `vercel.json` con el cron).

## Puesta en marcha

```bash
cd casas-castro
npm install
cp .env.example .env      # revisa/rellena los valores
npm run db:push           # crea la base de datos SQLite
npm run db:seed           # datos de ejemplo (2 casas + reseñas)
npm run dev               # http://localhost:3000
```

### Scripts útiles

| Script              | Qué hace                                          |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                            |
| `npm run build`     | Compila (genera cliente Prisma + build de Next)   |
| `npm run db:push`   | Sincroniza el esquema con la base de datos        |
| `npm run db:seed`   | Carga datos de ejemplo                            |
| `npm run db:reset`  | Recrea la base de datos y vuelve a cargar el seed |
| `npm run db:studio` | Explora la base de datos (Prisma Studio)          |

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
4. ⏳ **Producción** — migración a Postgres/Supabase, fotos reales, textos
   legales definitivos y datos reales de las casas.

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
