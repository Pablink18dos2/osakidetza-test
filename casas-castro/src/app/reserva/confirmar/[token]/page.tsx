import type { Metadata } from "next";

export const metadata: Metadata = { title: "Confirmar reserva" };

// Placeholder. Fase de reservas: al abrir este enlace (desde el email del
// propietario), se validará el token, se marcará la reserva como "confirmada",
// se bloquearán las fechas y se enviará el email de confirmación al cliente.
export default async function ConfirmarPage(
  props: PageProps<"/reserva/confirmar/[token]">,
) {
  const { token } = await props.params;
  return (
    <div className="container-page max-w-xl py-16 text-center">
      <h1 className="text-2xl text-ink">Confirmar reserva</h1>
      <p className="mt-3 text-muted">
        Aquí se confirmará la solicitud asociada al token.
      </p>
      <p className="mt-2 break-all text-xs text-muted">token: {token}</p>
      <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-sm text-muted">
        Pendiente de implementar (fase de reservas)
      </div>
    </div>
  );
}
