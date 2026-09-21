import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SearchIcon } from "./Icons";
import { products } from "@/data/products";
import { brl } from "@/lib/cart";

const normalize = (v: string) =>
  v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function SearchBox({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = normalize(term.trim());
    if (q.length < 2) return [];
    return products
      .filter((p) => normalize(`${p.name} ${p.brand} ${p.category}`).includes(q))
      .slice(0, 6);
  }, [term]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (q: string) => {
    setOpen(false);
    void navigate({ to: "/busca", search: { q, ordem: "relevancia" } });
  };

  const isMobile = variant === "mobile";
  const id = isMobile ? "busca-mobile" : "busca";

  return (
    <div
      ref={boxRef}
      className={isMobile ? "relative px-4 pb-3 md:hidden" : "relative ml-2 hidden w-[350px] md:block"}
    >
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const q = term.trim();
          if (q) go(q);
        }}
      >
        <label className="sr-only" htmlFor={id}>Buscar produtos</label>
        <input
          id={id}
          value={term}
          autoComplete="off"
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="O que você está buscando?"
          className={`w-full rounded-full border border-border bg-surface pl-5 pr-12 outline-none placeholder:text-muted-foreground focus:border-brand ${
            isMobile ? "h-[51px] text-[15px]" : "h-11 text-base"
          }`}
        />
        <button
          type="submit"
          aria-label="Buscar"
          className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand ${
            isMobile ? "right-9 -mt-1.5" : "right-4"
          }`}
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <ul
          className={`absolute z-50 mt-1 max-h-[380px] overflow-auto rounded-2xl border border-border bg-surface py-2 shadow-lg ${
            isMobile ? "left-4 right-4" : "left-0 right-0"
          }`}
        >
          {suggestions.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setOpen(false);
                  void navigate({ to: "/$slug/p", params: { slug: p.slug } });
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted"
              >
                <img src={p.image} alt="" className="h-10 w-10 shrink-0 object-contain" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] leading-tight">{p.name}</span>
                  <span className="block text-[13px] font-bold text-brand">{brl(p.pixPrice)}</span>
                </span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(term.trim())}
              className="w-full px-3 py-2 text-left text-[13px] font-bold text-brand hover:bg-muted"
            >
              Ver todos os resultados para “{term.trim()}”
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
