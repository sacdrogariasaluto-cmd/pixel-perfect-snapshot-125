import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LockIcon } from "./Icons";
import { PaymentFlags } from "./Footer";
import { company } from "@/data/site";

function SecureBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LockIcon className="h-5 w-5" />
      <span className="text-[11px] leading-tight font-bold uppercase tracking-wide">
        Pagamento
        <br />
        100% seguro
      </span>
    </span>
  );
}

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function OfferTimer() {
  const [left, setLeft] = useState(20 * 60);
  useEffect(() => {
    const id = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  return (
    <p className="flex items-center justify-center gap-1.5 text-sm font-bold">
      <span className="font-normal">Oferta termina em:</span>
      <span className="text-xl">{pad(h)}</span>
      <span className="text-xs font-normal">h</span>
      <span>:</span>
      <span className="text-xl">{pad(m)}</span>
      <span className="text-xs font-normal">m</span>
      <span>:</span>
      <span className="text-xl">{pad(s)}</span>
      <span className="text-xs font-normal">s</span>
    </p>
  );
}

export function CheckoutHeader() {
  return (
    <header className="bg-checkout text-checkout-foreground">
      <div className="container-site flex h-[70px] items-center justify-between gap-4">
        <Link to="/" aria-label="Página inicial">
          <img src="/img/a18dca27-logo.svg" alt="Drogaria Vera Cruz" className="h-9 w-auto brightness-0 invert" />
        </Link>
        <SecureBadge />
      </div>
      <div className="pb-5">
        <OfferTimer />
      </div>
    </header>
  );
}

export function CheckoutFooter() {
  return (
    <footer className="mt-10 bg-checkout py-8 text-center text-sm text-checkout-foreground">
      <div className="container-site space-y-1">
        <p className="font-bold">{company.name} | Todos os direitos reservados</p>
        <p className="text-xs opacity-90">{company.address}</p>
        <p className="text-xs opacity-90">
          © {new Date().getFullYear()} {company.name} — CNPJ: {company.cnpj}
        </p>
        <p className="text-xs opacity-90">Atendimento: {company.sac}</p>

        <p className="pt-4 pb-2">Formas de Pagamento</p>
        <div className="flex justify-center">
          <PaymentFlags />
        </div>

        <div className="flex justify-center pt-4">
          <SecureBadge className="opacity-90" />
        </div>
      </div>
    </footer>
  );
}
