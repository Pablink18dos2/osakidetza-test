// Tipos de dominio compartidos.
//
// Los "enums" se definen aquí como uniones de tipos porque el esquema Prisma
// usa String para ser compatible con SQLite. Al migrar a Postgres se pueden
// convertir en enums nativos sin cambiar este contrato.

/** Estados posibles de una reserva. */
export const ESTADOS_RESERVA = [
  "provisional", // solicitada, pendiente de confirmación del propietario (48h)
  "confirmada", // confirmada por el propietario, fechas bloqueadas
  "rechazada", // rechazada por el propietario
  "expirada", // caducó sin respuesta en 48h
  "bloqueo", // fechas bloqueadas manualmente por el propietario
] as const;

export type EstadoReserva = (typeof ESTADOS_RESERVA)[number];

/** Estados que ocupan el calendario (impiden reservar esas fechas). */
export const ESTADOS_OCUPADOS: EstadoReserva[] = [
  "provisional",
  "confirmada",
  "bloqueo",
];

/** Servicios/comodidades que puede tener una casa. */
export type Servicio =
  | "wifi"
  | "parking"
  | "jardin"
  | "terraza"
  | "calefaccion"
  | "aire_acondicionado"
  | "lavadora"
  | "cocina_equipada"
  | "admite_mascotas"
  | "vistas_mar";
