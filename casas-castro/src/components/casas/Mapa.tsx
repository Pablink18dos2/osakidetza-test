// Mapa de ubicación mediante embed de OpenStreetMap (iframe, sin API key).
// Alternativa a Google Maps que evita dependencias y claves.

export function Mapa({
  lat,
  lng,
  nombre,
}: {
  lat: number | null;
  lng: number | null;
  nombre: string;
}) {
  if (lat == null || lng == null) return null;

  const d = 0.008; // margen del recuadro visible
  const bbox = `${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <iframe
        title={`Mapa de ${nombre}`}
        src={src}
        className="h-64 w-full"
        loading="lazy"
      />
    </div>
  );
}
