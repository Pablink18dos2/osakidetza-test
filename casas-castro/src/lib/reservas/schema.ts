// Validación del formulario de solicitud de reserva (cliente y servidor).

import { z } from "zod";

// Fecha en formato YYYY-MM-DD (la que envía <input type="date">).
const fechaISO = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida");

export const solicitudReservaSchema = z.object({
  casaId: z.string().min(1),
  nombre: z.string().trim().min(2, "Indica tu nombre").max(120),
  email: z.string().trim().email("Email no válido"),
  telefono: z.string().trim().min(6, "Teléfono no válido").max(30),
  numPersonas: z.coerce.number().int().min(1, "Al menos 1 persona").max(30),
  fechaInicio: fechaISO,
  fechaFin: fechaISO,
  mensaje: z.string().trim().max(1000).optional().or(z.literal("")),
  aceptaPrivacidad: z.coerce.boolean().refine((v) => v === true, {
    message: "Debes aceptar la política de privacidad",
  }),
});

export type SolicitudReserva = z.infer<typeof solicitudReservaSchema>;
