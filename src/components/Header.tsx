import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { BasketIcon, HeadsetIcon, MenuIcon, PinIcon, UserIcon } from "./Icons";
import { DepartmentMenu } from "./DepartmentMenu";
import { SearchBox } from "./SearchBox";
import { useCart } from "@/lib/cart";
import { Button } from "./ui/button";

export function Header() {
  const [menu, setMenu] = useState(false);
  const { count } = useCart();


  return (
    <header className="sticky top-0 z-50 bg-surface shadow-[0_1px_0_rgba(0,0,0,0.08)]">
      <div className="container-site relative grid h-[62px] grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2 md:flex md:h-[74px] md:gap-4">
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-haspopup="menu"
            aria-label="Abrir menu"
            className="md:w-auto md:px-2"
          >
            <MenuIcon className="h-5 w-5" />
            <span className="hidden text-[15px] font-bold md:inline">MENU</span>
          </Button>
          <DepartmentMenu open={menu} onClose={() => setMenu(false)} />
        </div>

        <Link to="/" className="min-w-0 justify-self-center md:shrink-0" aria-label="Página inicial">
          <img src="/img/a18dca27-logo.svg" alt="Drogaria Vera Cruz" className="h-[30px] w-auto md:h-[42px]" />
        </Link>

        <SearchBox />


        <nav className="ml-auto flex items-center gap-5 justify-self-end text-[13px]">
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
          <Link to="/checkout/login" className="hidden items-center gap-2 hover:text-brand md:flex">
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
      <SearchBox variant="mobile" />

    </header>
  );
}
