import type { Metadata } from "next";
import { getCasas } from "@/lib/data/casas";
import { etiquetasServicio } from "@/content/servicios";
import type { Servicio } from "@/types";
import { accionGuardarCasa } from "../actions";

export const metadata: Metadata = { title: "Casas — Administración" };

const TODOS_SERVICIOS = Object.keys(etiquetasServicio) as Servicio[];

export default async function AdminCasasPage() {
  const casas = await getCasas();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl text-ink">Casas</h1>

      {casas.map((casa) => (
        <form
          key={casa.id}
          action={accionGuardarCasa}
          className="space-y-4 rounded-xl border border-border bg-surface p-5"
        >
          <input type="hidden" name="id" value={casa.id} />
          <h2 className="text-lg text-ink">{casa.nombre}</h2>

          <Texto nombre="nombre" etiqueta="Nombre" defaultValue={casa.nombre} />
          <Texto
            nombre="descripcionCorta"
            etiqueta="Descripción corta"
            defaultValue={casa.descripcionCorta}
          />
          <Area
            nombre="descripcionLarga"
            etiqueta="Descripción larga"
            defaultValue={casa.descripcionLarga}
            rows={5}
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Num nombre="capacidad" etiqueta="Capacidad" defaultValue={casa.capacidad} />
            <Num nombre="habitaciones" etiqueta="Habitaciones" defaultValue={casa.habitaciones} />
            <Num nombre="banos" etiqueta="Baños" defaultValue={casa.banos} />
            <Num
              nombre="precioTemporadaBaja"
              etiqueta="Precio temp. baja (€)"
              defaultValue={casa.precioTemporadaBaja}
            />
            <Num
              nombre="precioTemporadaAlta"
              etiqueta="Precio temp. alta (€)"
              defaultValue={casa.precioTemporadaAlta ?? undefined}
            />
          </div>

          <fieldset>
            <legend className="text-sm text-muted">Servicios</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {TODOS_SERVICIOS.map((s) => (
                <label key={s} className="flex items-center gap-1.5 text-sm text-ink">
                  <input
                    type="checkbox"
                    name="servicios"
                    value={s}
                    defaultChecked={casa.servicios.includes(s)}
                  />
                  {etiquetasServicio[s]}
                </label>
              ))}
            </div>
          </fieldset>

          <Area
            nombre="fotos"
            etiqueta="Fotos (una URL por línea)"
            defaultValue={casa.fotos.join("\n")}
            rows={4}
          />

          <button className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
            Guardar cambios
          </button>
        </form>
      ))}
    </div>
  );
}

function Texto({ nombre, etiqueta, defaultValue }: { nombre: string; etiqueta: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{etiqueta}</span>
      <input
        name={nombre}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-brand"
      />
    </label>
  );
}

function Area({ nombre, etiqueta, defaultValue, rows }: { nombre: string; etiqueta: string; defaultValue: string; rows: number }) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{etiqueta}</span>
      <textarea
        name={nombre}
        rows={rows}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-brand"
      />
    </label>
  );
}

function Num({ nombre, etiqueta, defaultValue }: { nombre: string; etiqueta: string; defaultValue?: number }) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{etiqueta}</span>
      <input
        type="number"
        name={nombre}
        defaultValue={defaultValue}
        min={0}
        className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-brand"
      />
    </label>
  );
}
