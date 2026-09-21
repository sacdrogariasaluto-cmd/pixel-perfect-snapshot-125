import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { Carousel } from "@/components/Carousel";
import { ChevronRight } from "@/components/Icons";
import { collectionBySlug, collections, subCollections } from "@/data/site";
import { products, type Product } from "@/data/products";

const ORDERS = [
  "Relevância",
  "Lançamentos",
  "Mais vendidos",
  "Menor preço",
  "Maior preço",
  "A - Z",
  "Z - A",
  "Maior Desconto",
] as const;

const PER_PAGE = 20;

export const Route = createFileRoute("/$slug/")({
  loader: ({ params }) => {
    const collection = collectionBySlug(params.slug);
    if (!collection) throw notFound();
    return collection;
  },
  head: ({ loaderData }) => {
    const label = loaderData?.label ?? "Coleção";
    return {
      meta: [
        { title: `${label} — farmácia online` },
        {
          name: "description",
          content: `Produtos de ${label} com preços no pix, filtros por marca e entrega rápida.`,
        },
        { property: "og:title", content: `${label} — farmácia online` },
        { property: "og:description", content: `Confira os produtos de ${label}.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
});

function sortProducts(list: Product[], order: string) {
  const copy = [...list];
  switch (order) {
    case "Menor preço":
      return copy.sort((a, b) => a.pixPrice - b.pixPrice);
    case "Maior preço":
      return copy.sort((a, b) => b.pixPrice - a.pixPrice);
    case "A - Z":
      return copy.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    case "Z - A":
      return copy.sort((a, b) => b.name.localeCompare(a.name, "pt-BR"));
    case "Maior Desconto":
      return copy.sort((a, b) => b.discount - a.discount);
    default:
      return copy;
  }
}

function CategoryPage() {
  const collection = Route.useLoaderData();
  const [order, setOrder] = useState<string>(ORDERS[0]);
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [page, setPage] = useState(1);

  const base = useMemo(
    () => products.filter((p) => p.category === collection.slug),
    [collection.slug],
  );

  const brandCounts = useMemo(() => {
    const m = new Map<string, number>();
    base.forEach((p) => m.set(p.brand, (m.get(p.brand) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], "pt-BR"));
  }, [base]);

  const filtered = useMemo(() => {
    const list = brandFilter.length ? base.filter((p) => brandFilter.includes(p.brand)) : base;
    return sortProducts(list, order);
  }, [base, brandFilter, order]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const toggleBrand = (b: string) => {
    setPage(1);
    setBrandFilter((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  };

  return (
    <SiteLayout>
      <section className="bg-surface pb-10 pt-6">
        <div className="container-site">
          <nav aria-label="Trilha" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-brand">
              Início
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>{collection.label}</span>
          </nav>
          <h1 className="mt-3 text-[30px] font-normal">{collection.label}</h1>

          <div className="mt-6 grid min-w-0 gap-8 md:grid-cols-2">
            <div className="min-w-0 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <h2 className="text-base font-bold text-foreground">
                {collection.label}: cuidados essenciais para o seu dia a dia
              </h2>
              <p>
                Texto introdutório configurável da coleção. Descreva aqui a proposta de{" "}
                <strong>{collection.label}</strong>, os cuidados recomendados e os diferenciais de
                atendimento da sua operação.
              </p>
              <p>
                Os produtos exibidos são uma amostra visual do layout. O catálogo completo depende
                de integração própria.
              </p>
            </div>

            {collection.slug === "mamae-e-bebe" && (
              <div className="min-w-0">
                <Carousel label="Subcategorias" step={300} className="gap-6 px-8">
                  {subCollections.map((s) => (
                    <div
                      key={s.label}
                      className="flex w-[150px] shrink-0 snap-start flex-col items-center gap-2 text-center"
                    >
                      <img src={s.image} alt={s.label} className="h-16 w-16 object-contain" />
                      <span className="text-sm">{s.label}</span>
                    </div>
                  ))}
                </Carousel>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-background py-8">
        <div className="container-site grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-md bg-surface p-5">
              <h2 className="mb-3 text-xl font-bold">Ordenar</h2>
              <label className="sr-only" htmlFor="ordenar">
                Ordenar por
              </label>
              <select
                id="ordenar"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="h-11 w-full rounded-md border border-border bg-surface px-3"
              >
                {ORDERS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="rounded-md bg-surface p-5">
              <h2 className="mb-3 font-bold">Categoria</h2>
              <ul className="space-y-1 text-sm">
                {collections.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to="/$slug"
                      params={{ slug: c.slug }}
                      className={`hover:text-brand ${c.slug === collection.slug ? "font-bold text-brand" : ""}`}
                    >
                      {c.label} ({products.filter((p) => p.category === c.slug).length})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md bg-surface p-5">
              <h2 className="mb-3 font-bold">Marca</h2>
              <label className="sr-only" htmlFor="busca-marca">
                Buscar marcas
              </label>
              <input
                id="busca-marca"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Buscar marca"
                className="mb-3 h-10 w-full rounded-md border border-border px-3 text-sm"
              />
              <ul className="max-h-64 space-y-1 overflow-auto text-sm">
                {brandCounts
                  .filter(([b]) => b.toLowerCase().includes(brandSearch.toLowerCase()))
                  .map(([b, n]) => (
                    <li key={b}>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={brandFilter.includes(b)}
                          onChange={() => toggleBrand(b)}
                        />
                        {b} ({n})
                      </label>
                    </li>
                  ))}
              </ul>
              {brandFilter.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBrandFilter([])}
                  className="mt-3 text-sm text-brand underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </aside>

          <div>
            <p className="mb-3 text-sm text-muted-foreground" role="status">
              {filtered.length} resultado(s) — página {current} de {pages}
            </p>

            {visible.length === 0 ? (
              <p className="rounded-md bg-surface p-8 text-center text-muted-foreground">
                Nenhum produto desta coleção nesta amostra visual.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 md:gap-3 xl:grid-cols-4">
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Paginação">
              <button
                type="button"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
                className="rounded border border-border bg-surface px-3 py-2 text-sm disabled:opacity-40"
              >
                Anterior
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-current={n === current ? "page" : undefined}
                  onClick={() => setPage(n)}
                  className={`rounded border px-3 py-2 text-sm ${
                    n === current
                      ? "border-brand bg-brand text-white"
                      : "border-border bg-surface"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={current === pages}
                onClick={() => setPage(current + 1)}
                className="rounded border border-border bg-surface px-3 py-2 text-sm disabled:opacity-40"
              >
                Próxima
              </button>
            </nav>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
