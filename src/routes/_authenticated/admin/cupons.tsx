import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { deleteCoupon, listCoupons, saveCoupon, type CouponRow } from "@/lib/admin.functions";
import { brl, Card } from "@/components/admin/ui";

export const Route = createFileRoute("/_authenticated/admin/cupons")({
  component: CouponsPage,
});

type FormState = {
  id?: string;
  code: string;
  kind: string;
  value: string;
  min_total: string;
  max_uses: string;
  active: boolean;
  expires_at: string;
};

const EMPTY: FormState = {
  code: "",
  kind: "percent",
  value: "10",
  min_total: "0",
  max_uses: "",
  active: true,
  expires_at: "",
};

function CouponsPage() {
  const queryClient = useQueryClient();
  const load = useServerFn(listCoupons);
  const save = useServerFn(saveCoupon);
  const remove = useServerFn(deleteCoupon);

  const { data, isLoading } = useQuery({ queryKey: ["admin-coupons"], queryFn: () => load() });
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });

  const saveMutation = useMutation({
    mutationFn: (v: FormState) =>
      save({
        data: {
          ...(v.id ? { id: v.id } : {}),
          code: v.code,
          kind: v.kind,
          value: Number(v.value.replace(",", ".")) || 0,
          min_total: Number(v.min_total.replace(",", ".")) || 0,
          max_uses: v.max_uses ? Number(v.max_uses) : null,
          active: v.active,
          expires_at: v.expires_at ? new Date(v.expires_at).toISOString() : null,
        },
      }),
    onSuccess: () => {
      setForm(EMPTY);
      setError(null);
      invalidate();
    },
    onError: (e: Error) => setError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: invalidate,
  });

  function edit(c: CouponRow) {
    setForm({
      id: c.id,
      code: c.code,
      kind: c.kind,
      value: String(c.value),
      min_total: String(c.min_total),
      max_uses: c.max_uses === null ? "" : String(c.max_uses),
      active: c.active,
      expires_at: c.expires_at ? c.expires_at.slice(0, 10) : "",
    });
  }

  const input = "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-brand";

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Cupons de desconto</h1>

      <Card title={form.id ? "Editar cupom" : "Novo cupom"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.code.trim()) return setError("Informe o código");
            saveMutation.mutate(form);
          }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <label className="text-sm">
            Código
            <input
              className={input}
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="BEMVINDO10"
            />
          </label>
          <label className="text-sm">
            Tipo
            <select className={input} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              <option value="percent">Percentual (%)</option>
              <option value="fixed">Valor fixo (R$)</option>
            </select>
          </label>
          <label className="text-sm">
            Valor
            <input className={input} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </label>
          <label className="text-sm">
            Pedido mínimo (R$)
            <input
              className={input}
              value={form.min_total}
              onChange={(e) => setForm({ ...form, min_total: e.target.value })}
            />
          </label>
          <label className="text-sm">
            Limite de usos
            <input
              className={input}
              value={form.max_uses}
              onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
              placeholder="ilimitado"
            />
          </label>
          <label className="text-sm">
            Validade
            <input
              type="date"
              className={input}
              value={form.expires_at}
              onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Cupom ativo
          </label>

          <div className="flex items-end gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="h-10 rounded-full bg-brand px-5 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {form.id ? "Salvar alterações" : "Criar cupom"}
            </button>
            {form.id ? (
              <button type="button" onClick={() => setForm(EMPTY)} className="text-sm text-muted-foreground underline">
                Cancelar
              </button>
            ) : null}
          </div>
          {error ? <p className="text-sm text-promo sm:col-span-3">{error}</p> : null}
        </form>
      </Card>

      <Card title="Cupons cadastrados">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum cupom criado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2">Código</th>
                  <th>Desconto</th>
                  <th>Mínimo</th>
                  <th>Usos</th>
                  <th>Validade</th>
                  <th>Situação</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 font-semibold">{c.code}</td>
                    <td>{c.kind === "percent" ? `${Number(c.value)}%` : brl(Number(c.value))}</td>
                    <td>{brl(Number(c.min_total))}</td>
                    <td>
                      {c.uses}
                      {c.max_uses ? ` / ${c.max_uses}` : ""}
                    </td>
                    <td className="text-muted-foreground">
                      {c.expires_at ? new Date(c.expires_at).toLocaleDateString("pt-BR") : "sem prazo"}
                    </td>
                    <td>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          c.active ? "bg-buy/10 text-buy" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {c.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="space-x-3 text-right">
                      <button onClick={() => edit(c)} className="text-xs font-semibold text-brand underline">
                        Editar
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(c.id)}
                        className="text-xs font-semibold text-promo underline"
                      >
                        Excluir
                      </button>
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
