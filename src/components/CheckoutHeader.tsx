import { Link } from "@tanstack/react-router";
import { LockIcon } from "./Icons";

export function CheckoutHeader() {
  return (
    <header className="bg-surface">
      <div className="container-site flex h-[62px] items-center justify-between">
        <Link to="/" aria-label="Página inicial">
          <img src="/img/a18dca27-logo.svg" alt="Drogaria Vera Cruz" className="h-9 w-auto" />
        </Link>
        <span className="flex items-center gap-2 text-sm">
          <LockIcon className="h-5 w-5" />
          compra 100% segura
        </span>
      </div>
    </header>
  );
}

export function CheckoutFooter() {
  return (
    <footer className="py-8 text-center text-xs text-muted-foreground">
      @{new Date().getFullYear()} - Todos os direitos reservados
    </footer>
  );
}
