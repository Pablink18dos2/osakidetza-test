import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { getReservaPorToken } from "@/lib/data/reservas";
import { confirmarReserva } from "@/lib/reservas/gestionar";
import { DetalleReserva } from "@/components/reservas/DetalleReserva";
import { Aviso } from "@/components/reservas/Aviso";

export const metadata: Metadata = { title: "Confirmar reserva" };

export default async function ConfirmarPage(
  props: PageProps<"/reserva/confirmar/[token]">,
) {
  const { token } = await props.params;
  const reserva = await getReservaPorToken(token);

  if (!reserva) {
    return <Aviso titulo="Solicitud no encontrada" tono="error" />;
  }

  // Acción real: sólo se ejecuta al pulsar el botón (no en la carga del GET).
  async function confirmar() {
    "use server";
    await confirmarReserva(token);
    revalidatePath(`/reserva/confirmar/${token}`);
  }

  if (reserva.estado === "confirmada") {
    return (
      <Aviso titulo="Reserva confirmada" tono="ok">
        <p>Las fechas quedan bloqueadas y el cliente ha sido avisado por email.</p>
      </Aviso>
    );
  }

  if (reserva.estado !== "provisional") {
    return (
      <Aviso titulo="Esta solicitud ya no está pendiente" tono="warn">
        <p>Es posible que caducara o se rechazara. No se ha hecho ningún cambio.</p>
      </Aviso>
    );
  }

  return (
    <div className="container-page max-w-md py-16 text-center">
      <h1 className="text-2xl text-ink">Confirmar reserva</h1>
      <p className="mt-2 text-muted">Revisa los datos y confirma la solicitud:</p>
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
        <form action={confirmar} className="mt-6">
          <button className="w-full rounded-lg bg-ok px-4 py-2.5 text-sm font-medium text-white hover:opacity-90">
            Confirmar reserva
          </button>
        </form>
        <a
          href={`/reserva/rechazar/${token}`}
          className="mt-3 inline-block text-sm text-muted hover:text-error"
        >
          Rechazar en su lugar
        </a>
      </div>
    </div>
  );
}
