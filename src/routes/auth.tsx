import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso ao painel — administração da loja" },
      { name: "description", content: "Entre com sua conta para acessar o painel administrativo da loja." },
      { property: "og:title", content: "Acesso ao painel" },
      { property: "og:description", content: "Área restrita da administração da loja." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  ssr: false,
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    if (mode === "entrar") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError("E-mail ou senha incorretos.");
      else navigate({ to: "/admin", replace: true });
    } else {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      if (err) setError(err.message);
      else if (!data.session) setMessage("Conta criada. Confirme o e-mail para entrar.");
      else navigate({ to: "/admin", replace: true });
    }
    setBusy(false);
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
    });
    if (result.error) {
      setError("Não foi possível entrar com o Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-[420px] rounded-2xl border border-border bg-surface p-7 shadow-sm">
        <h1 className="text-xl font-bold">Painel da loja</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "entrar" ? "Entre para gerenciar pedidos e faturamento." : "Crie sua conta de acesso."}
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <div>
            <label className="text-sm font-medium" htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "entrar" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:border-brand"
            />
          </div>

          {error ? <p className="text-sm text-promo">{error}</p> : null}
          {message ? <p className="text-sm text-buy">{message}</p> : null}

          <button
            type="submit"
            disabled={busy}
            className="h-11 w-full rounded-full bg-brand font-bold text-primary-foreground disabled:opacity-60"
          >
            {mode === "entrar" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={google}
          className="h-11 w-full rounded-full border border-border font-semibold hover:bg-background"
        >
          Continuar com Google
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "entrar" ? "criar" : "entrar")}
          className="mt-4 w-full text-sm text-brand underline"
        >
          {mode === "entrar" ? "Não tenho conta" : "Já tenho conta"}
        </button>
      </div>
    </div>
  );
}
