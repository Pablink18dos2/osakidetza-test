// Orquestación de la creación de una solicitud de reserva:
// validación de reglas, comprobación de disponibilidad, creación provisional
// y envío de los emails al propietario y al cliente.

import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getOcupacion } from "@/lib/data/reservas";
import { validarRango, calcularExpiracion, parseFechaISO } from "@/lib/reservas/fechas";
import { hayConflicto } from "@/lib/reservas/disponibilidad";
import type { SolicitudReserva } from "@/lib/reservas/schema";
import { enviarEmail } from "@/lib/email";
import {
  emailSolicitudPropietario,
  emailSolicitudCliente,
  type DatosReservaEmail,
} from "@/lib/email/plantillas";

export type ResultadoSolicitud =
  | { ok: true; reservaId: string }
  | { ok: false; error: string };

export async function crearSolicitudReserva(
  datos: SolicitudReserva,
): Promise<ResultadoSolicitud> {
  const casa = await prisma.casa.findUnique({ where: { id: datos.casaId } });
  if (!casa) return { ok: false, error: "La casa indicada no existe." };

  const inicio = parseFechaISO(datos.fechaInicio);
  const fin = parseFechaISO(datos.fechaFin);

  // Reglas de negocio (mínimo de noches, orden de fechas).
  const rango = validarRango(inicio, fin);
  if (!rango.ok) return { ok: false, error: rango.motivo };

  if (datos.numPersonas > casa.capacidad) {
    return {
      ok: false,
      error: `La capacidad máxima de la casa es de ${casa.capacidad} personas.`,
    };
  }

  // Disponibilidad (evita solapamientos con provisional/confirmada/bloqueo).
  const ocupados = await getOcupacion(casa.id);
  if (hayConflicto(inicio, fin, ocupados)) {
    return {
      ok: false,
      error: "Alguna de las fechas seleccionadas ya no está disponible.",
    };
  }

  const token = randomUUID();
  const reserva = await prisma.reserva.create({
    data: {
      casaId: casa.id,
      nombreCliente: datos.nombre,
      emailCliente: datos.email,
      telefonoCliente: datos.telefono,
      numPersonas: datos.numPersonas,
      fechaInicio: inicio,
      fechaFin: fin,
      estado: "provisional",
      mensajeCliente: datos.mensaje || null,
      tokenConfirmacion: token,
      expiraEn: calcularExpiracion(),
    },
  });

  // Emails (no bloquean el resultado si falla el proveedor).
  const datosEmail: DatosReservaEmail = {
    nombreCasa: casa.nombre,
    nombreCliente: datos.nombre,
    emailCliente: datos.email,
    telefonoCliente: datos.telefono,
    numPersonas: datos.numPersonas,
    fechaInicio: inicio,
    fechaFin: fin,
    mensajeCliente: datos.mensaje || null,
    token,
  };

  const propietario = process.env.EMAIL_PROPIETARIO;
  try {
    await Promise.all([
      propietario
        ? enviarEmail({
            to: propietario,
            replyTo: datos.email,
            ...emailSolicitudPropietario(datosEmail),
          })
        : Promise.resolve(),
      enviarEmail({
        to: datos.email,
        ...emailSolicitudCliente(datosEmail),
      }),
    ]);
  } catch (e) {
    console.error("Error al enviar emails de solicitud:", e);
  }

  return { ok: true, reservaId: reserva.id };
}
