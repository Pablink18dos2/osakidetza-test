// Datos de ejemplo para desarrollo.
//
// ⚠️ CONTENIDO INVENTADO (nombres, direcciones, precios, descripciones y fotos).
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
      nombre: "El Mirador del Puerto",
      slug: "mirador-del-puerto",
      direccion: "Calle La Rúa 12, 39700 Castro Urdiales, Cantabria",
      lat: 43.3835,
      lng: -3.2158,
      descripcionCorta:
        "Piso reformado en pleno casco histórico, a dos minutos del puerto y la playa de Brazomar.",
      descripcionLarga:
        "En pleno corazón del casco viejo de Castro Urdiales, este piso " +
        "luminoso y recién reformado es perfecto para descubrir el pueblo a " +
        "pie. Desde el salón se ve el trasiego del puerto, y en cinco minutos " +
        "estás en la playa de Brazomar o tomando algo de pinchos por la Rúa.\n\n" +
        "Tiene tres dormitorios, cocina totalmente equipada y una terraza " +
        "pequeña orientada al sur donde da el sol toda la mañana. Ideal para " +
        "familias o dos parejas que quieran una escapada tranquila con el mar " +
        "a un paso.",
      capacidad: 6,
      habitaciones: 3,
      banos: 2,
      servicios: [
        "wifi",
        "calefaccion",
        "cocina_equipada",
        "lavadora",
        "terraza",
        "vistas_mar",
      ],
      fotos: [
        "/placeholder/casa-1-1.svg",
        "/placeholder/casa-1-2.svg",
        "/placeholder/casa-1-3.svg",
        "/placeholder/casa-1-4.svg",
        "/placeholder/casa-1-5.svg",
      ],
      precioTemporadaBaja: 95,
      precioTemporadaAlta: 145,
      temporadaAltaInicio: new Date("2026-06-15"),
      temporadaAltaFin: new Date("2026-09-15"),
      orden: 1,
    },
  });

  const casa2 = await prisma.casa.create({
    data: {
      nombre: "Villa Arenillas",
      slug: "villa-arenillas",
      direccion: "Calle Los Huertos 4, 39700 Castro Urdiales, Cantabria",
      lat: 43.3861,
      lng: -3.2224,
      descripcionCorta:
        "Casa independiente con jardín y parking, tranquila y a diez minutos del centro.",
      descripcionLarga:
        "Una casa independiente en una zona tranquila de Castro, perfecta si " +
        "buscas espacio y desconexión sin renunciar a estar cerca de todo. El " +
        "jardín privado, con su mesa y barbacoa, es el punto fuerte para las " +
        "cenas de verano.\n\n" +
        "Cuenta con cuatro dormitorios, dos baños, cocina amplia y plaza de " +
        "aparcamiento en la propia parcela. Admite mascotas. A diez minutos " +
        "andando del centro y con la playa de Arenillas muy cerca en coche. " +
        "Estupenda para grupos grandes o familias con niños.",
      capacidad: 8,
      habitaciones: 4,
      banos: 2,
      servicios: [
        "wifi",
        "parking",
        "jardin",
        "calefaccion",
        "cocina_equipada",
        "lavadora",
        "admite_mascotas",
      ],
      fotos: [
        "/placeholder/casa-2-1.svg",
        "/placeholder/casa-2-2.svg",
        "/placeholder/casa-2-3.svg",
        "/placeholder/casa-2-4.svg",
        "/placeholder/casa-2-5.svg",
      ],
      precioTemporadaBaja: 120,
      precioTemporadaAlta: 175,
      temporadaAltaInicio: new Date("2026-06-15"),
      temporadaAltaFin: new Date("2026-09-15"),
      orden: 2,
    },
  });

  // Reseñas de ejemplo (variadas en longitud y valoración para que resulten creíbles).
  await prisma.resena.createMany({
    data: [
      {
        casaId: casa1.id,
        nombreAutor: "María G.",
        texto:
          "Todo perfecto. El piso está impecable y la ubicación no puede ser mejor: lo tienes todo a un paso. Repetiremos seguro.",
        valoracion: 5,
        fecha: new Date("2025-08-12"),
        destacada: true,
      },
      {
        casaId: casa1.id,
        nombreAutor: "Jon A.",
        texto:
          "Muy buena experiencia. La cocina está completa y el trato fue estupendo. La terraza es pequeña pero se agradece para desayunar al sol.",
        valoracion: 4,
        fecha: new Date("2025-07-03"),
        destacada: false,
      },
      {
        casaId: casa1.id,
        nombreAutor: "Patricia y Luis",
        texto: "Genial para una escapada de fin de semana. Volveremos.",
        valoracion: 5,
        fecha: new Date("2025-09-21"),
        destacada: false,
      },
      {
        casaId: casa2.id,
        nombreAutor: "Familia Ruiz",
        texto:
          "El jardín fue un acierto total con los niños y el perro. Espaciosa y muy cómoda. El parking propio, un lujo en agosto.",
        valoracion: 5,
        fecha: new Date("2025-08-20"),
        destacada: true,
      },
      {
        casaId: casa2.id,
        nombreAutor: "Laura P.",
        texto:
          "Bien en general, la casa cumple lo que promete. Al centro se llega andando pero con cuestas.",
        valoracion: 4,
        fecha: new Date("2025-06-28"),
        destacada: false,
      },
      {
        casaId: null, // reseña general (aplica a ambas casas)
        nombreAutor: "Carlos M.",
        texto:
          "Hemos alquilado las dos casas en distintos viajes y ambas están muy cuidadas. Castro es un pueblo precioso y se está de maravilla.",
        valoracion: 5,
        fecha: new Date("2025-09-01"),
        destacada: true,
      },
    ],
  });

  console.info("✅ Seed completado: 2 casas y 6 reseñas de ejemplo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
