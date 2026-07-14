// Plantillas de email para el flujo de reservas.
// Cada función devuelve { subject, html } listo para enviarEmail().

import { formatFecha } from "@/lib/format";
import { noches } from "@/lib/reservas/fechas";
import { site } from "@/content/site";

export interface DatosReservaEmail {
  nombreCasa: string;
  nombreCliente: string;
  emailCliente: string;
  telefonoCliente: string;
  numPersonas: number;
  fechaInicio: Date;
  fechaFin: Date;
  mensajeCliente?: string | null;
  token: string;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function layout(titulo: string, contenido: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1f2a30">
    <h1 style="font-size:20px;color:#2f5462">${titulo}</h1>
    ${contenido}
    <hr style="border:none;border-top:1px solid #e7e4dd;margin:24px 0" />
    <p style="font-size:12px;color:#5c6a72">${site.nombre}</p>
  </div>`;
}

function bloqueFechas(d: DatosReservaEmail): string {
  const n = noches(d.fechaInicio, d.fechaFin);
  return `
    <p style="margin:4px 0"><strong>Casa:</strong> ${d.nombreCasa}</p>
    <p style="margin:4px 0"><strong>Entrada:</strong> ${formatFecha(d.fechaInicio)}</p>
    <p style="margin:4px 0"><strong>Salida:</strong> ${formatFecha(d.fechaFin)}</p>
    <p style="margin:4px 0"><strong>Noches:</strong> ${n}</p>
    <p style="margin:4px 0"><strong>Personas:</strong> ${d.numPersonas}</p>`;
}

function boton(href: string, texto: string, color: string): string {
  return `<a href="${href}" style="display:inline-block;padding:10px 18px;margin:4px 8px 4px 0;background:${color};color:#fff;text-decoration:none;border-radius:8px;font-size:14px">${texto}</a>`;
}

/** Email al propietario: nueva solicitud con botones confirmar / rechazar. */
export function emailSolicitudPropietario(d: DatosReservaEmail) {
  const confirmar = `${siteUrl}/reserva/confirmar/${d.token}`;
  const rechazar = `${siteUrl}/reserva/rechazar/${d.token}`;
  return {
    subject: `Nueva solicitud de reserva — ${d.nombreCasa}`,
    html: layout(
      "Nueva solicitud de reserva",
      `${bloqueFechas(d)}
       <p style="margin:12px 0 4px"><strong>Cliente:</strong> ${d.nombreCliente}</p>
       <p style="margin:4px 0">${d.emailCliente} · ${d.telefonoCliente}</p>
       ${d.mensajeCliente ? `<p style="margin:12px 0;padding:12px;background:#f4f2ec;border-radius:8px">${d.mensajeCliente}</p>` : ""}
       <div style="margin-top:20px">
         ${boton(confirmar, "Confirmar reserva", "#3f8a5b")}
         ${boton(rechazar, "Rechazar", "#b04a45")}
       </div>
       <p style="font-size:13px;color:#5c6a72;margin-top:16px">
         Si no respondes en 48 horas, la solicitud caducará y las fechas volverán
         a estar disponibles automáticamente.
       </p>`,
    ),
  };
}

/** Email al cliente: solicitud recibida, pendiente de confirmación. */
export function emailSolicitudCliente(d: DatosReservaEmail) {
  return {
    subject: `Hemos recibido tu solicitud — ${d.nombreCasa}`,
    html: layout(
      "Solicitud recibida",
      `<p>Hola ${d.nombreCliente}, hemos recibido tu solicitud de reserva:</p>
       ${bloqueFechas(d)}
       <p style="margin-top:16px">
         Tu solicitud queda <strong>reservada provisionalmente durante 48 horas</strong>
         mientras el propietario la confirma. Todavía no es una reserva definitiva.
         Te avisaremos por email en cuanto haya respuesta.
       </p>
       <p style="font-size:13px;color:#5c6a72">
         ¿Dudas? Escríbenos a ${site.contacto.email}.
       </p>`,
    ),
  };
}

/** Email al cliente: reserva confirmada. */
export function emailConfirmacionCliente(d: DatosReservaEmail) {
  return {
    subject: `¡Reserva confirmada! — ${d.nombreCasa}`,
    html: layout(
      "Tu reserva está confirmada",
      `<p>Hola ${d.nombreCliente}, tu reserva ha sido confirmada:</p>
       ${bloqueFechas(d)}
       <p style="margin-top:16px">
         El propietario se pondrá en contacto contigo (o puedes escribirle) para
         coordinar el pago y la llegada.
       </p>
       <p style="margin:4px 0"><strong>Contacto:</strong> ${site.contacto.email} · ${site.contacto.telefono}</p>`,
    ),
  };
}

/** Email al cliente: solicitud rechazada o caducada. */
export function emailRechazoCliente(
  d: DatosReservaEmail,
  motivo?: string | null,
) {
  return {
    subject: `Sobre tu solicitud — ${d.nombreCasa}`,
    html: layout(
      "Esas fechas ya no están disponibles",
      `<p>Hola ${d.nombreCliente}, lamentablemente las fechas solicitadas para
       ${d.nombreCasa} no están disponibles.</p>
       ${motivo ? `<p style="margin:12px 0;padding:12px;background:#f4f2ec;border-radius:8px">${motivo}</p>` : ""}
       <p style="margin-top:12px">
         Puedes volver a intentarlo con otras fechas cuando quieras.
       </p>`,
    ),
  };
}
