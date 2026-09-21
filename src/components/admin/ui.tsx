import type { ReactNode } from "react";

export const brl = (v: number) =>
  Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });

export const STATUS: { id: string; label: string; className: string }[] = [
  { id: "recebido", label: "Recebido", className: "bg-brand/10 text-brand" },
  { id: "pago", label: "Pago", className: "bg-buy/10 text-buy" },
  { id: "enviado", label: "Enviado", className: "bg-amber-100 text-amber-700" },
  { id: "entregue", label: "Entregue", className: "bg-emerald-100 text-emerald-700" },
  { id: "cancelado", label: "Cancelado", className: "bg-promo/10 text-promo" },
];

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS.find((x) => x.id === status);
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${s?.className ?? "bg-muted text-muted-foreground"}`}>
      {s?.label ?? status}
    </span>
  );
}

export function Card({ title, children, right }: { title?: string; children: ReactNode; right?: ReactNode }) {
  return (
    <section className="rounded-md border border-border bg-surface p-3 shadow-sm">
      {(title || right) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title ? <h2 className="text-[10px] font-bold uppercase text-foreground">{title}</h2> : <span />}
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function Metric({
  label,
  value,
  hint,
  change,
}: {
  label: string;
  value: string;
  hint?: string;
  change?: number | null;
}) {
  return (
    <div className="rounded-md border border-border bg-surface p-4 shadow-sm">
      <p className="text-[11px] font-bold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {typeof change === "number" ? (
          <span className={change >= 0 ? "font-semibold text-buy" : "font-semibold text-promo"}>
            {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
          </span>
        ) : null}
        {hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
    </div>
  );
}
