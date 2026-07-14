// Confirmación y rechazo de solicitudes por parte del propietario.
// Se usa desde los enlaces del email (por token) y desde el admin (por id).

import { prisma } from "@/lib/prisma";
import { getReservaPorToken, getReservaPorId } from "@/lib/data/reservas";
import { enviarEmail } from "@/lib/email";
import {
  emailConfirmacionCliente,
  emailRechazoCliente,
  type DatosReservaEmail,
} from "@/lib/email/plantillas";

type ReservaConCasa = NonNullable<
  Awaited<ReturnType<typeof getReservaPorToken>>
>;

export type ResultadoGestion =
  | { ok: true; estado: "confirmada" | "rechazada"; nombreCasa: string }
  | { ok: false; error: string };

function datosEmail(r: ReservaConCasa): DatosReservaEmail {
  return {
    nombreCasa: r.casa.nombre,
    nombreCliente: r.nombreCliente,
    emailCliente: r.emailCliente,
    telefonoCliente: r.telefonoCliente,
    numPersonas: r.numPersonas,
    fechaInicio: r.fechaInicio,
    fechaFin: r.fechaFin,
    mensajeCliente: r.mensajeCliente,
    token: r.tokenConfirmacion,
  };
}

// --- Núcleo (opera sobre una reserva ya cargada) --------------------------

async function aplicarConfirmacion(
  reserva: ReservaConCasa | null,
): Promise<ResultadoGestion> {
  if (!reserva) return { ok: false, error: "Solicitud no encontrada." };
  if (reserva.estado === "confirmada") {
    return { ok: true, estado: "confirmada", nombreCasa: reserva.casa.nombre };
  }
  if (reserva.estado !== "provisional") {
    return {
      ok: false,
      error: "Esta solicitud ya no está pendiente (pudo caducar o rechazarse).",
    };
  }

  await prisma.reserva.update({
    where: { id: reserva.id },
    data: { estado: "confirmada", expiraEn: null },
  });

  try {
    await enviarEmail({
      to: reserva.emailCliente,
      ...emailConfirmacionCliente(datosEmail(reserva)),
    });
  } catch (e) {
    console.error("Error al enviar email de confirmación:", e);
  }

  return { ok: true, estado: "confirmada", nombreCasa: reserva.casa.nombre };
}

async function aplicarRechazo(
  reserva: ReservaConCasa | null,
  motivo?: string,
): Promise<ResultadoGestion> {
  if (!reserva) return { ok: false, error: "Solicitud no encontrada." };
  if (reserva.estado === "rechazada") {
    return { ok: true, estado: "rechazada", nombreCasa: reserva.casa.nombre };
  }
  if (reserva.estado !== "provisional") {
    return {
      ok: false,
      error: "Esta solicitud ya no está pendiente (pudo caducar o confirmarse).",
    };
  }

  await prisma.reserva.update({
    where: { id: reserva.id },
    data: { estado: "rechazada", expiraEn: null, motivoRechazo: motivo || null },
  });

  try {
    await enviarEmail({
      to: reserva.emailCliente,
      ...emailRechazoCliente(datosEmail(reserva), motivo),
    });
  } catch (e) {
    console.error("Error al enviar email de rechazo:", e);
  }

  return { ok: true, estado: "rechazada", nombreCasa: reserva.casa.nombre };
}

// --- Wrappers por token (emails) y por id (admin) -------------------------

export async function confirmarReserva(token: string) {
  return aplicarConfirmacion(await getReservaPorToken(token));
}

export async function rechazarReserva(token: string, motivo?: string) {
  return aplicarRechazo(await getReservaPorToken(token), motivo);
}

export async function confirmarReservaId(id: string) {
  return aplicarConfirmacion(await getReservaPorId(id));
}

export async function rechazarReservaId(id: string, motivo?: string) {
  return aplicarRechazo(await getReservaPorId(id), motivo);
}
