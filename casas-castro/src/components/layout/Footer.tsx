import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.nombre}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <Link href="/contacto" className="hover:text-brand">
              Contacto
            </Link>
          </li>
          <li>
            <Link href="/aviso-legal" className="hover:text-brand">
              Aviso legal
            </Link>
          </li>
          <li>
            <Link href="/privacidad" className="hover:text-brand">
              Privacidad
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
