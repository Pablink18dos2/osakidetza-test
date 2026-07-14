import { NextResponse } from "next/server";
import { getOcupacion } from "@/lib/data/reservas";
import { formatFechaISO } from "@/lib/reservas/fechas";

// Devuelve los rangos ocupados de una casa para pintar el calendario.
// (Libera de paso las provisionales caducadas.)
export async function GET(request: Request) {
  const casaId = new URL(request.url).searchParams.get("casaId");
  if (!casaId) {
    return NextResponse.json({ error: "Falta casaId." }, { status: 400 });
  }

  const ocupados = await getOcupacion(casaId);
  return NextResponse.json({
    ocupados: ocupados.map((o) => ({
      inicio: formatFechaISO(o.inicio),
      fin: formatFechaISO(o.fin),
      estado: o.estado,
    })),
  });
}
