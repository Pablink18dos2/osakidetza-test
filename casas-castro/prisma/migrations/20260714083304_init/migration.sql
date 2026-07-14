-- CreateTable
CREATE TABLE "Casa" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "descripcionCorta" TEXT NOT NULL,
    "descripcionLarga" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "habitaciones" INTEGER NOT NULL,
    "banos" INTEGER NOT NULL,
    "servicios" JSONB NOT NULL,
    "fotos" JSONB NOT NULL,
    "precioTemporadaBaja" INTEGER NOT NULL,
    "precioTemporadaAlta" INTEGER,
    "temporadaAltaInicio" TIMESTAMP(3),
    "temporadaAltaFin" TIMESTAMP(3),
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Casa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL,
    "casaId" TEXT NOT NULL,
    "nombreCliente" TEXT NOT NULL,
    "emailCliente" TEXT NOT NULL,
    "telefonoCliente" TEXT NOT NULL,
    "numPersonas" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'provisional',
    "mensajeCliente" TEXT,
    "motivoRechazo" TEXT,
    "tokenConfirmacion" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resena" (
    "id" TEXT NOT NULL,
    "casaId" TEXT,
    "nombreAutor" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "valoracion" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "destacada" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resena_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Casa_slug_key" ON "Casa"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_tokenConfirmacion_key" ON "Reserva"("tokenConfirmacion");

-- CreateIndex
CREATE INDEX "Reserva_casaId_estado_idx" ON "Reserva"("casaId", "estado");

-- CreateIndex
CREATE INDEX "Reserva_estado_expiraEn_idx" ON "Reserva"("estado", "expiraEn");

-- CreateIndex
CREATE INDEX "Resena_casaId_idx" ON "Resena"("casaId");

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resena" ADD CONSTRAINT "Resena_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
