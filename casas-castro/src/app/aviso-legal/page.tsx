import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Aviso legal" };

export default function AvisoLegalPage() {
  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="text-3xl text-ink">Aviso legal</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          {/* TODO: completar con los datos reales del titular antes de publicar. */}
          Titular del sitio: <em>[nombre / razón social]</em>. Contacto:{" "}
          {site.contacto.email}.
        </p>
        <p>
          Este sitio web tiene como finalidad mostrar información de las
          viviendas de alquiler y gestionar solicitudes de reserva. El uso del
          sitio implica la aceptación de las presentes condiciones.
        </p>
        <p className="text-warn">
          Texto de ejemplo. Debe revisarse y completarse con asesoramiento
          adecuado antes de la publicación.
        </p>
      </div>
    </div>
  );
}
