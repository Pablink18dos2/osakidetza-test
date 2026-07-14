import Image from "next/image";
import Link from "next/link";
import type { CasaDTO } from "@/lib/data/casas";
import { formatEuros } from "@/lib/format";

export function CasaCard({ casa }: { casa: CasaDTO }) {
  return (
    <Link
      href={`/casas/${casa.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={casa.fotos[0] ?? "/placeholder/casa-1-1.svg"}
          alt={casa.nombre}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-xl text-ink">{casa.nombre}</h3>
        <p className="text-sm text-muted">{casa.descripcionCorta}</p>
        <div className="mt-auto flex items-baseline justify-between pt-3">
          <span className="text-sm text-muted">
            {casa.capacidad} huéspedes · {casa.habitaciones} hab.
          </span>
          <span className="text-ink">
            <span className="text-xs text-muted">desde </span>
            <span className="font-semibold">
              {formatEuros(casa.precioTemporadaBaja)}
            </span>
            <span className="text-xs text-muted"> /noche</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
