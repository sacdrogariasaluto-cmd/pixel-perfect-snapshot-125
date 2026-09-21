import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckoutFooter, CheckoutHeader } from "@/components/CheckoutHeader";
import { brl, useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout/")({
  head: () => ({
    meta: [
      { title: "Finalizar pedido — farmácia online" },
      {
        name: "description",
        content: "Checkout em uma única etapa: informe seus dados, endereço de entrega e forma de pagamento sem precisar criar conta.",
      },
      { property: "og:title", content: "Finalizar pedido" },
      { property: "og:description", content: "Checkout rápido em uma etapa, sem cadastro obrigatório." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

type Shipping = { id: string; label: string; eta: string; price: number };

const SHIPPING: Shipping[] = [
  { id: "expressa", label: "Entrega expressa", eta: "hoje, em até 2h", price: 14.9 },
  { id: "padrao", label: "Entrega padrão", eta: "em até 2 dias úteis", price: 9.9 },
];

const EMAIL_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "yahoo.com.br",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "uol.com.br",
  "bol.com.br",
  "terra.com.br",
  "ig.com.br",
  "r7.com",
  "globomail.com",
  "zipmail.com.br",
  "oi.com.br",
  "msn.com",
  "aol.com",
  "protonmail.com",
  "gmx.com",
  "zoho.com",
  "mail.com",
  "yandex.com",
];

const onlyDigits = (v: string) => v.replace(/\D/g, "");
const maskCpf = (v: string) =>
  onlyDigits(v).slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
const maskPhone = (v: string) => {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};
const maskCep = (v: string) => onlyDigits(v).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
const maskCard = (v: string) => onlyDigits(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const maskValidade = (v: string) => onlyDigits(v).slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");

function Field({
  id,
  label,
  value,
  onChange,
  error,
  className = "",
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange" | "className">) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-xs font-bold text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`h-11 w-full rounded-md border px-3 text-sm outline-none focus:border-brand ${
          error ? "border-promo" : "border-border"
        }`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-promo">{error}</p>}
    </div>
  );
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, subtotal, savings, count, setQty, remove, clear } = useCart();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepMsg, setCepMsg] = useState<string | null>(null);

  const [shipping, setShipping] = useState("padrao");
  const [payment, setPayment] = useState("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardValidade, setCardValidade] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardParcelas, setCardParcelas] = useState("1");
  const [troco, setTroco] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const cepOk = onlyDigits(cep).length === 8;
  const shippingOption = SHIPPING.find((s) => s.id === shipping)!;
  const shippingPrice = cepOk ? shippingOption.price : 0;
  const pixTotal = useMemo(() => lines.reduce((s, l) => s + l.pixPrice * l.qty, 0), [lines]);
  const productsTotal = payment === "pix" ? pixTotal : subtotal;
  const pixDiscount = subtotal - pixTotal;
  const total = productsTotal + shippingPrice;

  async function lookupCep(value: string) {
    const digits = onlyDigits(value);
    setCep(maskCep(value));
    if (digits.length !== 8) return;
    setCepLoading(true);
    setCepMsg(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = (await res.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (data.erro) {
        setCepMsg("CEP não encontrado. Preencha o endereço manualmente.");
        return;
      }
      setStreet(data.logradouro ?? "");
      setDistrict(data.bairro ?? "");
      setCity(data.localidade ?? "");
      setUf(data.uf ?? "");
    } catch {
      setCepMsg("Não foi possível consultar o CEP agora. Preencha manualmente.");
    } finally {
      setCepLoading(false);
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e['email'] = "Informe um e-mail válido";
    if (name.trim().split(" ").length < 2) e['name'] = "Informe nome e sobrenome";
    if (onlyDigits(phone).length < 10) e['phone'] = "Informe um celular com DDD";
    if (onlyDigits(cpf).length !== 11) e['cpf'] = "Informe um CPF válido";
    if (onlyDigits(cep).length !== 8) e['cep'] = "Informe o CEP";
    if (!street.trim()) e['street'] = "Informe o endereço";
    if (!number.trim()) e['number'] = "Nº";
    if (!district.trim()) e['district'] = "Informe o bairro";
    if (!city.trim()) e['city'] = "Informe a cidade";
    if (!uf.trim()) e['uf'] = "UF";
    if (payment === "cartao") {
      if (onlyDigits(cardNumber).length < 16) e['cardNumber'] = "Número do cartão incompleto";
      if (!cardName.trim()) e['cardName'] = "Informe o nome impresso no cartão";
      if (onlyDigits(cardValidade).length !== 4) e['cardValidade'] = "MM/AA";
      if (onlyDigits(cardCvv).length < 3) e['cardCvv'] = "CVV";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (lines.length === 0) return;
    if (!validate()) {
      const first = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      first?.focus();
      return;
    }
    setSending(true);
    const order = {
      id: `VC${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      customer: { email, name, phone, cpf },
      delivery: {
        type: "entrega",
        label: shippingOption.label,
        eta: shippingOption.eta,
        price: shippingOption.price,
        address: { cep, street, number, complement, district, city, uf },
      },
      payment:
        payment === "cartao"
          ? { method: "cartao", parcelas: Number(cardParcelas), last4: onlyDigits(cardNumber).slice(-4) }
          : payment === "pix"
            ? { method: "pix" }
            : { method: "dinheiro", troco },
      items: lines,
      totals: { products: productsTotal, shipping: shippingOption.price, total },
    };
    try {
      localStorage.setItem("vc-order-v1", JSON.stringify(order));
    } catch {
      /* armazenamento indisponível */
    }
    clear();
    navigate({ to: "/checkout/pedido" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CheckoutHeader />

      <main className="container-site flex-1 py-6">
        <h1 className="text-2xl font-bold">Finalizar pedido</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tudo em uma única etapa e sem precisar criar conta.
        </p>

        {lines.length === 0 ? (
          <div className="mt-6 rounded-md bg-surface p-12 text-center">
            <h2 className="text-xl font-bold">Seu carrinho está vazio</h2>
            <Link to="/" className="mt-3 inline-block text-brand underline">
              Escolher produtos
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <section className="rounded-md bg-surface p-5">
                <h2 className="mb-4 text-base font-bold">1. Seus dados</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Field id="email" label="E-mail" type="email" inputMode="email" autoComplete="email" list="email-sugestoes" value={email} onChange={setEmail} error={errors['email']} />
                    <datalist id="email-sugestoes">
                      {(() => {
                        const [user = "", domain = ""] = email.split("@");
                        if (!user) return null;
                        return EMAIL_DOMAINS.filter((d) => !domain || d.startsWith(domain)).map((d) => (
                          <option key={d} value={`${user}@${d}`} />
                        ));
                      })()}
                    </datalist>
                  </div>
                  <Field id="name" label="Nome completo" autoComplete="name" value={name} onChange={setName} error={errors['name']} />
                  <Field id="phone" label="Celular / WhatsApp" inputMode="tel" autoComplete="tel" value={phone} onChange={(v) => setPhone(maskPhone(v))} error={errors['phone']} />
                  <Field id="cpf" label="CPF" inputMode="numeric" value={cpf} onChange={(v) => setCpf(maskCpf(v))} error={errors['cpf']} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  O CPF é usado apenas para emissão da nota fiscal do pedido.
                </p>
              </section>

              <section className="rounded-md bg-surface p-5">
                <h2 className="mb-4 text-base font-bold">2. Entrega</h2>
                <div className="grid gap-4 sm:grid-cols-6">
                  <Field className="sm:col-span-2" id="cep" label="CEP" inputMode="numeric" autoComplete="postal-code" value={cep} onChange={lookupCep} error={errors['cep']} />
                  {cepLoading && <p className="self-end pb-3 text-xs text-muted-foreground sm:col-span-4">Buscando endereço…</p>}
                  {cepMsg && <p className="text-xs text-muted-foreground sm:col-span-6">{cepMsg}</p>}
                </div>

                {!cepOk ? (
                  <p className="mt-4 rounded-md bg-background p-3 text-sm text-muted-foreground">
                    Informe o CEP para ver as opções e o valor da entrega.
                  </p>
                ) : (
                  <>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {SHIPPING.map((s) => (
                        <label
                          key={s.id}
                          className={`cursor-pointer rounded-md border p-3 text-sm ${
                            shipping === s.id ? "border-brand bg-brand/5" : "border-border"
                          }`}
                        >
                          <input
                            type="radio"
                            name="entrega"
                            className="sr-only"
                            checked={shipping === s.id}
                            onChange={() => setShipping(s.id)}
                          />
                          <span className="block font-bold">{s.label}</span>
                          <span className="block text-xs text-muted-foreground">{s.eta}</span>
                          <span className="mt-1 block font-bold text-buy">
                            {s.price === 0 ? "Grátis" : brl(s.price)}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-6">
                      <Field className="sm:col-span-6" id="street" label="Endereço" autoComplete="address-line1" value={street} onChange={setStreet} error={errors['street']} />
                      <Field className="sm:col-span-2" id="number" label="Número" value={number} onChange={setNumber} error={errors['number']} />
                      <Field className="sm:col-span-4" id="complement" label="Complemento (opcional)" value={complement} onChange={setComplement} />
                      <Field className="sm:col-span-3" id="district" label="Bairro" value={district} onChange={setDistrict} error={errors['district']} />
                      <Field className="sm:col-span-2" id="city" label="Cidade" value={city} onChange={setCity} error={errors['city']} />
                      <Field className="sm:col-span-1" id="uf" label="UF" maxLength={2} value={uf} onChange={(v) => setUf(v.toUpperCase())} error={errors['uf']} />
                    </div>
                  </>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  Prazos e valores de frete são simulados; a cotação real depende de integração de logística.
                </p>
              </section>

              <section className="rounded-md bg-surface p-5">
                <h2 className="mb-4 text-base font-bold">3. Pagamento</h2>
                <div className="space-y-3">
                  {[
                    { id: "pix", title: "Pix", desc: `Desconto à vista${pixDiscount > 0 ? ` de ${brl(pixDiscount)}` : ""}` },
                    { id: "cartao", title: "Cartão de crédito", desc: "Parcele em até 6x sem juros" },
                    { id: "dinheiro", title: "Pagar na entrega", desc: "Dinheiro ou maquininha na porta" },
                  ].map((m) => (
                    <div key={m.id} className={`rounded-md border ${payment === m.id ? "border-brand" : "border-border"}`}>
                      <label className="flex cursor-pointer items-center gap-3 p-3 text-sm">
                        <input
                          type="radio"
                          name="pagamento"
                          checked={payment === m.id}
                          onChange={() => setPayment(m.id)}
                          className="h-4 w-4 accent-[oklch(var(--brand))]"
                        />
                        <span>
                          <span className="block font-bold">{m.title}</span>
                          <span className="block text-xs text-muted-foreground">{m.desc}</span>
                        </span>
                      </label>

                      {payment === "cartao" && m.id === "cartao" && (
                        <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-6">
                          <Field className="sm:col-span-4" id="cardNumber" label="Número do cartão" inputMode="numeric" value={cardNumber} onChange={(v) => setCardNumber(maskCard(v))} error={errors['cardNumber']} />
                          <Field className="sm:col-span-2" id="cardValidade" label="Validade" placeholder="MM/AA" inputMode="numeric" value={cardValidade} onChange={(v) => setCardValidade(maskValidade(v))} error={errors['cardValidade']} />
                          <Field className="sm:col-span-4" id="cardName" label="Nome impresso no cartão" value={cardName} onChange={setCardName} error={errors['cardName']} />
                          <Field className="sm:col-span-2" id="cardCvv" label="CVV" inputMode="numeric" maxLength={4} value={cardCvv} onChange={(v) => setCardCvv(onlyDigits(v).slice(0, 4))} error={errors['cardCvv']} />
                          <div className="sm:col-span-6">
                            <label htmlFor="parcelas" className="mb-1 block text-xs font-bold text-muted-foreground">
                              Parcelas
                            </label>
                            <select
                              id="parcelas"
                              value={cardParcelas}
                              onChange={(e) => setCardParcelas(e.target.value)}
                              className="h-11 w-full rounded-md border border-border px-3 text-sm"
                            >
                              {[1, 2, 3, 4, 5, 6].map((n) => (
                                <option key={n} value={n}>
                                  {n}x de {brl(total / n)} sem juros
                                </option>
                              ))}
                            </select>
                          </div>
                          <p className="text-xs text-muted-foreground sm:col-span-6">
                            Nenhum dado de cartão é cobrado ou armazenado: a captura real depende de integração com um meio de pagamento.
                          </p>
                        </div>
                      )}

                      {payment === "dinheiro" && m.id === "dinheiro" && (
                        <div className="border-t border-border p-4">
                          <Field id="troco" label="Precisa de troco para quanto? (opcional)" inputMode="numeric" value={troco} onChange={setTroco} />
                        </div>
                      )}

                      {payment === "pix" && m.id === "pix" && (
                        <p className="border-t border-border p-4 text-xs text-muted-foreground">
                          O código Pix será exibido após a confirmação do pedido.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-3 rounded-md bg-surface p-5 lg:sticky lg:top-4">
              <h2 className="text-base font-bold">
                Resumo do pedido <span className="font-normal text-muted-foreground">({count} {count === 1 ? "item" : "itens"})</span>
              </h2>
              <ul className="max-h-[300px] divide-y divide-border overflow-y-auto">
                {lines.map((l) => (
                  <li key={l.slug} className="flex gap-3 py-3">
                    <img src={l.image} alt="" className="h-14 w-14 shrink-0 object-contain" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2-fixed text-xs">{l.name}</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="flex h-7 items-center rounded-lg border border-border text-sm">
                          <button type="button" aria-label="Diminuir quantidade" disabled={l.qty === 1} onClick={() => setQty(l.slug, l.qty - 1)} className="h-full w-6 text-muted-foreground disabled:opacity-40">−</button>
                          <span className="min-w-5 text-center text-xs font-bold">{l.qty}</span>
                          <button type="button" aria-label="Aumentar quantidade" onClick={() => setQty(l.slug, l.qty + 1)} className="h-full w-6 text-muted-foreground">+</button>
                        </div>
                        <span className="text-sm font-bold">
                          {brl((payment === "pix" ? l.pixPrice : l.unitPrice) * l.qty)}
                        </span>
                      </div>
                      <button type="button" onClick={() => remove(l.slug)} className="mt-1 text-xs text-muted-foreground underline hover:text-promo">
                        Remover
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 border-t border-border pt-3 text-sm">
                <p className="flex justify-between">
                  <span>Produtos</span>
                  <span>{brl(productsTotal)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Frete</span>
                  {cepOk ? (
                    <span>{shippingPrice === 0 ? "Grátis" : brl(shippingPrice)}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">informe o CEP</span>
                  )}
                </p>
                {savings > 0 && (
                  <p className="flex justify-between text-buy">
                    <span>Você economiza</span>
                    <strong>{brl(savings + (payment === "pix" ? pixDiscount : 0))}</strong>
                  </p>
                )}
                <p className="flex justify-between border-t border-border pt-2 text-lg">
                  <strong>Total</strong>
                  <strong className="text-buy">{brl(total)}</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="mt-2 w-full rounded-[10px] bg-buy py-3 text-sm font-bold uppercase text-primary-foreground hover:bg-buy-hover disabled:opacity-60"
              >
                {sending ? "Enviando…" : "Finalizar pedido"}
              </button>
              <Link to="/checkout/carrinho" className="block text-center text-sm text-brand underline">
                Voltar ao carrinho
              </Link>
            </aside>
          </form>
        )}
      </main>

      <CheckoutFooter />
    </div>
  );
}
