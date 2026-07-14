import type { Metadata } from "next";
import { listarReservas } from "@/lib/data/reservas";
import { getCasas } from "@/lib/data/casas";
import { formatFecha } from "@/lib/format";
import { noches } from "@/lib/reservas/fechas";
import { ESTADOS_RESERVA, type EstadoReserva } from "@/types";
import { EstadoBadge } from "@/components/admin/EstadoBadge";
import { BloqueoForm } from "@/components/admin/BloqueoForm";
import {
  accionConfirmar,
  accionRechazar,
  accionEliminarReserva,
} from "./actions";

export const metadata: Metadata = { title: "Reservas — Administración" };

export default async function AdminReservasPage(
  props: PageProps<"/admin">,
) {
  const sp = await props.searchParams;
  const casaId = typeof sp.casa === "string" ? sp.casa : undefined;
  const estado =
    typeof sp.estado === "string" &&
    ESTADOS_RESERVA.includes(sp.estado as EstadoReserva)
      ? (sp.estado as EstadoReserva)
      : undefined;

  const [reservas, casas] = await Promise.all([
    listarReservas({ casaId, estado }),
    getCasas(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl text-ink">Reservas</h1>
        <p className="mt-1 text-sm text-muted">
          {reservas.length} resultado{reservas.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* Filtros */}
      <form className="flex flex-wrap items-end gap-3 text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-muted">Casa</span>
          <select name="casa" defaultValue={casaId ?? ""} className="rounded-lg border border-border bg-canvas px-3 py-2">
            <option value="">Todas</option>
            {casas.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-muted">Estado</span>
          <select name="estado" defaultValue={estado ?? ""} className="rounded-lg border border-border bg-canvas px-3 py-2">
            <option value="">Todos</option>
            {ESTADOS_RESERVA.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </label>
        <button className="rounded-lg border border-border px-4 py-2 hover:border-brand">
          Filtrar
        </button>
      </form>

      {/* Listado */}
      <div className="space-y-3">
        {reservas.length === 0 && (
          <p className="text-sm text-muted">No hay reservas con estos filtros.</p>
        )}
        {reservas.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-ink">{r.casa.nombre}</span>
                <EstadoBadge estado={r.estado as EstadoReserva} />
              </div>
              <p className="mt-1 text-muted">
                {formatFecha(r.fechaInicio)} → {formatFecha(r.fechaFin)} ·{" "}
                {noches(r.fechaInicio, r.fechaFin)} noches
              </p>
              {r.estado !== "bloqueo" && (
                <p className="text-muted">
                  {r.nombreCliente} · {r.emailCliente} · {r.telefonoCliente} ·{" "}
                  {r.numPersonas} pers.
                </p>
              )}
              {r.mensajeCliente && (
                <p className="mt-1 text-muted italic">“{r.mensajeCliente}”</p>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              {r.estado === "provisional" && (
                <>
                  <form action={accionConfirmar}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-lg bg-ok px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">
                      Confirmar
                    </button>
                  </form>
                  <form action={accionRechazar}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-lg bg-error px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">
                      Rechazar
                    </button>
                  </form>
                </>
              )}
              <form action={accionEliminarReserva}>
                <input type="hidden" name="id" value={r.id} />
                <button className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:border-error hover:text-error">
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Bloqueo manual */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-lg text-ink">Bloquear fechas manualmente</h2>
        <p className="mt-1 text-sm text-muted">
          Para cuando uses la casa tú mismo o no quieras alquilarla en esas fechas.
        </p>
        <BloqueoForm casas={casas.map((c) => ({ id: c.id, nombre: c.nombre }))} />
      </div>
    </div>
  );
}
