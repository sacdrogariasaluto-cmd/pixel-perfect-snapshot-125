import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PolicyShell } from "@/components/PolicyPage";
import { policyNav } from "@/data/policies";

export const Route = createFileRoute("/ajuda/")({
  head: () => ({
    meta: [
      { title: "Como podemos te ajudar? — farmácia online" },
      {
        name: "description",
        content: "Central de ajuda: dúvidas frequentes, política de privacidade, pagamentos, entrega, trocas e devoluções.",
      },
      { property: "og:title", content: "Como podemos te ajudar?" },
      {
        property: "og:description",
        content: "Dúvidas frequentes e políticas da loja: privacidade, pagamentos, entrega e trocas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HelpHubPage,
});

function HelpHubPage() {
  return (
    <SiteLayout>
      <PolicyShell>
        <div className="grid gap-3 sm:grid-cols-2">
          {policyNav.map((item) => (
            <Link
              key={item.slug}
              to="/ajuda/$slug"
              params={{ slug: item.slug }}
              className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-4 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
            >
              {item.label}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </PolicyShell>
    </SiteLayout>
  );
}
