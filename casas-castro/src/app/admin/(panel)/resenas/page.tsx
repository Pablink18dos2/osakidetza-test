import type { Metadata } from "next";
import { listarResenas } from "@/lib/data/resenas";
import { getCasas } from "@/lib/data/casas";
import { formatFecha } from "@/lib/format";
import { Rating } from "@/components/ui/Rating";
import {
  accionCrearResena,
  accionEliminarResena,
  accionToggleDestacada,
} from "../actions";

export const metadata: Metadata = { title: "Reseñas — Administración" };

export default async function AdminResenasPage() {
  const [resenas, casas] = await Promise.all([listarResenas(), getCasas()]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl text-ink">Reseñas</h1>

      {/* Nueva reseña */}
      <form
        action={accionCrearResena}
        className="space-y-3 rounded-xl border border-border bg-surface p-5"
      >
        <h2 className="text-lg text-ink">Añadir reseña</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm text-muted">Casa</span>
            <select name="casaId" className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm">
              <option value="">Ambas (general)</option>
              {casas.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-muted">Autor</span>
            <input name="nombreAutor" required className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm" />
          </label>
        </div>
        <label className="block">
          <span className="text-sm text-muted">Texto</span>
          <textarea name="texto" required rows={2} className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm" />
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-muted">
            Valoración
            <select name="valoracion" defaultValue="5" className="rounded-lg border border-border bg-canvas px-2 py-1.5">
              {[5, 4, 3, 2, 1].map((v) => (
                <option key={v} value={v}>{v} ★</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="destacada" /> Destacada (aparece en la Home)
          </label>
          <button className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
            Añadir
          </button>
        </div>
      </form>

      {/* Listado */}
      <div className="space-y-3">
        {resenas.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="text-sm">
              <div className="flex items-center gap-2">
                <Rating valor={r.valoracion} />
                <span className="font-medium text-ink">{r.nombreAutor}</span>
                <span className="text-muted">
                  · {r.casa?.nombre ?? "General"} · {formatFecha(r.fecha)}
                </span>
              </div>
              <p className="mt-1 text-muted">“{r.texto}”</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <form action={accionToggleDestacada}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="destacada" value={r.destacada ? "false" : "true"} />
                <button className={`rounded-lg border px-3 py-1.5 text-xs ${r.destacada ? "border-sand bg-sand/15 text-ink" : "border-border text-muted hover:border-brand"}`}>
                  {r.destacada ? "★ Destacada" : "☆ Destacar"}
                </button>
              </form>
              <form action={accionEliminarResena}>
                <input type="hidden" name="id" value={r.id} />
                <button className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:border-error hover:text-error">
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
