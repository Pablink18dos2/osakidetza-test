import Image from "next/image";

// Galería sencilla: foto principal grande + resto en cuadrícula.
// En una fase posterior se puede convertir en carrusel/lightbox.
export function Galeria({ fotos, nombre }: { fotos: string[]; nombre: string }) {
  if (fotos.length === 0) return null;
  const [principal, ...resto] = fotos;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="relative aspect-[3/2] overflow-hidden rounded-xl sm:row-span-2 sm:aspect-auto">
        <Image
          src={principal}
          alt={`${nombre} — foto principal`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {resto.map((foto, i) => (
        <div
          key={foto}
          className="relative aspect-[3/2] overflow-hidden rounded-xl"
        >
          <Image
            src={foto}
            alt={`${nombre} — foto ${i + 2}`}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
