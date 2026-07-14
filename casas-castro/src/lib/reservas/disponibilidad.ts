// Comprobación de disponibilidad de un rango frente a las fechas ocupadas.

import { solapan } from "@/lib/reservas/fechas";
import type { RangoOcupado } from "@/lib/data/reservas";

/** True si el rango solicitado se solapa con alguna reserva que ocupa fechas. */
export function hayConflicto(
  inicio: Date,
  fin: Date,
  ocupados: RangoOcupado[],
): boolean {
  return ocupados.some((o) => solapan(inicio, fin, o.inicio, o.fin));
}
