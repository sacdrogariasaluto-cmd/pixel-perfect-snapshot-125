import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { listCustomers } from "@/lib/admin.functions";
import { brl, Card, dateTime, Metric } from "@/components/admin/ui";

export const Route = createFileRoute("/_authenticated/admin/clientes")({
  component: CustomersPage,
});

function CustomersPage() {
  const load = useServerFn(listCustomers);
  const { data, isLoading } = useQuery({ queryKey: ["admin-customers"], queryFn: () => load() });
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const list = data ?? [];
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (c) => c.name.toLowerCase().includes(term) || c.email.includes(term) || c.phone.includes(term),
    );
  }, [data, q]);

  const totals = useMemo(() => {
    const list = data ?? [];
    const spent = list.reduce((s, c) => s + c.spent, 0);
    const orders = list.reduce((s, c) => s + c.orders, 0);
    return {
      count: list.length,
      spent,
      ltv: list.length ? spent / list.length : 0,
      recurring: list.filter((c) => c.orders > 1).length,
      ticket: orders ? spent / orders : 0,
    };
  }, [data]);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Clientes</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Clientes" value={String(totals.count)} />
        <Metric label="Recorrentes" value={String(totals.recurring)} hint="mais de 1 pedido" />
        <Metric label="Gasto médio por cliente" value={brl(totals.ltv)} />
        <Metric label="Ticket médio" value={brl(totals.ticket)} />
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar cliente por nome, e-mail ou telefone"
        className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-brand"
      />

      <Card>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando clientes…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum cliente encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2">Cliente</th>
                  <th>Contato</th>
                  <th>Cidade</th>
                  <th>Pedidos</th>
                  <th>Total gasto</th>
                  <th>Última compra</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.email} className="border-b border-border last:border-0">
                    <td className="py-2.5 font-semibold">{c.name}</td>
                    <td>
                      <span className="block">{c.email}</span>
                      <span className="block text-xs text-muted-foreground">{c.phone}</span>
                    </td>
                    <td className="text-muted-foreground">
                      {c.city}
                      {c.uf ? `/${c.uf}` : ""}
                    </td>
                    <td>{c.orders}</td>
                    <td className="font-semibold">{brl(c.spent)}</td>
                    <td className="whitespace-nowrap text-muted-foreground">{dateTime(c.lastOrder)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
