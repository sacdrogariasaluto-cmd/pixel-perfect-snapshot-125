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
    <section className="container-site relative" aria-label={label} aria-roledescription="carrossel">
      <div className="overflow-hidden rounded-xl bg-surface">
        <img
        src={banners[i]?.image}
        alt={banners[i]?.alt ?? ""}
        width={1130}
        height={300}

          className="aspect-[1130/300] w-full object-cover"
        />
      </div>
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label={`${label}: anterior`}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-neutral-800 hover:opacity-70"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label={`${label}: próximo`}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-neutral-800 hover:opacity-70"
      >
        <ChevronRight className="h-7 w-7" />
      </button>
    </section>
  );
}
