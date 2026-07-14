import Link from "next/link";
import { redirect } from "next/navigation";
import { requerirAuth, cerrarSesion } from "@/lib/auth";

const enlaces = [
  { href: "/admin", label: "Reservas" },
  { href: "/admin/casas", label: "Casas" },
  { href: "/admin/resenas", label: "Reseñas" },
];

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requerirAuth();

  async function salir() {
    "use server";
    await cerrarSesion();
    redirect("/admin/login");
  }

  return (
    <div className="container-page py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <nav className="flex gap-5 text-sm">
          {enlaces.map((e) => (
            <Link key={e.href} href={e.href} className="text-ink hover:text-brand">
              {e.label}
            </Link>
          ))}
        </nav>
        <form action={salir}>
          <button className="text-sm text-muted hover:text-error">
            Cerrar sesión
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
