import { Link } from "@tanstack/react-router";
import { collections } from "@/data/site";
import { Carousel } from "./Carousel";

export function CategoryCarousel() {
  return (
    <section
      className="rounded-b-[30px] bg-brand py-3 text-primary-foreground md:rounded-b-[60px] md:py-6"
      aria-label="Coleções em destaque"
    >
      <div className="container-site">
        <Carousel label="Coleções" step={360} className="gap-1 px-4 md:gap-3 md:px-6" arrowClass="text-primary-foreground">
          {collections.map((c) => (
            <Link
              key={c.slug}
              to="/$slug"
              params={{ slug: c.slug }}
              className="flex w-[88px] shrink-0 snap-start flex-col items-center gap-2 text-center focus-visible:outline-2 focus-visible:outline-primary-foreground md:w-[112px]"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface p-2.5 transition-transform hover:scale-105 md:h-20 md:w-20 md:p-3">
                <img src={c.image} alt="" className="h-full w-full object-contain" />
              </span>
              <span className="text-[12px] leading-tight md:text-[13px]">{c.label}</span>
            </Link>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
