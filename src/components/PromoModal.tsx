import { useEffect, useState } from "react";
import { CloseIcon } from "./Icons";

export function PromoModal() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("vc-vip") === "closed") return;
    const t = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    sessionStorage.setItem("vc-vip", "closed");
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vip-title"
      onClick={close}
    >
      <div
        className="relative grid max-h-[92vh] w-full max-w-4xl overflow-auto rounded-lg bg-surface md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/30 p-1 text-white"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        <img
          src="/img/b6e52005-11_-_banner_home_hidratantes_2025_03_1130x300.jpg"
          alt=""
          className="hidden h-full w-full object-cover md:block"
        />
        <form
          className="space-y-3 bg-brand p-6 text-white"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <h2 id="vip-title" className="text-2xl font-bold">
            Clube VIP
          </h2>
          <p className="text-sm">Cadastro promocional. Nenhum dado é enviado nesta demonstração.</p>
          <input required placeholder="Nome" className="h-11 w-full rounded-md px-3 text-foreground" />
          <input
            required
            type="email"
            placeholder="E-mail"
            className="h-11 w-full rounded-md px-3 text-foreground"
          />
          <fieldset className="flex gap-2">
            <legend className="mb-1 text-sm">Aniversário</legend>
            <input placeholder="Dia" aria-label="Dia" className="h-11 w-full rounded-md px-3 text-foreground" />
            <input placeholder="Mês" aria-label="Mês" className="h-11 w-full rounded-md px-3 text-foreground" />
            <input placeholder="Ano" aria-label="Ano" className="h-11 w-full rounded-md px-3 text-foreground" />
          </fieldset>
          <label className="flex items-start gap-2 text-xs">
            <input type="checkbox" required className="mt-1" />
            Li e aceito os termos e a política de privacidade.
          </label>
          <button
            type="submit"
            className="w-full rounded-md bg-promo py-3 font-bold text-promo-foreground hover:opacity-90"
          >
            Inscrever-se!
          </button>
          {done && (
            <p role="status" className="text-sm">
              Inscrição registrada apenas na interface — depende de integração própria.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
