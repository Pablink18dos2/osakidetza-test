// Datos de ejemplo para desarrollo.
// Sustituir por los datos reales de las casas antes de publicar.
//
// Ejecutar con:  npm run db:seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpieza previa (idempotente en desarrollo).
  await prisma.reserva.deleteMany();
  await prisma.resena.deleteMany();
  await prisma.casa.deleteMany();

  const casa1 = await prisma.casa.create({
    data: {
      nombre: "Casa 1 — junto al puerto",
      slug: "casa-puerto",
      direccion: "Calle de ejemplo 1, Castro Urdiales, Cantabria",
      lat: 43.383,
      lng: -3.216,
      descripcionCorta:
        "Casa acogedora a pocos minutos del puerto y el casco histórico.",
      descripcionLarga:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Una casa " +
        "luminosa perfecta para descubrir Castro Urdiales a pie. Cerca de " +
        "playas, restaurantes y el paseo marítimo. (Descripción de ejemplo.)",
      capacidad: 6,
      habitaciones: 3,
      banos: 2,
      servicios: ["wifi", "calefaccion", "cocina_equipada", "lavadora", "terraza"],
      fotos: [
        "/placeholder/casa-1-1.svg",
        "/placeholder/casa-1-2.svg",
        "/placeholder/casa-1-3.svg",
      ],
      precioTemporadaBaja: 90,
      precioTemporadaAlta: 130,
      temporadaAltaInicio: new Date("2026-06-15"),
      temporadaAltaFin: new Date("2026-09-15"),
      orden: 1,
    },
  });

  const casa2 = await prisma.casa.create({
    data: {
      nombre: "Casa 2 — con jardín",
      slug: "casa-jardin",
      direccion: "Calle de ejemplo 2, Castro Urdiales, Cantabria",
      lat: 43.385,
      lng: -3.221,
      descripcionCorta:
        "Casa con jardín y parking, ideal para familias y estancias largas.",
      descripcionLarga:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Espaciosa " +
        "casa con jardín privado y plaza de aparcamiento. Tranquila pero bien " +
        "conectada con el centro. (Descripción de ejemplo.)",
      capacidad: 8,
      habitaciones: 4,
      banos: 2,
      servicios: ["wifi", "parking", "jardin", "calefaccion", "cocina_equipada", "admite_mascotas"],
      fotos: [
        "/placeholder/casa-2-1.svg",
        "/placeholder/casa-2-2.svg",
        "/placeholder/casa-2-3.svg",
      ],
      precioTemporadaBaja: 110,
      precioTemporadaAlta: 160,
      temporadaAltaInicio: new Date("2026-06-15"),
      temporadaAltaFin: new Date("2026-09-15"),
      orden: 2,
    },
  });

  // Reseñas ficticias (variadas en longitud y valoración para que resulten creíbles).
  await prisma.resena.createMany({
    data: [
      {
        casaId: casa1.id,
        nombreAutor: "María G.",
        texto: "Todo perfecto, la casa está muy bien situada y limpísima. Repetiremos.",
        valoracion: 5,
        fecha: new Date("2025-08-12"),
        destacada: true,
      },
      {
        casaId: casa1.id,
        nombreAutor: "Jon A.",
        texto:
          "Muy buena experiencia. La cocina está completa y el trato del propietario fue estupendo. La zona de aparcamiento es algo justa en verano.",
        valoracion: 4,
        fecha: new Date("2025-07-03"),
        destacada: false,
      },
      {
        casaId: casa2.id,
        nombreAutor: "Familia Ruiz",
        texto:
          "El jardín fue un acierto con los niños. Espaciosa y cómoda. Volveremos el año que viene.",
        valoracion: 5,
        fecha: new Date("2025-08-20"),
        destacada: true,
      },
      {
        casaId: casa2.id,
        nombreAutor: "Laura P.",
        texto: "Bien en general. La casa cumple lo que promete.",
        valoracion: 4,
        fecha: new Date("2025-06-28"),
        destacada: false,
      },
      {
        casaId: null, // reseña general (aplica a ambas casas)
        nombreAutor: "Carlos M.",
        texto:
          "Hemos alquilado las dos casas en distintos viajes y ambas están muy cuidadas. Castro es un sitio precioso.",
        valoracion: 5,
        fecha: new Date("2025-09-01"),
        destacada: true,
      },
    ],
  });

  console.info("✅ Seed completado: 2 casas y 5 reseñas de ejemplo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
