import { formatFecha } from "@/lib/format";
import { noches } from "@/lib/reservas/fechas";

interface Props {
  nombreCasa: string;
  nombreCliente: string;
  emailCliente: string;
  telefonoCliente: string;
  numPersonas: number;
  fechaInicio: Date;
  fechaFin: Date;
  mensajeCliente?: string | null;
}

export function DetalleReserva(r: Props) {
  return (
    <dl className="mx-auto max-w-sm space-y-1 text-left text-sm text-ink">
      <Fila k="Casa" v={r.nombreCasa} />
      <Fila k="Entrada" v={formatFecha(r.fechaInicio)} />
      <Fila k="Salida" v={formatFecha(r.fechaFin)} />
      <Fila k="Noches" v={String(noches(r.fechaInicio, r.fechaFin))} />
      <Fila k="Personas" v={String(r.numPersonas)} />
      <Fila k="Cliente" v={r.nombreCliente} />
      <Fila k="Contacto" v={`${r.emailCliente} · ${r.telefonoCliente}`} />
      {r.mensajeCliente && <Fila k="Mensaje" v={r.mensajeCliente} />}
    </dl>
  );
}

function Fila({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  );
}
