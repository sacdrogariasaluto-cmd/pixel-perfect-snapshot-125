import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getOrderDetail, listOrders, setOrderStatus } from "@/lib/admin.functions";
import { brl, Card, dateTime, StatusBadge, STATUS } from "@/components/admin/ui";

export const Route = createFileRoute("/_authenticated/admin/pedidos")({
  component: OrdersPage,
});

function OrdersPage() {
  const [status, setStatus] = useState("todos");
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useServerFn(listOrders);
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders", status, term],
    queryFn: () => load({ data: { status, q: term } }),
  });

  const changeStatus = useServerFn(setOrderStatus);
  const mutation = useMutation({
    mutationFn: (v: { id: string; status: string }) => changeStatus({ data: v }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
    },
  });

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Pedidos</h1>

      <div className="flex flex-wrap items-center gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTerm(q);
          }}
          className="flex flex-1 gap-2"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por código, nome ou e-mail"
            className="h-10 min-w-[200px] flex-1 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-brand"
          />
          <button className="h-10 rounded-lg bg-brand px-4 text-sm font-bold text-primary-foreground">Buscar</button>
        </form>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm"
        >
          <option value="todos">Todas as situações</option>
          {STATUS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <Card>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando pedidos…</p>
        ) : !orders || orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum pedido encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2">Pedido</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Total</th>
                  <th>Situação</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 font-semibold">{o.code}</td>
                    <td>
                      <span className="block">{o.customer_name}</span>
                      <span className="block text-xs text-muted-foreground">{o.customer_email}</span>
                    </td>
                    <td className="whitespace-nowrap text-muted-foreground">{dateTime(o.created_at)}</td>
                    <td className="font-semibold">{brl(Number(o.total))}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => mutation.mutate({ id: o.id, status: e.target.value })}
                        className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
                      >
                        {STATUS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => setOpenId(openId === o.id ? null : o.id)}
                        className="text-xs font-semibold text-brand underline"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {openId ? <OrderDetail id={openId} onClose={() => setOpenId(null)} /> : null}
    </div>
  );
}

function OrderDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const load = useServerFn(getOrderDetail);
  const { data, isLoading } = useQuery({ queryKey: ["admin-order", id], queryFn: () => load({ data: { id } }) });

  return (
    <Card
      title="Detalhes do pedido"
      right={
        <button onClick={onClose} className="text-xs text-muted-foreground underline">
          Fechar
        </button>
      }
    >
      {isLoading || !data ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : (
        <div className="grid gap-5 text-sm md:grid-cols-2">
          <div className="space-y-1">
            <p className="font-bold">
              {data.order.code} <StatusBadge status={data.order.status} />
            </p>
            <p className="text-muted-foreground">{dateTime(data.order.created_at)}</p>
            <p className="pt-2 font-semibold">Cliente</p>
            <p>{data.order.customer_name}</p>
            <p>{data.order.customer_email}</p>
            <p>{data.order.customer_phone}</p>
            <p>{data.order.customer_doc}</p>
            <p className="pt-2 font-semibold">Entrega</p>
            <p>
              {data.order.shipping_label} · {data.order.shipping_eta} · {brl(Number(data.order.shipping_price))}
            </p>
            <p>
              {data.order.address_street}, {data.order.address_number} {data.order.address_complement}
            </p>
            <p>
              {data.order.address_district} — {data.order.address_city}/{data.order.address_uf} · CEP {data.order.address_cep}
            </p>
            <p className="pt-2 font-semibold">Pagamento</p>
            <p>
              {data.order.payment_method === "pix"
                ? "Pix"
                : `Cartão ${data.order.payment_brand ?? ""} em ${data.order.installments}x`}
            </p>
          </div>

          <div>
            <p className="font-semibold">Itens</p>
            <ul className="mt-2 space-y-2">
              {data.items.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 border-b border-border pb-2">
                  <span className="line-clamp-2">
                    {i.qty}× {i.name}
                  </span>
                  <span className="shrink-0 font-semibold">{brl(Number(i.unit_price) * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{brl(Number(data.order.subtotal))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Frete</dt>
                <dd>{brl(Number(data.order.shipping_price))}</dd>
              </div>
              {Number(data.order.discount) > 0 ? (
                <div className="flex justify-between text-buy">
                  <dt>Desconto {data.order.coupon_code ? `(${data.order.coupon_code})` : ""}</dt>
                  <dd>-{brl(Number(data.order.discount))}</dd>
                </div>
              ) : null}
              <div className="flex justify-between text-base font-bold">
                <dt>Total</dt>
                <dd>{brl(Number(data.order.total))}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </Card>
  );
}
