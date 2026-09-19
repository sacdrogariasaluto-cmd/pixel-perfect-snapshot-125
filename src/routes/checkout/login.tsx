import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckoutFooter, CheckoutHeader } from "@/components/CheckoutHeader";
import { ChevronRight } from "@/components/Icons";

export const Route = createFileRoute("/checkout/login")({
  head: () => ({
    meta: [
      { title: "Identificação — farmácia online" },
      { name: "description", content: "Informe seu e-mail para continuar a finalização do pedido." },
      { property: "og:title", content: "Identificação" },
      { property: "og:description", content: "Etapa de identificação por e-mail do checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IdentificationPage,
});

const socials = ["Facebook", "Google", "Mercadolivre"];

function IdentificationPage() {
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CheckoutHeader />

      <main className="container-site flex-1 py-6">
        <Link to="/checkout/carrinho" className="text-sm hover:text-brand">
          ← Voltar para o carrinho
        </Link>
        <hr className="my-5 border-border" />

        <div className="grid gap-10 md:grid-cols-2">
          <div className="pt-10">
            <h1 className="text-3xl">Olá,</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Para finalizar a compra digite seu e-mail.
            </p>
            <form
              className="mt-6 max-w-md space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setMsg(
                  "As etapas seguintes de cadastro, entrega e pagamento dependem de integração própria.",
                );
              }}
            >
              <label className="sr-only" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="exemplo@email.com.br"
                className="h-12 w-full rounded-md border border-border bg-surface px-4"
              />
              <button
                type="submit"
                className="rounded-md bg-buy px-8 py-3 font-bold text-white hover:bg-buy-hover"
              >
                Continuar
              </button>
              {msg && (
                <p role="status" className="text-sm text-muted-foreground">
                  {msg}
                </p>
              )}
            </form>

            <div className="mt-10 max-w-lg rounded-2xl bg-surface p-8">
              <h2 className="font-bold text-buy">Usamos seu email de forma 100% segura para:</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                <li>Identificar seu perfil</li>
                <li>Notificar sobre andamento do seu pedido</li>
                <li>Gerenciar seu histórico de compras</li>
                <li>Acelerar o preenchimento das suas informações</li>
              </ul>
            </div>
          </div>

          <div className="pt-6">
            <p className="text-lg">Ou use suas redes sociais favoritas para entrar na sua conta</p>
            <hr className="my-5 border-border" />
            <ul className="overflow-hidden rounded-md bg-surface">
              {socials.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() =>
                      setMsg(`Entrada por ${s} requer credenciais próprias configuradas.`)
                    }
                    className="flex w-full items-center justify-between border-b border-border px-4 py-3 text-left text-muted-foreground last:border-0 hover:bg-accent"
                  >
                    {s}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <CheckoutFooter />
    </div>
  );
}
