import { Link } from "@tanstack/react-router";
import { collections } from "@/data/site";
import { Carousel } from "./Carousel";

export function CategoryCarousel() {
  return (
    <section
      className="rounded-b-[60px] bg-brand py-6 text-white"
      aria-label="Coleções em destaque"
    >
      <div className="container-site">
        <Carousel label="Coleções" step={460} className="gap-3 px-6" arrowClass="text-white">
          {collections.map((c) => (
            <Link
              key={c.slug}
              to="/$slug"
              params={{ slug: c.slug }}
              className="flex w-[112px] shrink-0 snap-start flex-col items-center gap-2 text-center focus-visible:outline-2 focus-visible:outline-white"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white p-3 transition-transform hover:scale-105">
                <img src={c.image} alt="" className="h-full w-full object-contain" />
              </span>
              <span className="text-[13px] leading-tight">{c.label}</span>
            </Link>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
