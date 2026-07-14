import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { iniciarSesion, passwordCorrecta, estaAutenticado } from "@/lib/auth";

export const metadata: Metadata = { title: "Acceso — Administración" };

export default async function LoginPage(
  props: PageProps<"/admin/login">,
) {
  if (await estaAutenticado()) redirect("/admin");
  const { error } = await props.searchParams;

  async function entrar(formData: FormData) {
    "use server";
    const password = String(formData.get("password") ?? "");
    if (!passwordCorrecta(password)) redirect("/admin/login?error=1");
    await iniciarSesion();
    redirect("/admin");
  }

  return (
    <div className="container-page max-w-sm py-20">
      <h1 className="text-2xl text-ink">Administración</h1>
      <p className="mt-1 text-sm text-muted">Acceso del propietario.</p>

      <form action={entrar} className="mt-6 space-y-3">
        <label className="block">
          <span className="text-sm text-muted">Contraseña</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="mt-1 w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </label>
        {error && (
          <p className="text-sm text-error">Contraseña incorrecta.</p>
        )}
        <button className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark">
          Entrar
        </button>
      </form>
    </div>
  );
}
