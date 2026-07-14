// Confirmación y rechazo de solicitudes por parte del propietario.
// Se usa tanto desde los enlaces del email como (más adelante) desde el admin.

import { prisma } from "@/lib/prisma";
import { getReservaPorToken } from "@/lib/data/reservas";
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

export async function confirmarReserva(token: string): Promise<ResultadoGestion> {
  const reserva = await getReservaPorToken(token);
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

export async function rechazarReserva(
  token: string,
  motivo?: string,
): Promise<ResultadoGestion> {
  const reserva = await getReservaPorToken(token);
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
