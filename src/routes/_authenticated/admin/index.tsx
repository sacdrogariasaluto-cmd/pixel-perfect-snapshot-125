import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getDashboard } from "@/lib/admin.functions";
import { brl, Card, dateTime, Metric, StatusBadge, STATUS } from "@/components/admin/ui";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: DashboardPage,
});

const RANGES = [
  { days: 7, label: "7 dias" },
  { days: 30, label: "30 dias" },
  { days: 90, label: "90 dias" },
  { days: 365, label: "12 meses" },
];

const PAYMENT_LABEL: Record<string, string> = { pix: "Pix", cartao: "Cartão de crédito" };

function DashboardPage() {
  const [days, setDays] = useState(30);
  const load = useServerFn(getDashboard);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard", days],
    queryFn: () => load({ data: { days } }),
  });

  if (isLoading || !data) return <p className="text-sm text-muted-foreground">Carregando indicadores…</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Faturamento</h1>
        <div className="flex gap-1 rounded-full border border-border bg-surface p-1">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                days === r.days ? "bg-brand text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Faturamento" value={brl(data.revenue)} change={data.revenueChange} hint="vs. período anterior" />
        <Metric label="Pedidos" value={String(data.orders)} change={data.ordersChange} hint="vs. período anterior" />
        <Metric label="Ticket médio" value={brl(data.ticket)} change={data.ticketChange} hint="vs. período anterior" />
        <Metric label="Clientes" value={String(data.customers)} hint="compradores únicos" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Itens vendidos" value={String(data.unitsSold)} />
        <Metric label="Itens por pedido" value={data.itemsPerOrder.toFixed(2)} />
        <Metric label="Frete arrecadado" value={brl(data.shipping)} />
        <Metric label="Descontos" value={brl(data.discounts)} hint={`${data.canceled} cancelados`} />
      </div>

      <Card title="Faturamento por dia">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.series}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} width={70} tickFormatter={(v) => brl(Number(v))} />
              <Tooltip formatter={(v: number) => brl(v)} labelFormatter={(l) => `Dia ${l}`} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-brand)" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Pedidos por dia">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.series}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={30} />
                <Tooltip />
                <Bar dataKey="orders" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Produtos mais vendidos">
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem vendas no período.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.topProducts.map((p) => (
                <li key={p.name} className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0">
                  <span className="line-clamp-1">{p.name}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {p.qty} un · <strong className="text-foreground">{brl(p.revenue)}</strong>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Situação dos pedidos">
          <ul className="space-y-2 text-sm">
            {STATUS.map((s) => (
              <li key={s.id} className="flex items-center justify-between">
                <StatusBadge status={s.id} />
                <span className="font-semibold">{data.statusCount[s.id] ?? 0}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Formas de pagamento">
          <ul className="space-y-2 text-sm">
            {Object.entries(data.paymentCount).map(([method, v]) => (
              <li key={method} className="flex items-center justify-between">
                <span>{PAYMENT_LABEL[method] ?? method}</span>
                <span className="text-muted-foreground">
                  {v.count} · <strong className="text-foreground">{brl(v.revenue)}</strong>
                </span>
              </li>
            ))}
            {Object.keys(data.paymentCount).length === 0 ? (
              <li className="text-muted-foreground">Sem pagamentos no período.</li>
            ) : null}
          </ul>
        </Card>

        <Card title="Últimos pedidos">
          <ul className="space-y-2 text-sm">
            {data.latest.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-2">
                <span className="min-w-0">
                  <strong>{o.code}</strong>
                  <span className="block truncate text-xs text-muted-foreground">
                    {o.customer_name} · {dateTime(o.created_at)}
                  </span>
                </span>
                <span className="shrink-0 font-semibold">{brl(o.total)}</span>
              </li>
            ))}
            {data.latest.length === 0 ? <li className="text-muted-foreground">Nenhum pedido ainda.</li> : null}
          </ul>
        </Card>
      </div>
    </div>
  );
}
