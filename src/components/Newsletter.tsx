import { useState } from "react";

export function Newsletter() {
  const [sent, setSent] = useState(false);

  return (
    <section className="bg-surface py-8" aria-label="Newsletter">
      <div className="container-site flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div>
          <h2 className="text-[22px] font-bold">CADASTRE-SE</h2>
          <p className="text-sm text-muted-foreground">
            Receba ofertas e novidades da loja por e-mail.
          </p>
        </div>
        <form
          className="flex w-full max-w-xl flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label className="sr-only" htmlFor="nl-nome">
            Nome
          </label>
          <input
            id="nl-nome"
            required
            placeholder="Nome"
            className="h-11 flex-1 rounded-md border border-border px-3 outline-none focus:border-brand"
          />
          <label className="sr-only" htmlFor="nl-email">
            E-mail
          </label>
          <input
            id="nl-email"
            type="email"
            required
            placeholder="E-mail"
            className="h-11 flex-1 rounded-md border border-border px-3 outline-none focus:border-brand"
          />
          <button
            type="submit"
            className="h-11 rounded-md bg-buy px-6 font-bold text-white transition-colors hover:bg-buy-hover"
          >
            Cadastrar
          </button>
        </form>
      </div>
      {sent && (
        <p className="container-site mt-3 text-sm text-buy" role="status">
          Cadastro registrado apenas nesta demonstração — o envio depende de integração própria.
        </p>
      )}
    </section>
  );
}
