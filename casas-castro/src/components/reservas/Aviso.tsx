import type { ReactNode } from "react";

type Tono = "ok" | "error" | "warn" | "info";

const estilos: Record<Tono, string> = {
  ok: "border-ok/40 bg-ok/5",
  error: "border-error/40 bg-error/5",
  warn: "border-warn/40 bg-warn/5",
  info: "border-border bg-surface",
};

// Tarjeta de estado centrada, reutilizada en las páginas de resultado.
export function Aviso({
  titulo,
  tono = "info",
  children,
}: {
  titulo: string;
  tono?: Tono;
  children?: ReactNode;
}) {
  return (
    <div className="container-page max-w-md py-20 text-center">
      <div className={`rounded-xl border p-8 ${estilos[tono]}`}>
        <h1 className="text-xl text-ink">{titulo}</h1>
        <div className="mt-2 text-sm text-muted">{children}</div>
      </div>
    </div>
  );
}
