import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Ponte en contacto para consultar disponibilidad o resolver dudas.",
};

export default function ContactoPage() {
  const { email, telefono, whatsapp } = site.contacto;
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl text-ink">Contacto</h1>
      <p className="mt-3 max-w-xl text-muted">
        ¿Prefieres preguntar antes de reservar? Escríbenos o llámanos y te
        respondemos lo antes posible.
      </p>

      <ul className="mt-8 space-y-3 text-ink">
        <li>
          <span className="text-muted">Email: </span>
          <a href={`mailto:${email}`} className="text-brand hover:text-brand-dark">
            {email}
          </a>
        </li>
        <li>
          <span className="text-muted">Teléfono: </span>
          <a href={`tel:${telefono}`} className="text-brand hover:text-brand-dark">
            {telefono}
          </a>
        </li>
        <li>
          <span className="text-muted">WhatsApp: </span>
          <span className="text-ink">{whatsapp}</span>
        </li>
      </ul>
    </div>
  );
}
