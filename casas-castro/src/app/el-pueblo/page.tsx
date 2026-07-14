import type { Metadata } from "next";
import { pueblo } from "@/content/pueblo";

export const metadata: Metadata = {
  title: "El pueblo y alrededores",
  description:
    "Qué ver y hacer en Castro Urdiales: playas, gastronomía y cómo llegar desde Bilbao y Santander.",
};

export default function PuebloPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl text-ink">Castro Urdiales y alrededores</h1>
      <p className="mt-3 max-w-2xl text-muted">{pueblo.intro}</p>

      <section className="mt-10">
        <h2 className="mb-4 text-xl text-ink">Qué ver</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {pueblo.queVer.map((item) => (
            <div
              key={item.titulo}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <h3 className="text-lg text-ink">{item.titulo}</h3>
              <p className="mt-2 text-sm text-muted">{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl text-ink">Playas</h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {pueblo.playas.map((p) => (
            <li
              key={p.nombre}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <span className="font-medium text-ink">{p.nombre}</span>
              <p className="mt-1 text-sm text-muted">{p.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-2 text-xl text-ink">Gastronomía</h2>
          <p className="text-sm text-muted">{pueblo.gastronomia}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-2 text-xl text-ink">Fiestas</h2>
          <p className="text-sm text-muted">{pueblo.fiestas}</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl text-ink">Cómo llegar</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {pueblo.comoLlegar.map((c) => (
            <div
              key={c.destino}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <h3 className="text-lg text-ink">{c.destino}</h3>
              <p className="mt-2 text-sm text-muted">{c.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl text-ink">Excursiones cercanas</h2>
        <ul className="flex flex-wrap gap-2">
          {pueblo.excursiones.map((e) => (
            <li
              key={e}
              className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted"
            >
              {e}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
