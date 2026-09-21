import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, CalendarDays, ChevronDown, Download, ExternalLink, Filter, Mail, MapPin, MessageCircle, PackageSearch, Search, UserRound, WalletCards, X } from "lucide-react";
import { getOrderDetail, listOrders, setOrderStatus } from "@/lib/admin.functions";
import { brl, dateTime, StatusBadge, STATUS } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/pedidos")({
  head: () => ({
    meta: [
      { title: "Pedidos — Drogaria Vera Cruz" },
      { name: "description", content: "Acompanhe e gerencie os pedidos da loja." },
      { property: "og:title", content: "Pedidos — Drogaria Vera Cruz" },
      { property: "og:description", content: "Gestão de pedidos da loja." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrdersPage,
});

const PERIODS = ["Hoje", "Ontem", "Semana", "Mês", "Todos"];
const PERIOD_DAYS: Record<string, number | undefined> = { Hoje: 1, Ontem: 2, Semana: 7, Mês: 30, Todos: undefined };

function OrdersPage() {
  const [status, setStatus] = useState("todos");
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  const [period, setPeriod] = useState("Todos");
  const [openId, setOpenId] = useState<string | null>(null);
  const load = useServerFn(listOrders);
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders", status, term, period],
    queryFn: () => {
      const selectedDays = PERIOD_DAYS[period];
      return load({ data: { status, q: term, ...(selectedDays ? { days: selectedDays } : {}) } });
    },
  });
  const changeStatus = useServerFn(setOrderStatus);
  const mutation = useMutation({
    mutationFn: (value: { id: string; status: string }) => changeStatus({ data: value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
    },
  });

  if (openId) return <OrderDetail id={openId} onClose={() => setOpenId(null)} changeStatus={(next) => mutation.mutate({ id: openId, status: next })} />;

  return (
    <div className="mx-auto max-w-[980px] space-y-4">
      <div>
        <p className="text-[10px] text-muted-foreground">Início &nbsp;›&nbsp; Vendas</p>
        <h1 className="mt-1 text-xl font-bold">Pedidos</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {PERIODS.map((item) => <Button key={item} size="sm" variant={period === item ? "default" : "outline"} onClick={() => setPeriod(item)}>{item}</Button>)}
        <Button size="sm" variant="outline"><CalendarDays /> Selecione um período</Button>
        <Button size="sm" variant="outline"><Download /> Enviar CSV</Button>
        <div className="flex gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-8 w-44"><Filter className="h-3.5 w-3.5" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {STATUS.map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); setTerm(q); }} className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Procurar por pedido, cliente ou e-mail..." className="pl-9 pr-10" />
        {q ? <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => { setQ(""); setTerm(""); }} aria-label="Limpar busca"><X /></Button> : null}
      </form>

      <section className="overflow-hidden rounded-md border border-border bg-surface shadow-sm">
        {isLoading ? <p className="p-8 text-sm text-muted-foreground">Carregando pedidos…</p> : !orders?.length ? (
          <div className="flex min-h-64 flex-col items-center justify-center text-center"><PackageSearch className="h-8 w-8 text-muted-foreground" /><p className="mt-3 text-sm font-semibold">Nenhum pedido encontrado</p><p className="mt-1 text-xs text-muted-foreground">Tente alterar a busca ou o filtro.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead><tr className="border-b border-border text-left text-[11px] uppercase text-muted-foreground"><th className="w-12 px-5 py-4"><Checkbox aria-label="Selecionar todos" /></th><th>Pagamento</th><th>Número do pedido</th><th>Data</th><th>Total</th><th>Status</th><th className="w-20" /></tr></thead>
              <tbody>{orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-5 py-3"><Checkbox aria-label={`Selecionar ${order.code}`} /></td>
                  <td><span className="inline-flex h-8 min-w-12 items-center justify-center rounded-md border border-border px-2 text-[10px] font-bold uppercase text-buy">{order.payment_method === "pix" ? "Pix" : order.payment_brand ?? "Cartão"}</span></td>
                  <td><button type="button" className="text-left" onClick={() => setOpenId(order.id)}><strong className="block text-buy">{order.code}</strong><span className="text-xs">{order.customer_name}</span></button></td>
                  <td className="whitespace-nowrap"><span className="block">{dateTime(order.created_at)}</span><span className="text-[11px] text-muted-foreground">Pedido registrado</span></td>
                  <td className="font-semibold">{brl(Number(order.total))}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td><Button variant="ghost" size="sm" onClick={() => setOpenId(order.id)}>Abrir <ChevronDown /></Button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function OrderDetail({ id, onClose, changeStatus }: { id: string; onClose: () => void; changeStatus: (status: string) => void }) {
  const load = useServerFn(getOrderDetail);
  const { data, isLoading } = useQuery({ queryKey: ["admin-order", id], queryFn: () => load({ data: { id } }) });
  if (isLoading || !data) return <p className="py-16 text-center text-sm text-muted-foreground">Carregando pedido…</p>;
  const order = data.order;
  return (
    <div className="space-y-4">
       <Button variant="ghost" size="sm" onClick={onClose}><ArrowLeft /> Voltar para pedidos</Button>
      <div className="flex flex-wrap items-center justify-between gap-3">
         <div><p className="text-[10px] text-muted-foreground">Início &nbsp;›&nbsp; Vendas &nbsp;›&nbsp; Detalhes</p><h1 className="mt-2 text-xl font-bold">Pedido: {order.code} <span className="text-xs font-normal text-muted-foreground">em {dateTime(order.created_at)}</span></h1></div>
        <Button variant="outline"><ExternalLink /> Abrir comprovante</Button>
      </div>

      <section className="rounded-md border border-border bg-surface p-4 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center gap-3"><StatusBadge status={order.status} /><Select value={order.status} onValueChange={changeStatus}><SelectTrigger className="h-8 w-44"><SelectValue /></SelectTrigger><SelectContent>{STATUS.map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}</SelectContent></Select></div>
         <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1.1fr_1.15fr]">
          <InfoBlock title="Cliente" icon={UserRound}>
            <strong>{order.customer_name}</strong><span className="flex items-center gap-1 text-buy"><MessageCircle className="h-3.5 w-3.5" />{order.customer_phone}</span><span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{order.customer_email}</span><span>CPF/CNPJ: {order.customer_doc}</span>
          </InfoBlock>
          <InfoBlock title="Pagamento" icon={WalletCards}>
            <strong>{order.payment_method === "pix" ? "Pix" : `Cartão ${order.payment_brand ?? ""}`}</strong><span>Pagamento: {order.status === "recebido" ? "aguardando" : "confirmado"}</span><strong>{brl(Number(order.total))}</strong><span>{order.payment_method === "pix" ? "À vista" : `${order.installments}x`}</span>
          </InfoBlock>
          <InfoBlock title="Entrega" icon={MapPin}>
            <strong>{order.customer_name}</strong><span>{order.address_street}, {order.address_number}{order.address_complement ? `, ${order.address_complement}` : ""}</span><span>{order.address_district}</span><span>{order.address_city} / {order.address_uf}</span><span>CEP: {order.address_cep}</span>
          </InfoBlock>
          <div className="bg-muted p-4"><h2 className="text-sm font-bold text-buy">Resumo</h2><dl className="mt-4 space-y-3 text-sm"><Row label="Produtos" value={brl(Number(order.subtotal))} /><Row label="Frete" value={brl(Number(order.shipping_price))} /><Row label="Cupom" value={order.coupon_code ?? "N/A"} /><Row label="Desconto" value={`-${brl(Number(order.discount))}`} /><div className="border-t border-border pt-3"><Row label="Valor total" value={brl(Number(order.total))} strong /></div></dl></div>
        </div>
      </section>

       <div className="flex overflow-x-auto border-b border-border"><Button size="sm" className="rounded-b-none">Resumo</Button>{["Rastreamento","Histórico do cliente","Utms","Transações","Eventos Facebook","Webhooks"].map(tab=><Button key={tab} size="sm" variant="ghost" className="shrink-0">{tab}</Button>)}</div>
      <section className="overflow-hidden rounded-md border border-border bg-surface shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-sm"><thead><tr className="border-b border-border text-left text-[11px] uppercase text-muted-foreground"><th className="px-5 py-4">Produto</th><th>Quantidade</th><th>Valor unit.</th><th>Pagamento</th><th>Subtotal</th></tr></thead><tbody>{data.items.map((item) => <tr key={item.id}><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded border border-border">{item.image ? <img src={item.image} alt="" className="h-full w-full object-contain" /> : null}</span><strong className="max-w-xs">{item.name}</strong></div></td><td>{item.qty}</td><td>{brl(Number(item.unit_price))}</td><td className="text-muted-foreground">{order.status === "recebido" ? "Aguardando pagamento" : "Pagamento confirmado"}</td><td className="font-bold">{brl(Number(item.unit_price) * item.qty)}</td></tr>)}</tbody></table></div></section>
    </div>
  );
}

function InfoBlock({ title, icon: Icon, children }: { title: string; icon: typeof UserRound; children: React.ReactNode }) {
  return <div className="space-y-2 text-xs"><h2 className="flex items-center gap-2 border-b border-border pb-2 text-sm font-bold text-buy"><Icon className="h-4 w-4" />{title}</h2><div className="flex flex-col gap-2">{children}</div></div>;
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className={`flex justify-between gap-3 ${strong ? "text-base font-bold" : ""}`}><dt>{label}</dt><dd>{value}</dd></div>;
}