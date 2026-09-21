import { Link } from "@tanstack/react-router";
import { policyNav, type PolicyPage } from "@/data/policies";

export function PolicyShell({
  active,
  children,
}: {
  active?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-site py-8 md:py-10">
      <h1 className="text-2xl font-bold md:text-3xl">Como podemos te ajudar?</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Abaixo tem os links das dúvidas mais frequentes e nossas políticas.
      </p>

      <nav
        aria-label="Políticas e ajuda"
        className="mt-5 flex flex-wrap gap-2"
      >
        {policyNav.map((item) => (
          <Link
            key={item.slug}
            to="/ajuda/$slug"
            params={{ slug: item.slug }}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              active === item.slug
                ? "border-brand bg-brand font-semibold text-white"
                : "border-border bg-surface hover:border-brand hover:text-brand"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 max-w-3xl">{children}</div>
    </div>
  );
}

export function PolicyContent({ page }: { page: PolicyPage }) {
  return (
    <article className="space-y-6">
      {page.blocks.map((block, i) => (
        <section key={i} className="space-y-3">
          {block.heading && (
            <h2 className="text-lg font-bold md:text-xl">{block.heading}</h2>
          )}
          {block.paragraphs?.map((p, j) => (
            <p key={j} className="text-sm leading-relaxed text-foreground/90">
              {p}
            </p>
          ))}
          {block.list && (
            <ul className="list-disc space-y-1 pl-6 text-sm leading-relaxed text-foreground/90">
              {block.list.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
}
