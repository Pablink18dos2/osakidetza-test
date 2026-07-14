import type { Metadata } from "next";

export const metadata: Metadata = { title: "Rechazar reserva" };

// Placeholder. Fase de reservas: validará el token, marcará la reserva como
// "rechazada", liberará las fechas y enviará el email correspondiente al cliente.
export default async function RechazarPage(
  props: PageProps<"/reserva/rechazar/[token]">,
) {
  const { token } = await props.params;
  return (
    <div className="container-page max-w-xl py-16 text-center">
      <h1 className="text-2xl text-ink">Rechazar reserva</h1>
      <p className="mt-3 text-muted">
        Aquí se rechazará la solicitud asociada al token.
      </p>
      <p className="mt-2 break-all text-xs text-muted">token: {token}</p>
      <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-sm text-muted">
        Pendiente de implementar (fase de reservas)
      </div>
    </div>
  );
}
