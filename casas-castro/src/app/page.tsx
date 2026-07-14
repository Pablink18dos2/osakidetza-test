import Link from "next/link";
import { getCasas } from "@/lib/data/casas";
import { getResenasDestacadas } from "@/lib/data/resenas";
import { pueblo } from "@/content/pueblo";
import { CasaCard } from "@/components/casas/CasaCard";
import { ResenaCard } from "@/components/resenas/ResenaCard";

export default async function HomePage() {
  const [casas, resenas] = await Promise.all([
    getCasas(),
    getResenasDestacadas(3),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-brand-soft">
        <div className="container-page py-16 text-center sm:py-24">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-brand">
            Castro Urdiales · Cantabria
          </p>
          <h1 className="mx-auto max-w-2xl text-4xl text-ink sm:text-5xl">
            Dos casas para tu escapada al mar
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Consulta fotos, precios y disponibilidad, y solicita tu reserva
            online. Sin pagos por adelantado: confirmamos por email.
          </p>
        </div>
      </section>

      {/* Casas */}
      <section className="container-page py-14">
        <h2 className="mb-6 text-2xl text-ink">Las casas</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {casas.map((casa) => (
            <CasaCard key={casa.id} casa={casa} />
          ))}
        </div>
      </section>

      {/* El pueblo */}
      <section className="container-page py-14">
        <div className="rounded-xl border border-border bg-surface p-8">
          <h2 className="mb-3 text-2xl text-ink">El pueblo y alrededores</h2>
          <p className="max-w-2xl text-muted">{pueblo.intro}</p>
          <Link
            href="/el-pueblo"
            className="mt-4 inline-block text-sm font-medium text-brand hover:text-brand-dark"
          >
            Descubre Castro Urdiales →
          </Link>
        </div>
      </section>

      {/* Reseñas */}
      {resenas.length > 0 && (
        <section className="container-page py-14">
          <h2 className="mb-6 text-2xl text-ink">Lo que dicen los huéspedes</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {resenas.map((resena) => (
              <ResenaCard key={resena.id} resena={resena} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
