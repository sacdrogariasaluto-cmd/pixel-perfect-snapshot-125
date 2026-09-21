import { Carousel } from "./Carousel";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/products";

export function ProductShelf({ title, products }: { title: string; products: Product[] }) {
  return (
    <section className="container-site py-6 md:py-8">
      <h2 className="mb-4 text-[22px] font-bold">{title}</h2>
      <Carousel label={title} step={360} className="gap-2 px-0 md:gap-3 md:px-6">
        {products.map((p) => (
          <div key={p.id} className="w-[calc((100vw-2.5rem)/2)] max-w-[210px] shrink-0 snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </Carousel>
    </section>
  );
}
