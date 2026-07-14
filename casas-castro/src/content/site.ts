// Configuración y textos globales del sitio.
//
// Se mantiene el contenido separado del código para poder editarlo con
// facilidad y, en el futuro, traducirlo sin tocar los componentes.

export const site = {
  nombre: "Casas en Castro Urdiales",
  descripcion:
    "Dos casas para alquilar en Castro Urdiales. Fotos, precios, ubicación y disponibilidad. Solicita tu reserva online.",
  // Datos de contacto del propietario (rellenar antes de publicar).
  contacto: {
    email: "propietario@example.com",
    telefono: "+34 600 000 000",
    whatsapp: "+34 600 000 000",
  },
} as const;

// Reglas de negocio de las reservas.
export const reglasReserva = {
  /** Estancia mínima en noches. */
  minNoches: 5,
  /** Horas que se retienen las fechas en estado provisional. */
  ventanaProvisionalHoras: 48,
} as const;

// Navegación principal.
export const navPrincipal = [
  { href: "/", label: "Inicio" },
  { href: "/el-pueblo", label: "El pueblo" },
  { href: "/contacto", label: "Contacto" },
] as const;
