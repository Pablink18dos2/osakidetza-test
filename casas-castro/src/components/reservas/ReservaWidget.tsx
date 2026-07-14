"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { es } from "react-day-picker/locale";
import "react-day-picker/style.css";
import {
  differenceInCalendarDays,
  format,
  parseISO,
  startOfToday,
  subDays,
} from "date-fns";
import { formatEuros } from "@/lib/format";

export interface OcupadoSerializado {
  inicio: string; // ISO
  fin: string; // ISO (día de salida, exclusivo)
  estado: string;
}

interface Props {
  casaId: string;
  capacidad: number;
  precioTemporadaBaja: number;
  minNoches: number;
  ventanaHoras: number;
}

type Estado =
  | { tipo: "idle" }
  | { tipo: "enviando" }
  | { tipo: "ok" }
  | { tipo: "error"; mensaje: string };

export function ReservaWidget({
  casaId,
  capacidad,
  precioTemporadaBaja,
  minNoches,
  ventanaHoras,
}: Props) {
  const [rango, setRango] = useState<DateRange | undefined>();
  const [estado, setEstado] = useState<Estado>({ tipo: "idle" });
  const [ocupados, setOcupados] = useState<OcupadoSerializado[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    fetch(`/api/disponibilidad?casaId=${encodeURIComponent(casaId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (activo) setOcupados(data.ocupados ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [casaId]);

  // Rangos ocupados -> matchers de react-day-picker.
  // El día de salida (fin) es exclusivo, así que la última noche ocupada es fin-1.
  const { provisional, ocupado, deshabilitados } = useMemo(() => {
    const provisional = ocupados
      .filter((o) => o.estado === "provisional")
      .map((o) => ({ from: parseISO(o.inicio), to: subDays(parseISO(o.fin), 1) }));
    const ocupado = ocupados
      .filter((o) => o.estado !== "provisional")
      .map((o) => ({ from: parseISO(o.inicio), to: subDays(parseISO(o.fin), 1) }));
    return {
      provisional,
      ocupado,
      deshabilitados: [{ before: startOfToday() }, ...provisional, ...ocupado],
    };
  }, [ocupados]);

  const noches =
    rango?.from && rango?.to
      ? differenceInCalendarDays(rango.to, rango.from)
      : 0;

  const rangoValido = noches >= minNoches;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!rango?.from || !rango?.to || !rangoValido) return;

    setEstado({ tipo: "enviando" });
    const form = new FormData(e.currentTarget);
    const payload = {
      casaId,
      nombre: form.get("nombre"),
      email: form.get("email"),
      telefono: form.get("telefono"),
      numPersonas: form.get("numPersonas"),
      mensaje: form.get("mensaje") ?? "",
      aceptaPrivacidad: form.get("aceptaPrivacidad") === "on",
      fechaInicio: format(rango.from, "yyyy-MM-dd"),
      fechaFin: format(rango.to, "yyyy-MM-dd"),
    };

    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setEstado({ tipo: "error", mensaje: data.error ?? "No se pudo enviar." });
        return;
      }
      setEstado({ tipo: "ok" });
      setRango(undefined);
    } catch {
      setEstado({ tipo: "error", mensaje: "Error de conexión. Inténtalo de nuevo." });
    }
  }

  if (estado.tipo === "ok") {
    return (
      <div className="rounded-lg border border-ok/40 bg-ok/5 p-4 text-sm text-ink">
        <p className="font-medium">¡Solicitud enviada!</p>
        <p className="mt-1 text-muted">
          Te hemos enviado un email de confirmación. Tu reserva queda provisional
          durante {ventanaHoras}h mientras el propietario la confirma.
        </p>
      </div>
    );
  }

  return (
    <div className="reserva-widget">
      <DayPicker
        mode="range"
        locale={es}
        selected={rango}
        onSelect={setRango}
        disabled={deshabilitados}
        excludeDisabled
        min={minNoches + 1}
        startMonth={new Date()}
        modifiers={{ provisional, ocupado }}
        modifiersClassNames={{ provisional: "rdp-provisional", ocupado: "rdp-ocupado" }}
      />

      {cargando && (
        <p className="mt-1 text-xs text-muted">Comprobando disponibilidad…</p>
      )}

      {/* Leyenda */}
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <li className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm border border-border bg-libre" />
          Libre
        </li>
        <li className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-provisional" />
          En proceso
        </li>
        <li className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-ocupado" />
          Ocupado
        </li>
      </ul>

      {/* Resumen de selección */}
      {rango?.from && (
        <p className="mt-3 text-sm text-ink">
          {rango.to ? (
            <>
              {noches} noches ·{" "}
              <span className="text-muted">
                aprox. {formatEuros(noches * precioTemporadaBaja)}
              </span>
            </>
          ) : (
            "Selecciona la fecha de salida"
          )}
        </p>
      )}
      {rango?.from && rango?.to && !rangoValido && (
        <p className="mt-1 text-sm text-error">
          La estancia mínima es de {minNoches} noches.
        </p>
      )}

      {/* Formulario */}
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <Campo nombre="nombre" etiqueta="Nombre" tipo="text" requerido />
        <Campo nombre="email" etiqueta="Email" tipo="email" requerido />
        <Campo nombre="telefono" etiqueta="Teléfono" tipo="tel" requerido />
        <Campo
          nombre="numPersonas"
          etiqueta={`Personas (máx. ${capacidad})`}
          tipo="number"
          requerido
          min={1}
          max={capacidad}
          defaultValue={2}
        />
        <label className="block">
          <span className="text-sm text-muted">Mensaje (opcional)</span>
          <textarea
            name="mensaje"
            rows={3}
            className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </label>

        <p className="rounded-lg bg-brand-soft p-3 text-xs text-ink">
          Tu solicitud quedará <strong>provisionalmente reservada {ventanaHoras}{" "}
          horas</strong> mientras el propietario la confirma. Si no se confirma en
          ese plazo, las fechas volverán a estar disponibles.
        </p>

        <label className="flex items-start gap-2 text-xs text-muted">
          <input type="checkbox" name="aceptaPrivacidad" required className="mt-0.5" />
          <span>
            He leído y acepto la{" "}
            <a href="/privacidad" className="text-brand underline" target="_blank">
              política de privacidad
            </a>
            .
          </span>
        </label>

        {estado.tipo === "error" && (
          <p className="text-sm text-error">{estado.mensaje}</p>
        )}

        <button
          type="submit"
          disabled={!rangoValido || estado.tipo === "enviando"}
          className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {estado.tipo === "enviando" ? "Enviando…" : "Solicitar reserva"}
        </button>
      </form>
    </div>
  );
}

function Campo({
  nombre,
  etiqueta,
  tipo,
  requerido,
  min,
  max,
  defaultValue,
}: {
  nombre: string;
  etiqueta: string;
  tipo: string;
  requerido?: boolean;
  min?: number;
  max?: number;
  defaultValue?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{etiqueta}</span>
      <input
        name={nombre}
        type={tipo}
        required={requerido}
        min={min}
        max={max}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-brand"
      />
    </label>
  );
}
