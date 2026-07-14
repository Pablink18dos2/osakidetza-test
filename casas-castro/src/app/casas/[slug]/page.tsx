import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCasaBySlug, getSlugs } from "@/lib/data/casas";
import { getResenasDeCasa } from "@/lib/data/resenas";
import { etiquetasServicio } from "@/content/servicios";
import { reglasReserva } from "@/content/site";
import { formatEuros } from "@/lib/format";
import { Galeria } from "@/components/casas/Galeria";
import { Mapa } from "@/components/casas/Mapa";
import { ResenaCard } from "@/components/resenas/ResenaCard";

// Genera las rutas estáticas de cada casa en build.
export async function generateStaticParams() {
  const slugs = await getSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/casas/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const casa = await getCasaBySlug(slug);
  if (!casa) return {};
  return {
    title: casa.nombre,
    description: casa.descripcionCorta,
  };
}

export default async function CasaPage(props: PageProps<"/casas/[slug]">) {
  const { slug } = await props.params;
  const casa = await getCasaBySlug(slug);
  if (!casa) notFound();

  const resenas = await getResenasDeCasa(casa.id);

  return (
    <div className="container-page py-10">
      {/* Cabecera */}
      <div className="mb-6">
        <h1 className="text-3xl text-ink">{casa.nombre}</h1>
        <p className="mt-1 text-muted">{casa.direccion}</p>
      </div>

      {/* Galería */}
      <Galeria fotos={casa.fotos} nombre={casa.nombre} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Columna principal */}
        <div className="space-y-10">
          {/* Descripción */}
          <section>
            <h2 className="mb-3 text-xl text-ink">Sobre la casa</h2>
            <p className="whitespace-pre-line leading-relaxed text-muted">
              {casa.descripcionLarga}
            </p>
          </section>

          {/* Características */}
          <section>
            <h2 className="mb-3 text-xl text-ink">Características</h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink">
              <li>{casa.capacidad} huéspedes</li>
              <li>{casa.habitaciones} habitaciones</li>
              <li>{casa.banos} baños</li>
            </ul>
            {casa.servicios.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {casa.servicios.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted"
                  >
                    {etiquetasServicio[s] ?? s}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Ubicación */}
          <section>
            <h2 className="mb-3 text-xl text-ink">Ubicación</h2>
            <Mapa lat={casa.lat} lng={casa.lng} nombre={casa.nombre} />
          </section>

          {/* Reseñas */}
          {resenas.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl text-ink">Reseñas</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {resenas.map((r) => (
                  <ResenaCard key={r.id} resena={r} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Columna lateral: precio + reserva (placeholder de la siguiente fase) */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-surface p-6">
            <p className="text-2xl text-ink">
              {formatEuros(casa.precioTemporadaBaja)}
              <span className="text-sm text-muted"> /noche</span>
            </p>
            {casa.precioTemporadaAlta && (
              <p className="mt-1 text-sm text-muted">
                Temporada alta: {formatEuros(casa.precioTemporadaAlta)} /noche
              </p>
            )}
            <p className="mt-1 text-sm text-muted">
              Estancia mínima: {reglasReserva.minNoches} noches
            </p>

            {/* TODO (fase reservas): calendario de disponibilidad con estados
                libre / provisional / ocupado + formulario de solicitud. */}
            <div className="mt-6 rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted">
              Calendario y formulario de reserva
              <br />
              (próxima fase)
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
