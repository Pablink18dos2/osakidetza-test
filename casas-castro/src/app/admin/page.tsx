import type { Metadata } from "next";

export const metadata: Metadata = { title: "Panel de administración" };

// Placeholder del panel de administración.
// Fase posterior: login del propietario + gestión de reservas, precios,
// fotos, disponibilidad y reseñas.
export default function AdminPage() {
  return (
    <div className="container-page max-w-xl py-16 text-center">
      <h1 className="text-2xl text-ink">Panel de administración</h1>
      <p className="mt-3 text-muted">
        Zona protegida para el propietario. Se implementará en la fase de
        administración: login, gestión de reservas, precios, fotos y reseñas.
      </p>
      <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-sm text-muted">
        Pendiente de implementar
      </div>
    </div>
  );
}
