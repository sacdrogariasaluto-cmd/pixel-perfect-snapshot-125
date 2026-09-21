import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/demo-pagamento")({
  head: () => ({
    meta: [
      { title: "Demonstração de fluxo — Drogaria Vera Cruz" },
      { name: "description", content: "Página didática que envia um identificador fictício de pagamento para uma rota local e mostra a resposta." },
      { property: "og:title", content: "Demonstração de fluxo — Drogaria Vera Cruz" },
      { property: "og:description", content: "Envio de token fictício para rota local, sem dados de cartão." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DemoPaymentPage,
});

function DemoPaymentPage() {
  const [token, setToken] = useState("tok-teste-01");
  const [amount, setAmount] = useState("49.90");
  const [note, setNote] = useState("Demonstração de fluxo formulário → back-end");
  const [result, setResult] = useState<string>("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setResult("");
    try {
      const response = await fetch("/api/demo-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, amount: Number(amount) || 0, note }),
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(JSON.stringify({ ok: false, error: String(error) }, null, 2));
    } finally {
      setSending(false);
    }
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[760px] space-y-5 py-8">
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
          Modo de demonstração — sem dados de cartão. Envia apenas um identificador fictício.
        </div>

        <div>
          <h1 className="text-2xl font-bold">Demonstração do fluxo de envio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            O formulário envia um token fictício para a rota local <code>/api/demo-token</code>. O servidor registra o
            objeto recebido no console e devolve o mesmo conteúdo abaixo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-border bg-surface p-4 shadow-sm">
          <label className="block text-sm font-semibold">
            Identificador fictício
            <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="tok-teste-01" className="mt-1" />
            <span className="mt-1 block text-xs font-normal text-muted-foreground">Formato aceito: tok-teste-01</span>
          </label>

          <label className="block text-sm font-semibold">
            Valor simulado (R$)
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" className="mt-1" />
          </label>

          <label className="block text-sm font-semibold">
            Observação
            <Input value={note} onChange={(e) => setNote(e.target.value)} maxLength={120} className="mt-1" />
          </label>

          <Button type="submit" disabled={sending}>{sending ? "Enviando…" : "Enviar para a rota local"}</Button>
        </form>

        <section className="rounded-md border border-border bg-surface p-4 shadow-sm">
          <h2 className="text-sm font-bold uppercase text-muted-foreground">Resposta do back-end</h2>
          <pre className="mt-2 overflow-x-auto rounded bg-muted p-3 text-xs">{result || "Nenhum envio ainda."}</pre>
        </section>
      </div>
    </SiteLayout>
  );
}
