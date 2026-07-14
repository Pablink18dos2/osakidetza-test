import type { ResenaDTO } from "@/lib/data/resenas";
import { Rating } from "@/components/ui/Rating";

export function ResenaCard({ resena }: { resena: ResenaDTO }) {
  return (
    <figure className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
      <Rating valor={resena.valoracion} />
      <blockquote className="text-sm leading-relaxed text-ink">
        “{resena.texto}”
      </blockquote>
      <figcaption className="mt-auto text-sm font-medium text-muted">
        — {resena.nombreAutor}
      </figcaption>
    </figure>
  );
}
