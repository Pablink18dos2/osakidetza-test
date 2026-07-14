import { NextResponse } from "next/server";

// Stub del endpoint de creación de solicitudes de reserva.
//
// Fase de reservas — aquí se implementará:
//  1. Validar el cuerpo con Zod (nombre, email, teléfono, personas, fechas,
//     mensaje, aceptación de privacidad).
//  2. Validar el rango con validarRango() (mínimo de noches).
//  3. Comprobar solapamiento con reservas ocupadas (provisional/confirmada/bloqueo).
//  4. Crear la reserva provisional con token y expiraEn (ahora + 48h).
//  5. Enviar email al propietario (confirmar/rechazar) y al cliente (recibido).
export async function POST() {
  return NextResponse.json(
    { error: "No implementado todavía (fase de reservas)." },
    { status: 501 },
  );
}
