// Acceso a datos de casas. Encapsula Prisma y normaliza los campos Json
// (servicios, fotos) a arrays tipados para el resto de la app.

import { prisma } from "@/lib/prisma";
import type { Servicio } from "@/types";

export interface CasaDTO {
  id: string;
  nombre: string;
  slug: string;
  direccion: string;
  lat: number | null;
  lng: number | null;
  descripcionCorta: string;
  descripcionLarga: string;
  capacidad: number;
  habitaciones: number;
  banos: number;
  servicios: Servicio[];
  fotos: string[];
  precioTemporadaBaja: number;
  precioTemporadaAlta: number | null;
}

// Prisma devuelve los campos Json ya parseados; solo hace falta tiparlos.
type CasaRow = {
  id: string;
  nombre: string;
  slug: string;
  direccion: string;
  lat: number | null;
  lng: number | null;
  descripcionCorta: string;
  descripcionLarga: string;
  capacidad: number;
  habitaciones: number;
  banos: number;
  servicios: unknown;
  fotos: unknown;
  precioTemporadaBaja: number;
  precioTemporadaAlta: number | null;
};

function toDTO(row: CasaRow): CasaDTO {
  return {
    ...row,
    servicios: (row.servicios as Servicio[]) ?? [],
    fotos: (row.fotos as string[]) ?? [],
  };
}

export async function getCasas(): Promise<CasaDTO[]> {
  const casas = await prisma.casa.findMany({ orderBy: { orden: "asc" } });
  return casas.map(toDTO);
}

export async function getCasaBySlug(slug: string): Promise<CasaDTO | null> {
  const casa = await prisma.casa.findUnique({ where: { slug } });
  return casa ? toDTO(casa) : null;
}

export async function getSlugs(): Promise<string[]> {
  const casas = await prisma.casa.findMany({ select: { slug: true } });
  return casas.map((c) => c.slug);
}
