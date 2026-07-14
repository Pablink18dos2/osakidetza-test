// Contenido de la página "El pueblo y alrededores".
//
// Cifras y datos aproximados: VERIFICAR (horarios, precios, distancias)
// antes de publicar la web real.

export const pueblo = {
  intro:
    "Castro Urdiales es una villa marinera de la costa oriental de Cantabria, " +
    "a medio camino entre Bilbao y Santander. Combina un casco histórico con " +
    "encanto, buenas playas y una gastronomía de mar excelente.",

  queVer: [
    {
      titulo: "Casco histórico y puerto",
      texto:
        "Pasea por el puerto pesquero y el casco antiguo, con sus soportales y calles estrechas.",
    },
    {
      titulo: "Iglesia de Santa María de la Asunción",
      texto:
        "Templo gótico junto al mar, uno de los más notables de Cantabria, con el castillo-faro a su lado.",
    },
    {
      titulo: "Faro y senda costera",
      texto:
        "El faro sobre el antiguo castillo y los paseos junto al acantilado ofrecen las mejores vistas.",
    },
  ],

  playas: [
    { nombre: "Brazomar", texto: "Playa urbana, cómoda y bien equipada." },
    { nombre: "Ostende", texto: "Amplia y familiar, muy popular en verano." },
    { nombre: "Arenillas", texto: "Más tranquila, a pocos minutos del centro." },
  ],

  gastronomia:
    "Anchoas de la zona, pescados y guisos marineros como el marmitako. " +
    "Muchos bares de pinchos en el centro y el puerto.",

  fiestas:
    "El Coso Blanco, en julio, es la fiesta más conocida: un desfile nocturno " +
    "de carrozas iluminadas.",

  comoLlegar: [
    {
      destino: "Desde Bilbao",
      texto:
        "~35 km, unos 35-40 min en coche. Autobuses regulares (ALSA). " +
        "Verificar horarios y precio actual antes de publicar.",
    },
    {
      destino: "Desde Santander",
      texto:
        "~70 km, aprox. 50-70 min en coche. Verificar el transporte público disponible.",
    },
    {
      destino: "Aeropuertos",
      texto:
        "Bilbao (Loiu) y Santander (Seve Ballesteros) son los más cercanos.",
    },
  ],

  excursiones: [
    "Laredo",
    "Santoña",
    "Islares",
    "Bilbao",
    "Santander",
  ],
} as const;
