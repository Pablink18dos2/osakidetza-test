// Autenticación sencilla del panel de administración.
//
// Un único usuario (el propietario). Se valida la contraseña contra
// ADMIN_PASSWORD y se guarda una cookie de sesión firmada con HMAC (AUTH_SECRET),
// httpOnly, para que no pueda falsificarse desde el cliente.
//
// Para producción se puede sustituir por Supabase Auth o magic link sin
// cambiar los consumidores (páginas de admin), que solo usan estas funciones.

import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "admin_sesion";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 días

function secret(): string {
  return process.env.AUTH_SECRET ?? "dev-secret";
}

function firmar(valor: string): string {
  return createHmac("sha256", secret()).update(valor).digest("hex");
}

function tokenSesion(): string {
  // El "payload" es fijo (un solo usuario); la firma es lo que lo hace válido.
  const payload = "admin";
  return `${payload}.${firmar(payload)}`;
}

function tokenValido(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, firma] = token.split(".");
  if (!payload || !firma) return false;
  const esperado = firmar(payload);
  const a = Buffer.from(firma);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Comprueba la contraseña introducida en el login. */
export function passwordCorrecta(password: string): boolean {
  const esperada = process.env.ADMIN_PASSWORD ?? "admin";
  const a = Buffer.from(password);
  const b = Buffer.from(esperada);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function iniciarSesion(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, tokenSesion(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function cerrarSesion(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function estaAutenticado(): Promise<boolean> {
  const store = await cookies();
  return tokenValido(store.get(COOKIE)?.value);
}

/** Para usar en páginas protegidas: redirige a /admin/login si no hay sesión. */
export async function requerirAuth(): Promise<void> {
  if (!(await estaAutenticado())) redirect("/admin/login");
}
