import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/rastrear")({
  head: () => ({
    meta: [
      { title: "Rastrear pedido — Farmácia Palmas" },
      {
        name: "description",
        content: "Acompanhe o status do seu pedido da Farmácia Palmas com o número do pedido.",
      },
      { property: "og:title", content: "Rastrear pedido — Farmácia Palmas" },
      {
        property: "og:description",
        content: "Acompanhe o status do seu pedido com o número do pedido.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RastrearPage,
});

type StoredOrder = {
  id: string;
  createdAt: string;
  delivery?: { label?: string; eta?: string; address?: { city?: string; uf?: string } };
  payment?: { method?: string };
  totals?: { total?: number };
};

function loadLastOrder(): StoredOrder | null {
  try {
    const raw = localStorage.getItem("vc-order-v1");
    return raw ? (JSON.parse(raw) as StoredOrder) : null;
  } catch {
    return null;
  }
}

const steps = [
  "Pedido confirmado",
  "Em separação",
  "Enviado",
  "Saiu para entrega",
  "Entregue",
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function RastrearPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<StoredOrder | null | "not-found">(null);

  function search(e: React.FormEvent) {
    e.preventDefault();
    const normalized = code.trim().toUpperCase();
    const order = loadLastOrder();
    if (order && order.id.toUpperCase() === normalized) {
      setResult(order);
    } else {
      setResult("not-found");
    }
  }

  // Progresso simulado com base no tempo desde a compra (máx. 1 dia = em trânsito)
  function currentStep(order: StoredOrder) {
    const hours = (Date.now() - new Date(order.createdAt).getTime()) / 3_600_000;
    if (hours < 2) return 1;
    if (hours < 24) return 2;
    return 3;
  }

  return (
    <SiteLayout>
      <div className="container-site py-10">
        <h1 className="text-2xl font-bold text-foreground">Rastrear pedido</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Digite o número do pedido (ex.: VC12345678) que você recebeu na confirmação da compra.
        </p>

        <form onSubmit={search} className="mt-6 flex max-w-md gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Número do pedido"
            aria-label="Número do pedido"
            className="w-full rounded-full border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-brand px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
          >
            Buscar
          </button>
        </form>

        {result === "not-found" && (
          <div className="mt-8 max-w-md rounded-2xl bg-surface p-6 text-sm text-muted-foreground">
            Não encontramos nenhum pedido com esse número neste dispositivo. Confira o código ou
            entre em contato com a{" "}
            <Link to="/ajuda" className="text-brand underline">
              central de atendimento
            </Link>
            .
          </div>
        )}

        {result && result !== "not-found" && (
          <div className="mt-8 max-w-xl rounded-2xl bg-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Pedido</p>
                <p className="text-lg font-bold text-foreground">{result.id}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Feito em {formatDate(result.createdAt)}</p>
                {result.totals?.total != null && (
                  <p>
                    Total:{" "}
                    <span className="font-semibold text-foreground">
                      R$ {result.totals.total.toFixed(2).replace(".", ",")}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <ol className="mt-6 space-y-0">
              {steps.map((label, i) => {
                const step = currentStep(result);
                const done = i <= step;
                return (
                  <li key={label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold " +
                          (done ? "bg-buy text-primary-foreground" : "bg-muted text-muted-foreground")
                        }
                      >
                        {i + 1}
                      </span>
                      {i < steps.length - 1 && (
                        <span
                          className={
                            "h-8 w-0.5 " + (i < step ? "bg-buy" : "bg-muted")
                          }
                        />
                      )}
                    </div>
                    <div className="pb-2">
                      <p
                        className={
                          "text-sm font-semibold " +
                          (done ? "text-foreground" : "text-muted-foreground")
                        }
                      >
                        {label}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {result.delivery && (
              <div className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
                <p>
                  Entrega: <span className="text-foreground">{result.delivery.label ?? "—"}</span>
                  {result.delivery.eta ? ` · ${result.delivery.eta}` : ""}
                </p>
                {result.delivery.address?.city && (
                  <p>
                    {result.delivery.address.city} - {result.delivery.address.uf}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
