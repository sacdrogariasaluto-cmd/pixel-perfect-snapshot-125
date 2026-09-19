import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { BasketIcon, HeadsetIcon, MenuIcon, PinIcon, SearchIcon, UserIcon } from "./Icons";
import { DepartmentMenu } from "./DepartmentMenu";
import { useCart } from "@/lib/cart";

export function Header() {
  const [menu, setMenu] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-surface shadow-[0_1px_0_rgba(0,0,0,0.08)]">
      <div className="container-site relative flex h-[74px] items-center gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded px-2 py-2 text-[15px] font-bold text-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-brand"
          >
            <MenuIcon className="h-5 w-5" />
            MENU
          </button>
          <DepartmentMenu open={menu} onClose={() => setMenu(false)} />
        </div>

        <Link to="/" className="shrink-0" aria-label="Página inicial">
          <img src="/img/a18dca27-logo.svg" alt="Drogaria Vera Cruz" className="h-[42px] w-auto" />
        </Link>

        <form
          className="relative ml-2 hidden w-[350px] md:block"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="sr-only" htmlFor="busca">
            Buscar produtos
          </label>
          <input
            id="busca"
            placeholder="O que você está buscando?"
            className="h-11 w-full rounded-full border border-border bg-surface pl-5 pr-12 text-base outline-none placeholder:text-muted-foreground focus:border-brand"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </form>

        <nav className="ml-auto flex items-center gap-5 text-[13px]">
          <span className="hidden items-center gap-2 lg:flex">
            <HeadsetIcon className="h-6 w-6" />
            <span className="leading-tight">
              Central de
              <br />
              Atendimento
            </span>
          </span>
          <span className="hidden items-center gap-2 sm:flex">
            <PinIcon className="h-6 w-6" />
            Lojas
          </span>
          <Link to="/checkout/login" className="flex items-center gap-2 hover:text-brand">
            <UserIcon className="h-6 w-6" />
            Entrar
          </Link>
          <Link
            to="/checkout/carrinho"
            className="relative flex items-center hover:text-brand"
            aria-label={`Carrinho com ${count} itens`}
          >
            <BasketIcon className="h-7 w-7" />
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-promo px-1 text-[11px] font-bold text-promo-foreground">
              {count}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
