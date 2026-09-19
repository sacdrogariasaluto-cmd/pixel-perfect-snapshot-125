import { Carousel } from "./Carousel";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/products";

export function ProductShelf({ title, products }: { title: string; products: Product[] }) {
  return (
    <section className="container-site py-8">
      <h2 className="mb-4 text-[22px] font-bold">{title}</h2>
      <Carousel label={title} step={440} className="gap-3 px-6">
        {products.map((p) => (
          <div key={p.id} className="w-[210px] shrink-0 snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </Carousel>
    </section>
  );
}
