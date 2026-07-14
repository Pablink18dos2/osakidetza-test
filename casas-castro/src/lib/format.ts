// Utilidades de formato (español).

const eur = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatEuros(valor: number): string {
  return eur.format(valor);
}

const fechaLarga = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatFecha(fecha: Date): string {
  return fechaLarga.format(fecha);
}
