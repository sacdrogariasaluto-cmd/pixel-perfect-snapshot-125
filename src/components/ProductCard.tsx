import { Link } from "@tanstack/react-router";
import { Stars } from "./Icons";
import { brl } from "@/lib/cart";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { Button } from "./ui/button";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <article className="relative flex h-full flex-col rounded-md bg-surface p-3 md:p-4">
      {product.discount > 0 && (
        <span className="absolute right-0 top-0 rounded-bl-md rounded-tr-md bg-promo px-2 py-1 text-[12px] font-bold text-promo-foreground">
          {product.discount}% <span className="font-normal">off</span>
        </span>
      )}
      <Link
        to="/$slug/p"
        params={{ slug: product.slug }}
        className="flex h-[145px] items-center justify-center focus-visible:outline-2 focus-visible:outline-brand md:h-[190px]"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-h-[135px] w-full object-contain md:max-h-[180px]"
        />
      </Link>
      <Link
        to="/$slug/p"
        params={{ slug: product.slug }}
        className="line-clamp-2-fixed mt-3 min-h-[38px] text-sm text-foreground hover:text-brand"
      >
        {product.name}
      </Link>
      <div className="mt-2">
        <Stars value={product.rating} count={product.reviews} />
      </div>
      <div className="mt-3">
        {product.listPrice > product.cardPrice && (
          <p className="text-xs text-muted-foreground line-through">{brl(product.listPrice)}</p>
        )}
        <p className="text-lg font-bold text-brand md:text-xl">
          {brl(product.pixPrice)} <span className="text-xs font-normal">no pix</span>
        </p>
        <p className="text-xs text-muted-foreground">
          ou <strong className="text-foreground">{brl(product.cardPrice)}</strong> no cartão
        </p>
      </div>
      <Button
        type="button"
        onClick={() => add(product)}
        className="mt-3 h-10 w-full rounded-[10px] bg-buy text-[13px] font-bold uppercase text-primary-foreground hover:bg-buy-hover md:hidden"
        aria-label={`Adicionar ${product.name} ao carrinho`}
      >
        COMPRAR
      </Button>
    </article>
  );
}
