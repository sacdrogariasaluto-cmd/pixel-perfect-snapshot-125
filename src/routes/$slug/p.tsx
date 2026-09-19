import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductShelf } from "@/components/ProductShelf";
import { ChevronRight, Stars, ZoomIcon } from "@/components/Icons";
import { collectionBySlug } from "@/data/site";
import { getProduct, products } from "@/data/products";
import { brl, useCart } from "@/lib/cart";

export const Route = createFileRoute("/$slug/p")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Produto";
    return {
      meta: [
        { title: `${name} — farmácia online` },
        {
          name: "description",
          content: `${name}. Confira o preço no pix, no cartão e a simulação de frete.`,
        },
        { property: "og:title", content: name },
        { property: "og:description", content: `${name} disponível na nossa farmácia online.` },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [fontStep, setFontStep] = useState(0);

  const collection = collectionBySlug(product.category);
  const similar = products.filter((p) => p.category === product.category && p.id !== product.id);

  return (
    <SiteLayout>
      <section className="bg-surface py-8">
        <div className="container-site grid gap-10 md:grid-cols-2">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="mb-4 h-[90px] w-[80px] rounded border border-border object-contain p-1"
            />
            <div className="flex min-h-[320px] items-center justify-center">
              <img src={product.image} alt={product.name} className="max-h-[320px] object-contain" />
            </div>
            <button
              type="button"
              aria-label="Ampliar imagem"
              className="absolute bottom-0 right-8 rounded-full border border-border bg-surface p-3 text-muted-foreground"
            >
              <ZoomIcon className="h-5 w-5" />
            </button>
          </div>

          <div>
            <nav aria-label="Trilha" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-brand">
                Início
              </Link>
              <ChevronRight className="h-4 w-4" />
              {collection && (
                <Link to="/$slug" params={{ slug: collection.slug }} className="hover:text-brand">
                  {collection.label}
                </Link>
              )}
            </nav>

            <h1 className="mt-3 text-[26px] leading-tight">{product.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-bold text-brand">{product.brand}</span>
              <span className="text-muted-foreground">Cód: {product.code}</span>
              <Stars value={product.rating} count={product.reviews} />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <div>
                {product.listPrice > product.cardPrice && (
                  <p className="text-sm text-muted-foreground line-through">{brl(product.listPrice)}</p>
                )}
                <p className="text-[32px] font-bold leading-tight text-brand">
                  {brl(product.pixPrice)} <span className="text-sm font-normal">no pix</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  ou <strong className="text-foreground">{brl(product.cardPrice)}</strong> no cartão
                </p>
              </div>
              {product.discount > 0 && (
                <span className="rounded bg-promo px-2 py-1 text-sm font-bold text-promo-foreground">
                  -{product.discount}%
                </span>
              )}
              <div className="flex h-12 items-center gap-4 rounded-md border border-border px-4">
                <button
                  type="button"
                  aria-label="Diminuir quantidade"
                  disabled={qty === 1}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="text-xl disabled:opacity-40"
                >
                  −
                </button>
                <span aria-live="polite">{qty}</span>
                <button type="button" aria-label="Aumentar quantidade" onClick={() => setQty((q) => q + 1)} className="text-xl">
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  add(product, qty);
                  setAdded(true);
                }}
                className="h-12 rounded-md bg-buy px-10 font-bold text-white transition-colors hover:bg-buy-hover"
              >
                COMPRAR
              </button>
            </div>
            {added && (
              <p role="status" className="mt-3 text-sm text-buy">
                Produto adicionado ao carrinho.{" "}
                <Link to="/checkout/carrinho" className="underline">
                  Ver carrinho
                </Link>
              </p>
            )}

            <form
              className="mt-6 flex flex-wrap items-center gap-3 rounded-md bg-background p-4"
              onSubmit={(e) => {
                e.preventDefault();
                setShipping("Cálculo de frete depende de integração própria de logística.");
              }}
            >
              <label htmlFor="cep" className="font-bold">
                Simule seu frete:
              </label>
              <input
                id="cep"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="Digite seu CEP"
                className="h-11 flex-1 rounded-md border border-border px-3"
              />
              <button type="submit" className="h-11 rounded-md bg-neutral-600 px-5 font-bold text-white">
                Calcular
              </button>
              <a href="#" className="text-sm text-brand">
                Não sei meu CEP
              </a>
              {shipping && (
                <p role="status" className="w-full text-sm text-muted-foreground">
                  {shipping}
                </p>
              )}
            </form>

            <div className="mt-6">
              <p className="font-bold">Compartilhe:</p>
              <div className="mt-2 flex gap-3">
                {["Facebook", "X", "WhatsApp", "Telegram"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    aria-label={`Compartilhar no ${s}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-sm text-muted-foreground"
                  >
                    {s[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-site my-8 rounded-md bg-surface p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[22px] font-bold">Descrição</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Acessibilidade</span>
            <button
              type="button"
              onClick={() => setFontStep((s) => Math.max(-2, s - 1))}
              className="rounded border border-border px-3 py-1"
              aria-label="Diminuir texto"
            >
              A −
            </button>
            <button
              type="button"
              onClick={() => setFontStep((s) => Math.min(4, s + 1))}
              className="rounded border border-border px-3 py-1"
              aria-label="Aumentar texto"
            >
              A +
            </button>
          </div>
        </div>
        <div className="mt-4 space-y-3 text-muted-foreground" style={{ fontSize: `${15 + fontStep}px` }}>
          <h3 className="font-bold text-foreground">Sobre o produto</h3>
          <p>
            Descrição de exemplo para {product.name}. Substitua por conteúdo do seu catálogo, com
            composição, modo de uso e advertências fornecidos pelo fabricante.
          </p>
          <h3 className="font-bold text-foreground">Avaliações</h3>
          <p>
            Avaliação agregada, distribuição de estrelas e perguntas e respostas dependem de
            integração própria de reviews.
          </p>
        </div>
      </section>

      {similar.length > 0 && <ProductShelf title="Produtos similares" products={similar} />}
    </SiteLayout>
  );
}
