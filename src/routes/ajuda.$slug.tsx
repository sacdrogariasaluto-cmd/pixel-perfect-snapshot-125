import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PolicyContent, PolicyShell } from "@/components/PolicyPage";
import { policyPages } from "@/data/policies";

export const Route = createFileRoute("/ajuda/$slug")({
  loader: ({ params }) => {
    const page = policyPages[params.slug];
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Ajuda"} — farmácia online` },
      { name: "description", content: loaderData?.description ?? "" },
      { property: "og:title", content: loaderData?.title ?? "Ajuda" },
      { property: "og:description", content: loaderData?.description ?? "" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  notFoundComponent: PolicyNotFound,
  component: PolicyPageRoute,
});

function PolicyPageRoute() {
  const page = Route.useLoaderData();
  return (
    <SiteLayout>
      <PolicyShell active={page.slug}>
        <PolicyContent page={page} />
      </PolicyShell>
    </SiteLayout>
  );
}

function PolicyNotFound() {
  return (
    <SiteLayout>
      <div className="container-site py-16 text-center">
        <h1 className="text-2xl font-bold">Página não encontrada</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O endereço digitado não existe.
        </p>
        <Link
          to="/ajuda"
          className="mt-6 inline-block rounded-md bg-brand px-6 py-2.5 text-sm font-bold text-white"
        >
          Ir para a central de ajuda
        </Link>
      </div>
    </SiteLayout>
  );
}
