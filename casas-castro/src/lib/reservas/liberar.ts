// Libera las reservas provisionales cuya ventana de 48h ha expirado:
// pasan de "provisional" a "expirada" y sus fechas vuelven a estar libres.

import { prisma } from "@/lib/prisma";

export async function liberarProvisionalesCaducadas(
  ahora: Date = new Date(),
): Promise<number> {
  const { count } = await prisma.reserva.updateMany({
    where: {
      estado: "provisional",
      expiraEn: { lte: ahora },
    },
    data: { estado: "expirada" },
  });
  return count;
}
