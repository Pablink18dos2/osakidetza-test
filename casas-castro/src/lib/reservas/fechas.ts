// Utilidades puras de fechas para el flujo de reservas.
// Sin dependencias de base de datos: fáciles de testear.

import { reglasReserva } from "@/content/site";

/** Número de noches entre dos fechas (fin exclusivo). */
export function noches(inicio: Date, fin: Date): number {
  const ms = fin.getTime() - inicio.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/**
 * Comprueba si dos rangos [inicioA, finA) y [inicioB, finB) se solapan.
 * El día de salida (fin) es exclusivo: una reserva que termina el día en
 * que empieza otra NO se considera solapamiento.
 */
export function solapan(
  inicioA: Date,
  finA: Date,
  inicioB: Date,
  finB: Date,
): boolean {
  return inicioA < finB && inicioB < finA;
}

/** Resultado de validar un rango solicitado. */
export type ValidacionRango =
  | { ok: true; noches: number }
  | { ok: false; motivo: string };

/**
 * Valida un rango de fechas solicitado según las reglas de negocio:
 * fin posterior a inicio y estancia mínima de noches.
 * (El solapamiento con otras reservas se comprueba aparte, con la BD.)
 */
export function validarRango(inicio: Date, fin: Date): ValidacionRango {
  if (fin <= inicio) {
    return { ok: false, motivo: "La fecha de salida debe ser posterior a la de entrada." };
  }
  const n = noches(inicio, fin);
  if (n < reglasReserva.minNoches) {
    return {
      ok: false,
      motivo: `La estancia mínima es de ${reglasReserva.minNoches} noches.`,
    };
  }
  return { ok: true, noches: n };
}

/** Fecha de expiración de una reserva provisional (ahora + ventana). */
export function calcularExpiracion(desde: Date = new Date()): Date {
  return new Date(
    desde.getTime() + reglasReserva.ventanaProvisionalHoras * 60 * 60 * 1000,
  );
}

/**
 * Convierte "YYYY-MM-DD" en Date a medianoche UTC.
 * Se usa UTC para tratar las fechas como "día natural" sin desfases de zona.
 */
export function parseFechaISO(s: string): Date {
  return new Date(`${s}T00:00:00.000Z`);
}

/** Formatea un Date como "YYYY-MM-DD" (UTC). */
export function formatFechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}
