import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckoutFooter, CheckoutHeader } from "@/components/CheckoutHeader";
import { Carousel } from "@/components/Carousel";
import { MinusCircle, PlusCircle, TrashIcon } from "@/components/Icons";
import { brl, useCart } from "@/lib/cart";
import { products } from "@/data/products";

export const Route = createFileRoute("/checkout/carrinho")({
  head: () => ({
    meta: [
      { title: "Meu carrinho — farmácia online" },
      { name: "description", content: "Revise os produtos do seu carrinho, calcule frete e aplique cupom." },
      { property: "og:title", content: "Meu carrinho" },
      { property: "og:description", content: "Revise os produtos antes de finalizar o pedido." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQty, remove, count, subtotal, savings, add } = useCart();
  const [cep, setCep] = useState("");
  const [freight, setFreight] = useState<string | null>(null);
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  const recommended = products.slice(20, 26);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CheckoutHeader />

      <main className="container-site flex-1 py-8">
        {lines.length === 0 ? (
          <div className="rounded-md bg-surface p-12 text-center">
            <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
            <p className="mt-2 text-muted-foreground">
              Localize os produtos que você precisa navegando pelas coleções da loja.
            </p>
            <Link to="/" className="mt-4 inline-block text-brand underline">
              Voltar para a página principal
            </Link>
          </div>
        ) : (
          <>
            <section aria-label="Produtos selecionados para você">
              <h2 className="mb-4 text-xl">Produtos selecionados para você</h2>
              <Carousel label="Recomendações" step={470} className="gap-4 px-6">
                {recommended.map((p) => (
                  <div
                    key={p.id}
                    className="flex w-[340px] shrink-0 snap-start gap-3 rounded-md bg-surface p-4"
                  >
                    <img src={p.image} alt={p.name} className="h-20 w-20 object-contain" />
                    <div className="flex-1">
                      <p className="line-clamp-2-fixed text-sm">{p.name}</p>
                      <p className="mt-1 text-sm">
                        <span className="text-muted-foreground line-through">{brl(p.listPrice)}</span>{" "}
                        <strong>{brl(p.cardPrice)}</strong>
                      </p>
                      <button
                        type="button"
                        onClick={() => add(p)}
                        className="mt-2 w-full rounded bg-buy py-2 text-sm font-bold text-white hover:bg-buy-hover"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                ))}
              </Carousel>
            </section>

            <h1 className="mb-4 mt-10 text-2xl">Meu carrinho</h1>

            <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
              <div>
                <div className="grid grid-cols-[1fr_120px_120px_120px_40px] gap-2 px-4 pb-2 text-sm text-muted-foreground">
                  <span>Produto</span>
                  <span>Preço unitário</span>
                  <span>Quantidade</span>
                  <span>Preço total</span>
                  <span />
                </div>
                <ul className="space-y-3">
                  {lines.map((l) => (
                    <li
                      key={l.slug}
                      className="grid grid-cols-[1fr_120px_120px_120px_40px] items-center gap-2 rounded-md bg-surface p-4"
                    >
                      <div className="flex items-center gap-3">
                        <img src={l.image} alt="" className="h-14 w-14 object-contain" />
                        <Link to="/$slug/p" params={{ slug: l.slug }} className="text-sm hover:text-brand">
                          {l.name}
                        </Link>
                      </div>
                      <div className="text-sm">
                        {l.listPrice > l.unitPrice && (
                          <p className="text-muted-foreground line-through">{brl(l.listPrice)}</p>
                        )}
                        <p className="font-bold">{brl(l.unitPrice)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label="Diminuir quantidade"
                          disabled={l.qty === 1}
                          onClick={() => setQty(l.slug, l.qty - 1)}
                          className="text-muted-foreground disabled:opacity-40"
                        >
                          <MinusCircle className="h-6 w-6" />
                        </button>
                        <span>{l.qty}</span>
                        <button
                          type="button"
                          aria-label="Aumentar quantidade"
                          onClick={() => setQty(l.slug, l.qty + 1)}
                          className="text-muted-foreground"
                        >
                          <PlusCircle className="h-6 w-6" />
                        </button>
                      </div>
                      <span className="font-bold text-buy">{brl(l.unitPrice * l.qty)}</span>
                      <button
                        type="button"
                        aria-label={`Remover ${l.name}`}
                        onClick={() => remove(l.slug)}
                        className="text-muted-foreground hover:text-promo"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="space-y-4">
                <div className="rounded-md bg-surface p-4">
                  <h2 className="mb-3 font-bold">Calcule frete e prazo</h2>
                  <form
                    className="flex"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFreight("Frete real depende de integração de logística.");
                    }}
                  >
                    <label className="sr-only" htmlFor="cep-carrinho">
                      CEP
                    </label>
                    <input
                      id="cep-carrinho"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="h-11 flex-1 rounded-l-md border border-border px-3"
                    />
                    <button type="submit" className="h-11 rounded-r-md bg-neutral-600 px-4 font-bold text-white">
                      OK
                    </button>
                  </form>
                  {freight && <p className="mt-2 text-xs text-muted-foreground">{freight}</p>}
                </div>

                <div className="space-y-3 rounded-md bg-surface p-4 text-sm">
                  <p className="text-muted-foreground">Vale presente</p>
                  <div className="flex items-center justify-between">
                    <span>Cupom de desconto:</span>
                    <button
                      type="button"
                      onClick={() => setCouponOpen((v) => !v)}
                      aria-expanded={couponOpen}
                      className="rounded bg-[#cfe9f5] px-3 py-1 font-bold text-foreground"
                    >
                      Adicionar
                    </button>
                  </div>
                  {couponOpen && (
                    <div className="space-y-2">
                      <label className="sr-only" htmlFor="cupom">
                        Código do cupom
                      </label>
                      <input
                        id="cupom"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="h-10 w-full rounded-md border border-border px-3"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCouponMsg("Validação de cupom depende de integração própria.")}
                          className="rounded bg-brand px-3 py-2 font-bold text-white"
                        >
                          Aplicar
                        </button>
                        <button
                          type="button"
                          onClick={() => setCouponOpen(false)}
                          className="rounded border border-border px-3 py-2"
                        >
                          Fechar
                        </button>
                      </div>
                      {couponMsg && <p className="text-xs text-muted-foreground">{couponMsg}</p>}
                    </div>
                  )}

                  <div className="flex justify-between border-t border-border pt-3">
                    <span>Subtotal ({count} {count === 1 ? "item" : "itens"}):</span>
                    <strong>{brl(subtotal)}</strong>
                  </div>
                  <div className="flex justify-between text-lg">
                    <strong>Total:</strong>
                    <strong className="text-buy">{brl(subtotal)}</strong>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between rounded bg-background p-3">
                      <span>Você vai economizar:</span>
                      <strong>{brl(savings)}</strong>
                    </div>
                  )}
                  <Link
                    to="/checkout"
                    className="block rounded-md bg-buy py-3 text-center font-bold text-white hover:bg-buy-hover"
                  >
                    Finalizar pedido
                  </Link>
                  <Link to="/" className="block text-center text-brand underline">
                    Comprar mais produtos
                  </Link>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>

      <CheckoutFooter />
    </div>
  );
}
