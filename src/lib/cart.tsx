import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

export type CartLine = {
  slug: string;
  name: string;
  image: string;
  unitPrice: number; // preço no cartão (preço base do carrinho)
  pixPrice: number;
  listPrice: number;
  qty: number;
};

type CartCtx = {
  lines: CartLine[];
  add: (p: Product, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  savings: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "vc-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* estado inicial vazio */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* armazenamento indisponível */
    }
  }, [lines]);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
    const savings = lines.reduce((s, l) => s + Math.max(0, l.listPrice - l.unitPrice) * l.qty, 0);
    return {
      lines,
      count,
      subtotal,
      savings,
      open,
      setOpen,
      add: (p, qty = 1) => {
        setLines((prev) => {
          const found = prev.find((l) => l.slug === p.slug);
          if (found)
            return prev.map((l) => (l.slug === p.slug ? { ...l, qty: l.qty + qty } : l));
          return [
            ...prev,
            {
              slug: p.slug,
              name: p.name,
              image: p.image,
              unitPrice: p.cardPrice,
              pixPrice: p.pixPrice,
              listPrice: p.listPrice,
              qty,
            },
          ];
        });
        setOpen(true);
      },
      setQty: (slug, qty) =>
        setLines((prev) =>
          prev.map((l) => (l.slug === slug ? { ...l, qty: Math.max(1, qty) } : l)),
        ),
      remove: (slug) => setLines((prev) => prev.filter((l) => l.slug !== slug)),
      clear: () => setLines([]),
    };
  }, [lines, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart precisa estar dentro de CartProvider");
  return ctx;
}

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
