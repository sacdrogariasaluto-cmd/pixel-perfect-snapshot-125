import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { brl, useCart } from "@/lib/cart";
import { BasketIcon } from "./Icons";

export function CartDrawer() {
  const { lines, open, setOpen, setQty, remove, count, subtotal, savings } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <div
      className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Meu carrinho"
        className={`absolute right-0 top-0 flex h-full w-[380px] max-w-[92vw] flex-col bg-surface shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <BasketIcon className="h-6 w-6 text-brand" />
            Meu carrinho
            <span className="text-sm font-normal text-muted-foreground">({count})</span>
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar carrinho"
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-muted-foreground hover:bg-muted"
          >
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <BasketIcon className="h-12 w-12 text-muted-foreground" />
            <p className="font-bold">Seu carrinho está vazio</p>
            <p className="text-sm text-muted-foreground">
              Adicione produtos para vê-los aqui.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-[10px] bg-brand px-6 py-3 text-sm font-bold uppercase text-primary-foreground"
            >
              Continuar comprando
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {lines.map((l) => (
                <li key={l.slug} className="flex gap-3 py-4">
                  <img
                    src={l.image}
                    alt={l.name}
                    className="h-[72px] w-[64px] shrink-0 rounded border border-border object-contain p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/$slug/p"
                      params={{ slug: l.slug }}
                      onClick={() => setOpen(false)}
                      className="line-clamp-2-fixed text-sm hover:text-brand"
                    >
                      {l.name}
                    </Link>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex h-8 items-center rounded-lg border border-border">
                        <button
                          type="button"
                          aria-label="Diminuir quantidade"
                          onClick={() => setQty(l.slug, l.qty - 1)}
                          className="h-full w-7 text-muted-foreground disabled:opacity-40"
                          disabled={l.qty === 1}
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm font-bold">{l.qty}</span>
                        <button
                          type="button"
                          aria-label="Aumentar quantidade"
                          onClick={() => setQty(l.slug, l.qty + 1)}
                          className="h-full w-7 text-muted-foreground"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-bold text-brand">{brl(l.unitPrice * l.qty)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(l.slug)}
                      className="mt-1 text-xs text-muted-foreground underline hover:text-promo"
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-5 py-4">
              {savings > 0 && (
                <p className="mb-1 flex justify-between text-sm text-buy">
                  <span>Você está economizando</span>
                  <strong>{brl(savings)}</strong>
                </p>
              )}
              <p className="flex justify-between text-base">
                <span>Subtotal</span>
                <strong className="text-lg text-brand">{brl(subtotal)}</strong>
              </p>
              <Link
                to="/checkout/carrinho"
                onClick={() => setOpen(false)}
                className="mt-3 block rounded-[10px] bg-buy py-3 text-center text-sm font-bold uppercase text-primary-foreground hover:bg-buy-hover"
              >
                Finalizar compra
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-2 w-full py-2 text-center text-sm font-bold uppercase text-brand"
              >
                Continuar comprando
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
