import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { BannerCarousel } from "@/components/BannerCarousel";
import { ProductShelf } from "@/components/ProductShelf";
import { PromoModal } from "@/components/PromoModal";
import { Carousel } from "@/components/Carousel";
import { CardIcon, ShieldIcon, StoreIcon, TruckIcon } from "@/components/Icons";
import { bannersMiddle, bannersTop, brands, collections } from "@/data/site";
import { products } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Farmácia online — medicamentos, dermocosméticos e nutrição" },
      {
        name: "description",
        content:
          "Farmácia online com medicamentos, genéricos, dermocosméticos, nutrição e cuidados pessoais, com entrega rápida e preços no pix.",
      },
      { property: "og:title", content: "Farmácia online — saúde e bem-estar" },
      {
        property: "og:description",
        content: "Medicamentos, genéricos, dermocosméticos e nutrição com entrega rápida.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const benefitIcons = [TruckIcon, CardIcon, StoreIcon, ShieldIcon];

function Index() {
  const maisVendidos = products.slice(0, 12);
  const suplementos = products.filter((p) =>
    ["nutricao-esportiva", "vitaminas-e-minerais", "senior"].includes(p.category),
  );
  const farmacinha = products.filter((p) =>
    ["medicamentos", "genericos"].includes(p.category),
  );

  return (
    <SiteLayout>
      <CategoryCarousel />

      <div className="pt-10 md:pt-5">
        <BannerCarousel banners={bannersTop} label="Campanhas em destaque" />
      </div>

      <p className="container-site py-8 text-center text-[22px] font-bold leading-snug md:py-8">
        Sua Farmácia online confiável! Encontre medicamentos e tudo para a sua saúde e bem-estar,
        com entrega rápida, as melhores marcas, os melhores preços e um atendimento de qualidade.
      </p>

      <section className="bg-surface py-6" aria-label="Benefícios">
        <div className="container-site grid grid-cols-2 gap-x-3 gap-y-5 lg:grid-cols-4 lg:gap-6">
          {[
            { title: "Entrega rápida", text: "Prazos conforme configuração da loja.", link: "Ver condições" },
            { title: "Parcelamento", text: "Condições definidas pelo lojista.", link: "Formas de pagamento" },
            { title: "Retire na loja", text: "Compre pelo site e retire na unidade.", link: "Ver lojas" },
            { title: "Compra segura", text: "Políticas de privacidade do projeto.", link: "Ver políticas" },
          ].map((b, i) => {
            const Icon = benefitIcons[i]!;
            return (
              <div key={b.title} className="flex min-w-0 items-start gap-2 md:gap-3">
                <Icon className="h-8 w-8 shrink-0 text-brand md:h-9 md:w-9" />
                <div className="min-w-0">
                  <p className="font-bold">{b.title}</p>
                  <p className="text-sm text-muted-foreground">{b.text}</p>
                  <a href="#" className="text-sm text-brand underline">
                    {b.link}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <ProductShelf title="Mais vendidos" products={maisVendidos} />
      <ProductShelf title="Suplementos" products={suplementos} />

      <BannerCarousel banners={bannersMiddle} label="Campanhas institucionais" />

      <ProductShelf title="Farmacinha" products={farmacinha} />

      <section className="container-site py-8" aria-label="Depoimentos dos Clientes">
        <h2 className="text-[22px] font-bold">Depoimentos dos Clientes</h2>
        <p className="mt-2 text-center text-muted-foreground">
          Confira as opiniões de clientes satisfeitos
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-md border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground"
            >
              Espaço reservado para avaliações reais da sua operação. As opiniões exibidas na loja
              de referência não são reproduzidas aqui; conecte seu widget de avaliações.
            </div>
          ))}
        </div>
      </section>

      <section className="container-site py-8" aria-label="As marcas mais procuradas">
        <h2 className="mb-4 text-[22px] font-bold">As marcas mais procuradas</h2>
        <Carousel label="Marcas" step={460} className="items-center gap-6 px-6">
          {brands.map((b) => (
            <img
              key={b.name}
              src={b.image}
              alt={b.name}
              loading="lazy"
              className="h-[90px] w-[150px] shrink-0 snap-start object-contain"
            />
          ))}
        </Carousel>
      </section>

      <section className="bg-surface py-10">
        <div className="container-site space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-[22px] font-bold text-foreground">
            Farmácia online com tudo para a sua saúde
          </h2>
          <p>
            Reúna em um só lugar medicamentos, genéricos, dermocosméticos, nutrição e cuidados
            pessoais. Este texto editorial é configurável e deve refletir o conteúdo do titular do
            projeto.
          </p>
          <h3 className="text-base font-bold text-foreground">Navegue por categoria</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {collections.map((c) => (
              <Link key={c.slug} to="/$slug" params={{ slug: c.slug }} className="text-brand underline">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PromoModal />
    </SiteLayout>
  );
}
