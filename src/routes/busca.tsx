import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { SiteLayout } from "@/components/SiteLayout";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  ordem: fallback(z.string(), "relevancia").default("relevancia"),
});

export const Route = createFileRoute("/busca")({
  validateSearch: zodValidator(searchSchema),
  head: ({ search }) => ({
    meta: [
      { title: `Busca: ${String(search?.['q'] ?? "")} — farmácia online` },
      { name: "description", content: "Resultados da busca de produtos da farmácia online." },
      { property: "og:title", content: "Busca de produtos" },
      { property: "og:description", content: "Encontre medicamentos, vitaminas e produtos de cuidados pessoais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BuscaPage,
});

const normalize = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

function BuscaPage() {
  const { q, ordem } = Route.useSearch();
  const navigate = Route.useNavigate();
  const term = normalize(q.trim());

  let results = term
    ? products.filter((p) => normalize(`${p.name} ${p.brand} ${p.category}`).includes(term))
    : [];

  if (ordem === "menor-preco") results = [...results].sort((a, b) => a.pixPrice - b.pixPrice);
  if (ordem === "maior-preco") results = [...results].sort((a, b) => b.pixPrice - a.pixPrice);
  if (ordem === "avaliacao") results = [...results].sort((a, b) => b.rating - a.rating);

  return (
    <SiteLayout>
      <section className="container-site my-6">
        <h1 className="text-xl font-bold md:text-2xl">
          {term ? (
            <>
              Resultados para <span className="text-brand">“{q.trim()}”</span>
            </>
          ) : (
            "Buscar produtos"
          )}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {term
            ? `${results.length} ${results.length === 1 ? "produto encontrado" : "produtos encontrados"}`
            : "Digite um termo na barra de busca para encontrar produtos."}
        </p>

        {term && results.length > 0 && (
          <div className="mt-4 flex items-center justify-end gap-2 text-sm">
            <label htmlFor="ordem" className="text-muted-foreground">
              Ordenar por:
            </label>
            <select
              id="ordem"
              value={ordem}
              onChange={(e) =>
                navigate({ search: (prev) => ({ ...prev, ordem: e.target.value }) })
              }
              className="h-9 rounded-md border border-border bg-surface px-2 text-sm"
            >
              <option value="relevancia">Relevância</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="avaliacao">Melhor avaliados</option>
            </select>
          </div>
        )}

        {term && results.length === 0 && (
          <div className="mt-6 rounded-md bg-surface p-10 text-center">
            <p className="font-bold">Nenhum produto encontrado</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Verifique a ortografia ou tente um termo mais genérico, como o princípio ativo.
            </p>
            <Link to="/" className="mt-4 inline-block text-brand underline">
              Voltar para a página inicial
            </Link>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
