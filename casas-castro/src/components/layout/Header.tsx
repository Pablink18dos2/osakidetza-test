import Link from "next/link";
import { navPrincipal, site } from "@/content/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/85 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold text-ink">
          {site.nombre}
        </Link>
        <ul className="flex items-center gap-6 text-sm text-muted">
          {navPrincipal.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="transition-colors hover:text-brand"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
