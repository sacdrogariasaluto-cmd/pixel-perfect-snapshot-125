import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays, CircleHelp, TrendingDown, TrendingUp } from "lucide-react";
import { getDashboard } from "@/lib/admin.functions";
import { brl, Card, STATUS } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Drogaria Vera Cruz" },
      { name: "description", content: "Indicadores de vendas e operação da Drogaria Vera Cruz." },
      { property: "og:title", content: "Dashboard — Drogaria Vera Cruz" },
      { property: "og:description", content: "Visão geral de vendas e pedidos da loja." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

const RANGES = [
  { days: 1, label: "Hoje" },
  { days: 7, label: "Semana" },
  { days: 30, label: "Mês" },
  { days: 365, label: "Este ano" },
];

const PAYMENT_LABEL: Record<string, string> = { pix: "Pix", cartao: "Cartão" };
const CHART_COLORS = ["var(--color-brand)", "var(--color-buy)", "var(--color-chart-4)", "var(--color-chart-3)"];

function Trend({ value }: { value: number | null }) {
  if (typeof value !== "number") return <span className="text-muted-foreground">sem comparativo</span>;
  const positive = value >= 0;
  return (
    <span className={positive ? "inline-flex items-center gap-1 font-semibold text-buy" : "inline-flex items-center gap-1 font-semibold text-promo"}>
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function ValueCard({
  title,
  value,
  change,
  children,
}: {
  title: string;
  value: string;
  change?: number | null;
  children?: React.ReactNode;
}) {
  return (
    <section className="min-h-48 rounded-md border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase text-muted-foreground">{title}</p>
        <CircleHelp className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="mt-1 flex items-end gap-2">
        <strong className="text-xl text-foreground">{value}</strong>
        {change !== undefined ? <span className="pb-0.5 text-[11px]"><Trend value={change} /></span> : null}
      </div>
      {children}
    </section>
  );
}

function EmptyMetric({ title, text }: { title: string; text: string }) {
  return (
    <Card title={title}>
      <div className="flex min-h-28 items-center justify-center text-center text-xs leading-5 text-muted-foreground">{text}</div>
    </Card>
  );
}

function DashboardPage() {
  const [days, setDays] = useState(30);
  const load = useServerFn(getDashboard);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard", days],
    queryFn: () => load({ data: { days } }),
  });

  const paymentData = useMemo(
    () => Object.entries(data?.paymentCount ?? {}).map(([name, item]) => ({ name: PAYMENT_LABEL[name] ?? name, value: item.count })),
    [data],
  );
  const installmentData = useMemo(
    () => Object.entries(data?.installmentCount ?? {}).map(([name, value]) => ({ name, value })),
    [data],
  );
  const stateData = useMemo(
    () => Object.entries(data?.stateCount ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 5),
    [data],
  );

  if (isLoading || !data) {
    return <div className="py-16 text-center text-sm text-muted-foreground">Carregando indicadores…</div>;
  }

  const pixCount = data.paymentCount.pix?.count ?? 0;
  const pixShare = data.orders ? (pixCount / data.orders) * 100 : 0;
  const statusData = STATUS.map((status) => ({ name: status.label, value: data.statusCount[status.id] ?? 0 }));
  const maxState = Math.max(1, ...stateData.map(([, value]) => value));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Início / Dashboard</p>
          <h1 className="mt-1 text-2xl font-bold">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Monitore o desempenho das suas vendas</p>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1 shadow-sm">
          {RANGES.map((range) => (
            <Button
              key={range.days}
              variant={days === range.days ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2.5 text-[11px]"
              onClick={() => setDays(range.days)}
            >
              {range.label}
            </Button>
          ))}
          <CalendarDays className="mx-1 h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <ValueCard title="Vendas totais" value={brl(data.revenue)} change={data.revenueChange}>
          <div className="mt-3 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.series}>
                <defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-buy)" stopOpacity={0.38} /><stop offset="100%" stopColor="var(--color-buy)" stopOpacity={0.06} /></linearGradient></defs>
                <XAxis dataKey="label" tick={{ fontSize: 9 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => brl(value)} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-buy)" fill="url(#salesFill)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ValueCard>

        <ValueCard title="Ticket médio" value={brl(data.ticket)} change={data.ticketChange}>
          <div className="mt-3 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.series.map((entry) => ({ ...entry, ticket: entry.orders ? entry.revenue / entry.orders : 0 }))}>
                <defs><linearGradient id="ticketFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0.05} /></linearGradient></defs>
                <XAxis dataKey="label" tick={{ fontSize: 9 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => brl(value)} />
                <Area type="monotone" dataKey="ticket" stroke="var(--color-brand)" fill="url(#ticketFill)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ValueCard>

        <ValueCard title="Pedidos" value={String(data.orders)} change={data.ordersChange}>
          <div className="mt-3 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.series}>
                <XAxis dataKey="label" tick={{ fontSize: 9 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="orders" fill="var(--color-brand)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ValueCard>

        <ValueCard title="Participação do Pix" value={`${pixShare.toFixed(1)}%`}>
          <p className="mt-1 text-[11px] text-muted-foreground">{pixCount} de {data.orders} pedidos no período</p>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-buy" style={{ width: `${Math.min(100, pixShare)}%` }} /></div>
          <div className="mt-8 flex justify-between text-[11px] text-muted-foreground"><span>Pix</span><span>Outros pagamentos</span></div>
        </ValueCard>

        <ValueCard title="Clientes" value={String(data.customers)}>
          <p className="mt-1 text-[11px] text-muted-foreground">compradores únicos no período</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-md bg-muted p-3"><dt className="text-muted-foreground">Itens vendidos</dt><dd className="mt-1 text-lg font-bold">{data.unitsSold}</dd></div>
            <div className="rounded-md bg-muted p-3"><dt className="text-muted-foreground">Itens/pedido</dt><dd className="mt-1 text-lg font-bold">{data.itemsPerOrder.toFixed(1)}</dd></div>
          </dl>
        </ValueCard>

        <Card title="Andamento dos pedidos">
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 9 }} width={20} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="var(--color-buy)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <EmptyMetric title="Lucro líquido" text="Cadastre os custos dos produtos para calcular o lucro líquido." />
        <EmptyMetric title="Conversão do checkout" text="Conecte os eventos de visita e abandono para acompanhar a conversão." />
        <EmptyMetric title="Carrinhos abandonados" text="O rastreamento de sessões ainda não está habilitado." />

        <Card title="Formas de pagamento">
          {paymentData.length ? (
            <div className="flex h-40 items-center">
              <ResponsiveContainer width="58%" height="100%"><PieChart><Pie data={paymentData} dataKey="value" innerRadius={28} outerRadius={52} paddingAngle={2}>{paymentData.map((entry, index) => <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
              <ul className="space-y-2 text-xs">{paymentData.map((entry, index) => <li key={entry.name} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />{entry.name} <strong>{entry.value}</strong></li>)}</ul>
            </div>
          ) : <p className="py-14 text-center text-xs text-muted-foreground">Sem pagamentos no período.</p>}
        </Card>

        <Card title="Parcelamentos">
          {installmentData.length ? (
            <div className="flex h-40 items-center">
              <ResponsiveContainer width="58%" height="100%"><PieChart><Pie data={installmentData} dataKey="value" innerRadius={30} outerRadius={52}>{installmentData.map((entry, index) => <Cell key={entry.name} fill={CHART_COLORS[(index + 1) % CHART_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
              <ul className="space-y-2 text-xs">{installmentData.map((entry, index) => <li key={entry.name} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS[(index + 1) % CHART_COLORS.length] }} />{entry.name} <strong>{entry.value}</strong></li>)}</ul>
            </div>
          ) : <p className="py-14 text-center text-xs text-muted-foreground">Sem parcelamentos no período.</p>}
        </Card>

        <Card title="Pedidos cancelados">
          <div className="flex min-h-36 flex-col items-center justify-center">
            <strong className="text-4xl text-promo">{data.canceled}</strong>
            <span className="mt-2 text-xs text-muted-foreground">no período selecionado</span>
          </div>
        </Card>

        <Card title="Vendas por estado">
          {stateData.length ? <ol className="space-y-3">{stateData.map(([uf, value], index) => <li key={uf} className="grid grid-cols-[18px_26px_1fr_30px] items-center gap-2 text-xs"><strong>{index + 1}</strong><span>{uf}</span><span className="h-2 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-brand" style={{ width: `${(value / maxState) * 100}%` }} /></span><strong className="text-right">{value}</strong></li>)}</ol> : <p className="py-14 text-center text-xs text-muted-foreground">Sem estados no período.</p>}
        </Card>

        <Card title="Top produtos">
          {data.topProducts.length ? <ol className="space-y-2">{data.topProducts.slice(0, 5).map((product, index) => <li key={`${product.name}-${index}`} className="grid grid-cols-[18px_34px_1fr_auto] items-center gap-2 text-xs"><strong>{index + 1}</strong><span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded border border-border bg-background">{product.image ? <img src={product.image} alt="" className="h-full w-full object-contain" /> : null}</span><span className="line-clamp-2">{product.name}</span><strong>{product.qty}</strong></li>)}</ol> : <p className="py-14 text-center text-xs text-muted-foreground">Sem produtos vendidos.</p>}
        </Card>

        <Card title="Resumo financeiro">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2"><dt className="text-muted-foreground">Frete arrecadado</dt><dd className="font-bold">{brl(data.shipping)}</dd></div>
            <div className="flex justify-between border-b border-border pb-2"><dt className="text-muted-foreground">Descontos</dt><dd className="font-bold text-promo">-{brl(data.discounts)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Faturamento</dt><dd className="font-bold text-buy">{brl(data.revenue)}</dd></div>
          </dl>
        </Card>
      </div>
    </div>
  );
}