import { useState } from "react";
import { CloseIcon } from "./Icons";

export function PromoBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="h-[38px] w-full bg-promo text-promo-foreground">
        <div className="container-site flex h-full items-center justify-center gap-3 text-[13px]">
          <span>
            <strong className="text-coupon">GANHE R$10 OFF</strong> em sua primeira compra!
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded bg-coupon px-2 py-1 text-[12px] font-bold tracking-wide text-promo transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            RESGATE AQUI
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Cupom de boas-vindas"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="absolute right-3 top-3 rounded-full bg-black/40 p-1 text-white"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            <img
              src="/img/c77c5317-cupom_bemvindo-02.jpg"
              alt="Cupom de desconto de boas-vindas"
              className="w-full"
            />
            <p className="p-4 text-center text-xs text-muted-foreground">
              Campanha de exemplo. Código, valor e regras são conteúdo configurável do projeto.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
