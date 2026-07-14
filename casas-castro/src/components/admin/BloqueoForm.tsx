import { accionBloquear } from "@/app/admin/(panel)/actions";

export function BloqueoForm({
  casas,
}: {
  casas: { id: string; nombre: string }[];
}) {
  return (
    <form action={accionBloquear} className="mt-4 flex flex-wrap items-end gap-3 text-sm">
      <label className="flex flex-col gap-1">
        <span className="text-muted">Casa</span>
        <select name="casaId" required className="rounded-lg border border-border bg-canvas px-3 py-2">
          {casas.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted">Desde</span>
        <input type="date" name="fechaInicio" required className="rounded-lg border border-border bg-canvas px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-muted">Hasta</span>
        <input type="date" name="fechaFin" required className="rounded-lg border border-border bg-canvas px-3 py-2" />
      </label>
      <button className="rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark">
        Bloquear
      </button>
    </form>
  );
}
