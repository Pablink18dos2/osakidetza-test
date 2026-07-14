// Servicio de envío de emails.
//
// Abstracción sobre el proveedor concreto (Resend). Si no hay RESEND_API_KEY
// configurada, los emails se muestran por consola en lugar de enviarse, para
// poder desarrollar el flujo de reservas sin credenciales.

import { Resend } from "resend";

export interface Email {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? "Casas Castro <onboarding@resend.dev>";

const resend = apiKey ? new Resend(apiKey) : null;

export async function enviarEmail(email: Email): Promise<void> {
  if (!resend) {
    // Modo desarrollo: sin proveedor configurado, se registra por consola.
    console.info("\n📧 [EMAIL SIMULADO]");
    console.info("  Para:", email.to);
    console.info("  Asunto:", email.subject);
    console.info("  (define RESEND_API_KEY en .env para enviarlos de verdad)\n");
    return;
  }

  const { error } = await resend.emails.send({
    from,
    to: email.to,
    subject: email.subject,
    html: email.html,
    replyTo: email.replyTo,
  });

  if (error) {
    throw new Error(`Error al enviar email: ${error.message}`);
  }
}
