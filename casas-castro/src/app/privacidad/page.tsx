import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Política de privacidad" };

export default function PrivacidadPage() {
  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="text-3xl text-ink">Política de privacidad</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Al solicitar una reserva se recogen los siguientes datos personales:
          nombre, email y teléfono. Se utilizan únicamente para gestionar y
          confirmar la reserva, y para ponerse en contacto contigo en relación
          con la misma.
        </p>
        <p>
          No se ceden datos a terceros salvo lo imprescindible para el
          funcionamiento del servicio (por ejemplo, el proveedor de envío de
          emails). Puedes ejercer tus derechos de acceso, rectificación y
          supresión escribiendo a {site.contacto.email}.
        </p>
        <p className="text-warn">
          Texto de ejemplo orientativo (RGPD básico). Debe revisarse y
          completarse antes de la publicación.
        </p>
      </div>
    </div>
  );
}
