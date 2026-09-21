import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckoutFooter, CheckoutHeader } from "@/components/CheckoutHeader";
import { brl } from "@/lib/cart";
import type { CartLine } from "@/lib/cart";

export const Route = createFileRoute("/checkout/pedido")({
  head: () => ({
    meta: [
      { title: "Pedido confirmado — farmácia online" },
      { name: "description", content: "Confirmação do seu pedido com resumo dos itens, entrega e pagamento." },
      { property: "og:title", content: "Pedido confirmado" },
      { property: "og:description", content: "Resumo do pedido realizado na loja." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderPage,
});

type Order = {
  id: string;
  createdAt: string;
  customer: { email: string; name: string; phone: string; cpf: string };
  delivery: {
    type: string;
    label: string;
    eta: string;
    price: number;
    address?: {
      cep: string;
      street: string;
      number: string;
      complement: string;
      district: string;
      city: string;
      uf: string;
    };
  };
  payment: { method: string; parcelas?: number; last4?: string; troco?: string };
  items: CartLine[];
  totals: { products: number; shipping: number; total: number };
};

const PAYMENT_LABEL: Record<string, string> = {
  pix: "Pix",
  cartao: "Cartão de crédito",
  dinheiro: "Pagamento na entrega",
};

function OrderPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("vc-order-v1");
      if (raw) setOrder(JSON.parse(raw) as Order);
    } catch {
      /* sem pedido salvo */
    }
    setLoaded(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CheckoutHeader />
      <main className="container-site flex-1 py-8">
        {!loaded ? null : !order ? (
          <div className="rounded-md bg-surface p-12 text-center">
            <h1 className="text-2xl font-bold">Nenhum pedido encontrado</h1>
            <Link to="/" className="mt-3 inline-block text-brand underline">
              Voltar para a loja
            </Link>
          </div>
        ) : (
          <div className="mx-auto max-w-[760px] space-y-4">
            <div className="rounded-md bg-surface p-6 text-center">
              <p className="text-3xl">✅</p>
              <h1 className="mt-2 text-2xl font-bold">Pedido confirmado!</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Número do pedido <strong>{order.id}</strong> — enviamos a confirmação para {order.customer.email}.
              </p>
            </div>

            {order.payment.method === "pix" && (
              <div className="rounded-md bg-surface p-5">
                <h2 className="font-bold">Pague com Pix</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  A geração do código Pix depende de integração com um meio de pagamento. Assim que
                  ela for configurada, o código aparece aqui automaticamente.
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <section className="rounded-md bg-surface p-5 text-sm">
                <h2 className="mb-2 font-bold">Entrega</h2>
                <p>{order.delivery.label} — {order.delivery.eta}</p>
                {order.delivery.address && (
                  <p className="mt-1 text-muted-foreground">
                    {order.delivery.address.street}, {order.delivery.address.number}
                    {order.delivery.address.complement ? ` — ${order.delivery.address.complement}` : ""}
                    <br />
                    {order.delivery.address.district} — {order.delivery.address.city}/{order.delivery.address.uf}
                    <br />
                    CEP {order.delivery.address.cep}
                  </p>
                )}
              </section>
              <section className="rounded-md bg-surface p-5 text-sm">
                <h2 className="mb-2 font-bold">Pagamento</h2>
                <p>{PAYMENT_LABEL[order.payment.method] ?? order.payment.method}</p>
                {order.payment.last4 && (
                  <p className="text-muted-foreground">
                    Final {order.payment.last4} — {order.payment.parcelas}x
                  </p>
                )}
                {order.payment.troco && (
                  <p className="text-muted-foreground">Troco para {order.payment.troco}</p>
                )}
              </section>
            </div>

            <section className="rounded-md bg-surface p-5">
              <h2 className="mb-3 font-bold">Itens</h2>
              <ul className="divide-y divide-border">
                {order.items.map((l) => (
                  <li key={l.slug} className="flex items-center gap-3 py-3">
                    <img src={l.image} alt="" className="h-12 w-12 object-contain" />
                    <p className="flex-1 text-sm">{l.name}</p>
                    <span className="text-xs text-muted-foreground">{l.qty}x</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
                <p className="flex justify-between">
                  <span>Produtos</span>
                  <span>{brl(order.totals.products)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Frete</span>
                  <span>{order.totals.shipping === 0 ? "Grátis" : brl(order.totals.shipping)}</span>
                </p>
                <p className="flex justify-between text-lg">
                  <strong>Total</strong>
                  <strong className="text-buy">{brl(order.totals.total)}</strong>
                </p>
              </div>
            </section>

            <p className="text-center text-xs text-muted-foreground">
              Este pedido é uma simulação salva apenas neste navegador. O envio para a loja depende
              de integração com um sistema de pedidos.
            </p>
            <Link
              to="/"
              className="mx-auto block max-w-[280px] rounded-[10px] bg-brand py-3 text-center text-sm font-bold uppercase text-primary-foreground"
            >
              Continuar comprando
            </Link>
          </div>
        )}
      </main>
      <CheckoutFooter />
    </div>
  );
}
