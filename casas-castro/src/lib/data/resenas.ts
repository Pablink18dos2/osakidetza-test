// Acceso a datos de reseñas.

import { prisma } from "@/lib/prisma";

export interface ResenaDTO {
  id: string;
  casaId: string | null;
  nombreAutor: string;
  texto: string;
  valoracion: number;
  fecha: Date;
  destacada: boolean;
}

/** Reseñas destacadas para la Home. */
export async function getResenasDestacadas(limite = 3): Promise<ResenaDTO[]> {
  return prisma.resena.findMany({
    where: { destacada: true },
    orderBy: { fecha: "desc" },
    take: limite,
  });
}

/** Reseñas de una casa concreta (incluye las generales con casaId null). */
export async function getResenasDeCasa(casaId: string): Promise<ResenaDTO[]> {
  return prisma.resena.findMany({
    where: { OR: [{ casaId }, { casaId: null }] },
    orderBy: { fecha: "desc" },
  });
}
