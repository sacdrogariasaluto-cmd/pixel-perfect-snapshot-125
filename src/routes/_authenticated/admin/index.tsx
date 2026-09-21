import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { CalendarDays, CircleHelp, TrendingDown, TrendingUp } from "lucide-react";
import { getDashboard } from "@/lib/admin.functions";
import { brl, Card, STATUS } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [
    { title: "Dashboard — Drogaria Vera Cruz" },
    { name: "description", content: "Indicadores de vendas e operação da Drogaria Vera Cruz." },
    { property: "og:title", content: "Dashboard — Drogaria Vera Cruz" },
    { property: "og:description", content: "Visão geral de vendas e pedidos da loja." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: DashboardPage,
});

const RANGES = [{ days: 1, label: "Hoje" }, { days: 2, label: "Ontem" }, { days: 7, label: "Semana" }, { days: 30, label: "Mês" }, { days: 365, label: "Este ano" }];
const PAYMENT_LABEL: Record<string, string> = { pix: "Pix", cartao: "Cartão" };
const COLORS = ["var(--color-buy)", "var(--color-brand)", "var(--color-chart-4)", "var(--color-chart-3)"];

function Trend({ value }: { value: number | null }) {
  if (typeof value !== "number") return <span className="text-muted-foreground">sem comparativo</span>;
  const up = value >= 0;
  return <span className={up ? "inline-flex items-center gap-1 font-semibold text-buy" : "inline-flex items-center gap-1 font-semibold text-promo"}>{up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{Math.abs(value).toFixed(1)}%</span>;
}

function MetricChart({ title, value, change, data, dataKey = "revenue" }: { title: string; value: string; change?: number | null; data: { label: string; revenue: number; orders: number }[]; dataKey?: "revenue" | "orders" }) {
  return <section className="h-44 rounded-md border border-border bg-surface p-3 shadow-sm">
    <div className="flex items-center justify-between"><p className="text-[9px] font-bold uppercase">{title}</p><CircleHelp className="h-3 w-3 text-muted-foreground" /></div>
    <div className="mt-1 flex items-end gap-2"><strong className="text-lg">{value}</strong>{change !== undefined && <span className="pb-0.5 text-[9px]"><Trend value={change} /></span>}</div>
    <div className="mt-2 h-[98px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><defs><linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-buy)" stopOpacity={0.35}/><stop offset="100%" stopColor="var(--color-buy)" stopOpacity={0.08}/></linearGradient></defs><XAxis dataKey="label" tick={{fontSize:7}} interval="preserveStartEnd" axisLine={false} tickLine={false}/><Tooltip/><Area type="monotone" dataKey={dataKey} stroke="var(--color-buy)" fill={`url(#fill-${dataKey})`} strokeWidth={1.5}/></AreaChart></ResponsiveContainer></div>
  </section>;
}

function EmptyCard({ title, value, note }: { title: string; value?: string; note: string }) {
  return <Card title={title}>{value && <strong className="text-lg">{value}</strong>}<div className="flex min-h-20 items-center justify-center text-center text-[10px] leading-4 text-muted-foreground">{note}</div></Card>;
}

function DashboardPage() {
  const [days, setDays] = useState(1);
  const load = useServerFn(getDashboard);
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-dashboard", days], queryFn: () => load({ data: { days } }), retry: 1 });
  const paymentData = useMemo(() => Object.entries(data?.paymentCount ?? {}).map(([name, item]) => ({ name: PAYMENT_LABEL[name] ?? name, value: item.count })), [data]);
  const installmentData = useMemo(() => Object.entries(data?.installmentCount ?? {}).map(([name, value]) => ({ name, value })), [data]);

  if (isLoading) return <div className="py-16 text-center text-sm text-muted-foreground">Carregando indicadores…</div>;
  if (error || !data) return <div className="rounded-md border border-promo/30 bg-promo/5 p-5 text-sm text-promo">Não foi possível carregar os indicadores. Atualize a página.</div>;

  const pix = data.paymentCount["pix"]?.count ?? 0;
  const pixShare = data.orders ? pix / data.orders * 100 : 0;
  const statusData = STATUS.slice(0, 5).map((s) => ({ name: s.label, value: data.statusCount[s.id] ?? 0 }));
  const states = Object.entries(data.stateCount).sort((a,b) => b[1]-a[1]).slice(0,5);
  const maxState = Math.max(1, ...states.map(([,v]) => v));

  return <div className="mx-auto max-w-[790px] space-y-3">
    <div className="flex items-end justify-between gap-3">
      <div><p className="text-[10px] text-muted-foreground">Início &nbsp;›&nbsp; Dashboard</p><h1 className="mt-1 text-xl font-bold">Dashboard</h1><p className="text-[10px] text-muted-foreground">Monitore o desempenho das suas vendas</p></div>
      <div className="flex items-center rounded-md border border-border bg-surface p-0.5 shadow-sm">{RANGES.map(r => <Button key={r.label} variant={days===r.days?"default":"ghost"} size="sm" className="h-6 px-2 text-[9px]" onClick={() => setDays(r.days)}>{r.label}</Button>)}<CalendarDays className="mx-1 h-3 w-3 text-muted-foreground"/></div>
    </div>

    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
      <MetricChart title="Vendas totais" value={brl(data.revenue)} change={data.revenueChange} data={data.series}/>
      <MetricChart title="Lucro líquido" value={brl(0)} data={data.series}/>
      <EmptyCard title="Anúncios" value={brl(0)} note="Sem investimento registrado"/>
      <MetricChart title="Ticket médio" value={brl(data.ticket)} change={data.ticketChange} data={data.series}/>
      <MetricChart title="Conversão do Pix" value={`${pixShare.toFixed(2)}%`} data={data.series} dataKey="orders"/>
      <Card title="Conversão do checkout"><strong className="text-lg">0,00%</strong><div className="mt-7 flex h-16 items-end justify-around gap-2">{[70,92,55,38].map((h,i)=><div key={i} className="flex w-full flex-col items-center gap-1"><span className={`w-full rounded-t ${i===1?"bg-brand":"bg-buy/60"}`} style={{height:`${h}%`}}/><small className="text-[7px] text-muted-foreground">{["Dados","Entrega","Pagamento","Compra"][i]}</small></div>)}</div></Card>
      <Card title="Comportamento do cliente"><div className="flex min-h-24 items-center justify-between">{STATUS.slice(0,5).map((s,i)=><div key={s.id} className="flex flex-col items-center text-center"><span className="grid h-6 w-6 place-items-center rounded-full border-4 border-buy/20 bg-buy text-[8px] text-primary-foreground">{statusData[i]?.value ?? 0}</span><span className="mt-2 max-w-12 text-[8px] text-muted-foreground">{s.label}</span></div>)}</div></Card>
      <EmptyCard title="Carrinhos abandonados" value={brl(0)} note="O rastreamento ainda não está habilitado."/>
      <EmptyCard title="Vendas por upsell" note="Não foram recuperadas vendas no período selecionado."/>
      <EmptyCard title="Vendas por order-bump" note="Não foram realizadas vendas no período selecionado."/>
      <Card title="Formas de pagamento">{paymentData.length?<div className="flex h-28 items-center"><ResponsiveContainer width="60%" height="100%"><PieChart><Pie data={paymentData} dataKey="value" outerRadius={43}>{paymentData.map((x,i)=><Cell key={x.name} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><ul className="space-y-1 text-[9px]">{paymentData.map((x,i)=><li key={x.name}><i className="mr-1 inline-block h-2 w-2" style={{background:COLORS[i%COLORS.length]}}/>{x.name} {x.value}</li>)}</ul></div>:<p className="py-12 text-center text-[10px] text-muted-foreground">Sem pagamentos no período.</p>}</Card>
      <Card title="Parcelamentos">{installmentData.length?<div className="h-28"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={installmentData} dataKey="value" innerRadius={25} outerRadius={43}>{installmentData.map((x,i)=><Cell key={x.name} fill={COLORS[(i+1)%COLORS.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>:<p className="py-12 text-center text-[10px] text-muted-foreground">Sem parcelamentos no período.</p>}</Card>
      <EmptyCard title="Pedidos cancelados" value={String(data.canceled)} note="no período selecionado"/>
      <Card title="Vendas por estado">{states.length?<ol className="space-y-2">{states.map(([uf,value],i)=><li key={uf} className="grid grid-cols-[12px_20px_1fr_24px] items-center gap-1 text-[9px]"><b>{i+1}</b><span>{uf}</span><span className="h-3 rounded-sm bg-muted"><span className="block h-full rounded-sm bg-brand/25" style={{width:`${value/maxState*100}%`}}/></span><b>{value}</b></li>)}</ol>:<p className="py-10 text-center text-[10px] text-muted-foreground">Sem estados no período.</p>}</Card>
      <Card title="Top produtos">{data.topProducts.length?<ol className="space-y-1.5">{data.topProducts.slice(0,5).map((p,i)=><li key={`${p.name}-${i}`} className="grid grid-cols-[12px_26px_1fr_auto] items-center gap-1 text-[9px]"><b>{i+1}</b><span className="h-6 w-6 overflow-hidden border border-border">{p.image&&<img src={p.image} alt="" className="h-full w-full object-contain"/>}</span><span className="truncate">{p.name}</span><b>{p.qty}</b></li>)}</ol>:<p className="py-10 text-center text-[10px] text-muted-foreground">Sem produtos vendidos.</p>}</Card>
    </div>
  </div>;
}