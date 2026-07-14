import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { getReservaPorToken } from "@/lib/data/reservas";
import { rechazarReserva } from "@/lib/reservas/gestionar";
import { DetalleReserva } from "@/components/reservas/DetalleReserva";
import { Aviso } from "@/components/reservas/Aviso";

export const metadata: Metadata = { title: "Rechazar reserva" };

export default async function RechazarPage(
  props: PageProps<"/reserva/rechazar/[token]">,
) {
  const { token } = await props.params;
  const reserva = await getReservaPorToken(token);

  if (!reserva) {
    return <Aviso titulo="Solicitud no encontrada" tono="error" />;
  }

  async function rechazar(formData: FormData) {
    "use server";
    const motivo = String(formData.get("motivo") ?? "").trim();
    await rechazarReserva(token, motivo || undefined);
    revalidatePath(`/reserva/rechazar/${token}`);
  }

  if (reserva.estado === "rechazada") {
    return (
      <Aviso titulo="Solicitud rechazada" tono="warn">
        <p>Las fechas se han liberado y el cliente ha sido avisado por email.</p>
      </Aviso>
    );
  }

  if (reserva.estado !== "provisional") {
    return (
      <Aviso titulo="Esta solicitud ya no está pendiente" tono="warn">
        <p>Es posible que caducara o se confirmara. No se ha hecho ningún cambio.</p>
      </Aviso>
    );
  }

  return (
    <div className="container-page max-w-md py-16 text-center">
      <h1 className="text-2xl text-ink">Rechazar reserva</h1>
      <p className="mt-2 text-muted">Se liberarán las fechas y se avisará al cliente.</p>
      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <DetalleReserva
          nombreCasa={reserva.casa.nombre}
          nombreCliente={reserva.nombreCliente}
          emailCliente={reserva.emailCliente}
          telefonoCliente={reserva.telefonoCliente}
          numPersonas={reserva.numPersonas}
          fechaInicio={reserva.fechaInicio}
          fechaFin={reserva.fechaFin}
          mensajeCliente={reserva.mensajeCliente}
        />
        <form action={rechazar} className="mt-6 text-left">
          <label className="text-sm text-muted">
            Motivo (opcional, se incluye en el email al cliente)
            <textarea
              name="motivo"
              rows={2}
              className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </label>
          <button className="mt-3 w-full rounded-lg bg-error px-4 py-2.5 text-sm font-medium text-white hover:opacity-90">
            Rechazar solicitud
          </button>
        </form>
      </div>
    </div>
  );
}
