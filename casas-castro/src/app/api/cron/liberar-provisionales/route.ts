import { NextResponse } from "next/server";
import { liberarProvisionalesCaducadas } from "@/lib/reservas/liberar";

// Endpoint que libera reservas provisionales caducadas.
// Pensado para llamarse periódicamente (Vercel Cron, cada hora).
// Se protege con CRON_SECRET vía cabecera Authorization: Bearer <secret>.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const liberadas = await liberarProvisionalesCaducadas();
  return NextResponse.json({ ok: true, liberadas });
}
