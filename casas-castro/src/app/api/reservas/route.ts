import { NextResponse } from "next/server";
import { solicitudReservaSchema } from "@/lib/reservas/schema";
import { crearSolicitudReserva } from "@/lib/reservas/crear";

// Crea una solicitud de reserva provisional (48h) y envía los emails.
export async function POST(request: Request) {
  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo no válido." }, { status: 400 });
  }

  const parsed = solicitudReservaSchema.safeParse(cuerpo);
  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message ?? "Datos no válidos.";
    return NextResponse.json({ error }, { status: 400 });
  }

  const resultado = await crearSolicitudReserva(parsed.data);
  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: 409 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
