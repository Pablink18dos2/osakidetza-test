"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requerirAuth } from "@/lib/auth";
import { getOcupacion } from "@/lib/data/reservas";
import { hayConflicto } from "@/lib/reservas/disponibilidad";
import { parseFechaISO } from "@/lib/reservas/fechas";
import { confirmarReservaId, rechazarReservaId } from "@/lib/reservas/gestionar";
import type { Servicio } from "@/types";

function revalidarAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/casas");
  revalidatePath("/admin/resenas");
}

// --- Reservas -------------------------------------------------------------

export async function accionConfirmar(formData: FormData) {
  await requerirAuth();
  await confirmarReservaId(String(formData.get("id")));
  revalidarAdmin();
}

export async function accionRechazar(formData: FormData) {
  await requerirAuth();
  const motivo = String(formData.get("motivo") ?? "").trim();
  await rechazarReservaId(String(formData.get("id")), motivo || undefined);
  revalidarAdmin();
}

export async function accionEliminarReserva(formData: FormData) {
  await requerirAuth();
  await prisma.reserva.delete({ where: { id: String(formData.get("id")) } });
  revalidarAdmin();
}

/** Bloqueo manual de fechas (p. ej. el propietario usa la casa). */
export async function accionBloquear(formData: FormData) {
  await requerirAuth();
  const casaId = String(formData.get("casaId"));
  const inicio = parseFechaISO(String(formData.get("fechaInicio")));
  const fin = parseFechaISO(String(formData.get("fechaFin")));
  if (!(fin > inicio)) return;

  const ocupados = await getOcupacion(casaId);
  if (hayConflicto(inicio, fin, ocupados)) return;

  await prisma.reserva.create({
    data: {
      casaId,
      nombreCliente: "Bloqueo manual",
      emailCliente: "",
      telefonoCliente: "",
      numPersonas: 0,
      fechaInicio: inicio,
      fechaFin: fin,
      estado: "bloqueo",
      tokenConfirmacion: randomUUID(),
    },
  });
  revalidarAdmin();
}

// --- Casas ----------------------------------------------------------------

export async function accionGuardarCasa(formData: FormData) {
  await requerirAuth();
  const id = String(formData.get("id"));
  const alta = String(formData.get("precioTemporadaAlta") ?? "").trim();

  const fotos = String(formData.get("fotos") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  await prisma.casa.update({
    where: { id },
    data: {
      nombre: String(formData.get("nombre")),
      descripcionCorta: String(formData.get("descripcionCorta")),
      descripcionLarga: String(formData.get("descripcionLarga")),
      capacidad: Number(formData.get("capacidad")),
      habitaciones: Number(formData.get("habitaciones")),
      banos: Number(formData.get("banos")),
      precioTemporadaBaja: Number(formData.get("precioTemporadaBaja")),
      precioTemporadaAlta: alta ? Number(alta) : null,
      servicios: formData.getAll("servicios").map(String) as Servicio[],
      fotos,
    },
  });
  revalidatePath("/admin/casas");
  revalidatePath("/");
}

// --- Reseñas --------------------------------------------------------------

export async function accionCrearResena(formData: FormData) {
  await requerirAuth();
  const casaId = String(formData.get("casaId") ?? "");
  await prisma.resena.create({
    data: {
      casaId: casaId || null,
      nombreAutor: String(formData.get("nombreAutor")),
      texto: String(formData.get("texto")),
      valoracion: Number(formData.get("valoracion")),
      fecha: new Date(),
      destacada: formData.get("destacada") === "on",
    },
  });
  revalidatePath("/admin/resenas");
  revalidatePath("/");
}

export async function accionEliminarResena(formData: FormData) {
  await requerirAuth();
  await prisma.resena.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/resenas");
  revalidatePath("/");
}

export async function accionToggleDestacada(formData: FormData) {
  await requerirAuth();
  await prisma.resena.update({
    where: { id: String(formData.get("id")) },
    data: { destacada: formData.get("destacada") === "true" },
  });
  revalidatePath("/admin/resenas");
  revalidatePath("/");
}
