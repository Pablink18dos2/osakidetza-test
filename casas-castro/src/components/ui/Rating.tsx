// Valoración en estrellas (1-5), solo presentación.

export function Rating({ valor }: { valor: number }) {
  const llenas = Math.round(valor);
  return (
    <span
      className="text-sand"
      aria-label={`${valor} de 5 estrellas`}
      title={`${valor}/5`}
    >
      {"★".repeat(llenas)}
      <span className="text-border">{"★".repeat(5 - llenas)}</span>
    </span>
  );
}
