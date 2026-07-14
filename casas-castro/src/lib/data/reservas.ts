// Acceso a datos de reservas.

import { prisma } from "@/lib/prisma";
import { ESTADOS_OCUPADOS, type EstadoReserva } from "@/types";
import { liberarProvisionalesCaducadas } from "@/lib/reservas/liberar";

export interface RangoOcupado {
  inicio: Date;
  fin: Date;
  estado: EstadoReserva;
}

/**
 * Rangos que ocupan el calendario de una casa (provisional / confirmada /
 * bloqueo). Antes de consultar, libera "al vuelo" las provisionales caducadas
 * para que no aparezcan como ocupadas aunque el cron aún no haya pasado.
 */
export async function getOcupacion(casaId: string): Promise<RangoOcupado[]> {
  await liberarProvisionalesCaducadas();

  const reservas = await prisma.reserva.findMany({
    where: { casaId, estado: { in: ESTADOS_OCUPADOS } },
    select: { fechaInicio: true, fechaFin: true, estado: true },
    orderBy: { fechaInicio: "asc" },
  });

  return reservas.map((r) => ({
    inicio: r.fechaInicio,
    fin: r.fechaFin,
    estado: r.estado as EstadoReserva,
  }));
}

/** Busca una reserva por su token de confirmación (para los enlaces del email). */
export function getReservaPorToken(token: string) {
  return prisma.reserva.findUnique({
    where: { tokenConfirmacion: token },
    include: { casa: true },
  });
}

/** Busca una reserva por su id (para el panel de administración). */
export function getReservaPorId(id: string) {
  return prisma.reserva.findUnique({
    where: { id },
    include: { casa: true },
  });
}

/** Lista de reservas para el admin, con filtros opcionales por casa y estado. */
export function listarReservas(filtros: {
  casaId?: string;
  estado?: EstadoReserva;
}) {
  return prisma.reserva.findMany({
    where: {
      casaId: filtros.casaId || undefined,
      estado: filtros.estado || undefined,
    },
    include: { casa: true },
    orderBy: [{ estado: "asc" }, { fechaInicio: "asc" }],
  });
}
