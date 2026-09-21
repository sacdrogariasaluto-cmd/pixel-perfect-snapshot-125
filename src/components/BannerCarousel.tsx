import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "./Icons";
import type { Banner } from "@/data/site";

export function BannerCarousel({ banners, label }: { banners: Banner[]; label: string }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((v) => (v + d + banners.length) % banners.length);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % banners.length), 7000);
    return () => clearInterval(t);
  }, [banners.length]);

  return (
    <section className="container-site relative pb-5" aria-label={label} aria-roledescription="carrossel">
      <div className="overflow-hidden rounded-md bg-surface md:rounded-xl">
        <img
        src={banners[i]?.image}
        alt={banners[i]?.alt ?? ""}
        width={1130}
        height={300}

           className="aspect-[3.75/1] w-full object-cover"
        />
      </div>
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label={`${label}: anterior`}
         className="absolute left-0 top-[calc(50%-10px)] -translate-y-1/2 p-2 text-foreground hover:opacity-70"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label={`${label}: próximo`}
         className="absolute right-0 top-[calc(50%-10px)] -translate-y-1/2 p-2 text-foreground hover:opacity-70"
      >
        <ChevronRight className="h-7 w-7" />
      </button>
      <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-2" aria-hidden="true">
        {banners.map((banner, index) => (
          <span key={banner.image} className={`h-2.5 w-2.5 rounded-full ${index === i ? "bg-foreground" : "bg-muted-foreground/70"}`} />
        ))}
      </div>
    </section>
  );
}
