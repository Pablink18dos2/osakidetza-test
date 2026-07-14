import type { EstadoReserva } from "@/types";

const estilos: Record<EstadoReserva, string> = {
  provisional: "bg-provisional/15 text-warn",
  confirmada: "bg-ok/15 text-ok",
  rechazada: "bg-error/15 text-error",
  expirada: "bg-border text-muted",
  bloqueo: "bg-ink/10 text-ink",
};

export function EstadoBadge({ estado }: { estado: EstadoReserva }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${estilos[estado]}`}
    >
      {estado}
    </span>
  );
}
