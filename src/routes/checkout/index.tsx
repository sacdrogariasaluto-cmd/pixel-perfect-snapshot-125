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
        content: "Checkout rápido em três passos: identificação, entrega e pagamento, sem precisar criar conta.",
      },
      { property: "og:title", content: "Finalizar pedido" },
      { property: "og:description", content: "Checkout rápido em três passos, sem cadastro obrigatório." },
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
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`h-12 w-full rounded-xl border bg-surface px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-brand ${
          error ? "border-promo" : "border-border"
        }`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-promo">{error}</p>}
    </div>
  );
}

function StepShell({
  index,
  title,
  subtitle,
  active,
  done,
  summary,
  onEdit,
  children,
}: {
  index: number;
  title: string;
  subtitle: string;
  active: boolean;
  done: boolean;
  summary?: React.ReactNode;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  if (done && !active) {
    return (
      <section className="mb-4 break-inside-avoid rounded-2xl border border-buy/40 bg-buy/5 p-5 lg:mb-6 lg:p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            type="button"
            onClick={onEdit}
            className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Editar
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <path d="M4 20h4L19 9l-4-4L4 16v4Z" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="mt-3 space-y-0.5 text-sm text-foreground">{summary}</div>
      </section>
    );
  }

  if (!active) {
    return (
      <section className="mb-4 hidden break-inside-avoid px-1 py-2 lg:mb-6 lg:block">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold text-muted-foreground">{title}</h2>
          <span className="mt-1 shrink-0 text-xs text-muted-foreground">{index} de 3</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </section>
    );
  }

  return (
    <section className="mb-4 break-inside-avoid bg-surface px-4 py-5 lg:mb-6 lg:rounded-2xl lg:border lg:border-border lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold">{title}</h2>
        <span className="mt-1 shrink-0 text-xs text-muted-foreground">{index} de 3</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}


function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, subtotal, savings, count, setQty, remove, clear } = useCart();

  const [step, setStep] = useState(1);

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

  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [shipping, setShipping] = useState("padrao");
  const [payment, setPayment] = useState("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardValidade, setCardValidade] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardParcelas, setCardParcelas] = useState("1");

  const [coupon, setCoupon] = useState("");
  const [couponOpen, setCouponOpen] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const cepOk = onlyDigits(cep).length === 8;
  const shippingOption = SHIPPING.find((s) => s.id === shipping) ?? {
    id: "padrao",
    label: "Entrega padrão",
    eta: "em até 2 dias úteis",
    price: 9.9,
  };
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

  function focusFirstError() {
    const first = document.querySelector<HTMLElement>('[aria-invalid="true"]');
    first?.scrollIntoView({ behavior: "smooth", block: "center" });
    first?.focus();
  }

  function validateStep1() {
    const e: Record<string, string> = {};
    if (name.trim().split(" ").filter(Boolean).length < 2) e['name'] = "Informe nome e sobrenome";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e['email'] = "Informe um e-mail válido";
    if (onlyDigits(phone).length < 10) e['phone'] = "Informe um celular com DDD";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e: Record<string, string> = {};
    if (!cepOk) e['cep'] = "Informe o código postal";
    if (!street.trim()) e['street'] = "Informe a rua";
    if (!number.trim()) e['number'] = "Nº";
    if (!district.trim()) e['district'] = "Informe o bairro";
    if (!city.trim()) e['city'] = "Informe a cidade";
    if (!uf.trim()) e['uf'] = "UF";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3() {
    const e: Record<string, string> = {};
    if (onlyDigits(cpf).length !== 11 && onlyDigits(cpf).length !== 14) e['cpf'] = "Informe um CPF ou CNPJ válido";
    if (payment === "cartao") {
      if (onlyDigits(cardNumber).length < 16) e['cardNumber'] = "Número do cartão incompleto";
      if (!cardName.trim()) e['cardName'] = "Informe o nome impresso no cartão";
      if (onlyDigits(cardValidade).length !== 4) e['cardValidade'] = "MM/AA";
      if (onlyDigits(cardCvv).length < 3) e['cardCvv'] = "CVV";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function goToStep2() {
    if (!validateStep1()) return focusFirstError();
    setStep(2);
  }

  function confirmAddress() {
    if (!validateStep2()) return focusFirstError();
    setAddressConfirmed(true);
  }

  function goToStep3() {
    if (!validateStep2()) return focusFirstError();
    setStep(3);
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (lines.length === 0) return;
    if (!validateStep3()) return focusFirstError();
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
          : { method: "pix" },
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

  const ctaClass =
    "w-full rounded-full bg-brand py-4 text-base font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60";


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CheckoutHeader />

      <main className="w-full flex-1 lg:container-site lg:py-10">
        {lines.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-surface p-12 text-center">
            <h2 className="text-xl font-bold">Seu carrinho está vazio</h2>
            <Link to="/" className="mt-3 inline-block text-brand underline">
              Escolher produtos
            </Link>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="grid items-start lg:grid-cols-[minmax(0,1fr)_375px] lg:gap-10"
          >
            <div className="border-b border-border bg-surface lg:hidden">
              <button
                type="button"
                onClick={() => setMobileSummaryOpen((value) => !value)}
                aria-expanded={mobileSummaryOpen}
                className="grid h-[52px] w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 text-left"
              >
                <span className="min-w-0 truncate text-sm font-medium">
                  Resumo do pedido ({count}) <span aria-hidden="true" className="ml-1">⌄</span>
                </span>
                <strong className="shrink-0 text-base">{brl(total)}</strong>
              </button>
              {mobileSummaryOpen && (
                <div className="border-t border-border px-4 py-3">
                  <ul className="divide-y divide-border">
                    {lines.map((line) => (
                      <li key={line.slug} className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 py-2">
                        <img src={line.image} alt="" className="h-11 w-11 object-contain" />
                        <span className="min-w-0 truncate text-xs">{line.qty}x {line.name}</span>
                        <strong className="text-xs">{brl((payment === "pix" ? line.pixPrice : line.unitPrice) * line.qty)}</strong>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex justify-between border-t border-border pt-3 text-sm">
                    <span>Frete</span>
                    <span>{cepOk ? brl(shippingPrice) : "A calcular"}</span>
                  </div>
                </div>
              )}
            </div>

            <nav aria-label="Etapas do checkout" className="relative grid grid-cols-3 border-b border-border bg-surface px-4 py-4 lg:hidden">
              <span aria-hidden="true" className="absolute top-[31px] right-[16.66%] left-[16.66%] h-px bg-border" />
              {["Identificação", "Entrega", "Pagamento"].map((label, index) => {
                const number = index + 1;
                const reached = number <= step;
                return (
                  <div key={label} className="relative z-10 flex min-w-0 flex-col items-center gap-1.5">
                    <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${reached ? "bg-brand text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {number}
                    </span>
                    <span className={`truncate text-xs ${reached ? "font-medium text-brand-dark" : "text-muted-foreground"}`}>{label}</span>
                  </div>
                );
              })}
            </nav>

            <div className="lg:columns-2 lg:gap-10">
              <StepShell
                index={1}
                title="Identificação"
                subtitle="Preencha seus dados para envio do pedido."
                active={step === 1}
                done={step > 1}
                summary={
                  <>
                    <p>{name}</p>
                    <p>{email}</p>
                    <p>{phone}</p>
                  </>
                }
                onEdit={() => setStep(1)}
              >

                <div className="space-y-4">
                  <Field id="name" label="Nome completo" placeholder="Ex.: Maria da Silva" autoComplete="name" value={name} onChange={setName} error={errors['name']} />
                  <div>
                    <Field id="email" label="E-mail" placeholder="Ex.: maria@email.com" type="email" inputMode="email" autoComplete="email" list="email-sugestoes" value={email} onChange={setEmail} error={errors['email']} />
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
                  <Field id="phone" label="Celular / WhatsApp" placeholder="(11) 99999-9999" inputMode="tel" autoComplete="tel" value={phone} onChange={(v) => setPhone(maskPhone(v))} error={errors['phone']} />

                  {pixDiscount > 0 && (
                    <p className="rounded-xl bg-background p-4 text-sm">
                      <strong>Você ganhou {brl(pixDiscount)} de desconto</strong>
                      <br />
                      <span className="text-muted-foreground">pagando com Pix</span>
                    </p>
                  )}

                  <button type="button" onClick={goToStep2} className={ctaClass}>
                    Ir para Entrega
                  </button>
                  <p className="text-center text-xs text-muted-foreground">
                    O CPF é usado apenas para emissão da nota fiscal do pedido.
                  </p>
                </div>
              </StepShell>

              <StepShell
                index={2}
                title="Entrega"
                subtitle={step < 2 ? "Preencha seus dados para continuar" : "Informe o endereço de entrega"}
                active={step === 2}
                done={step > 2}
                summary={
                  <>
                    <p>
                      {street}, {number}
                      {complement ? ` — ${complement}` : ""}
                    </p>
                    <p>
                      {district} — {city}/{uf}
                    </p>
                    <p className="text-muted-foreground">Código Postal: {cep}</p>
                    <p className="pt-1 font-bold uppercase">{shippingOption.label}</p>
                  </>
                }
                onEdit={() => setStep(2)}
              >

                {!addressConfirmed ? (
                  <div className="space-y-4">
                    <Field className="max-w-[200px]" id="cep" label="Código Postal" placeholder="Digite seu código postal" inputMode="numeric" autoComplete="postal-code" value={cep} onChange={lookupCep} error={errors['cep']} />
                    {cepLoading && <p className="text-xs text-muted-foreground">Buscando endereço…</p>}
                    {cepMsg && <p className="text-xs text-muted-foreground">{cepMsg}</p>}

                    <Field id="street" label="Rua" placeholder="Rua, Avenida, etc." autoComplete="address-line1" value={street} onChange={setStreet} error={errors['street']} />
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-4">
                      <Field id="number" label="Número" placeholder="123 ou S/N" value={number} onChange={setNumber} error={errors['number']} />
                      <Field id="district" label="Bairro" placeholder="Seu bairro" value={district} onChange={setDistrict} error={errors['district']} />
                    </div>
                    <Field id="complement" label="Complemento" placeholder="Apto, Bloco, etc." value={complement} onChange={setComplement} />
                    <div className="grid grid-cols-2 gap-4">
                      <Field id="city" label="Cidade" value={city} onChange={setCity} error={errors['city']} />
                      <Field id="uf" label="Estado" maxLength={2} value={uf} onChange={(v) => setUf(v.toUpperCase())} error={errors['uf']} />
                    </div>

                    <button type="button" onClick={confirmAddress} className={ctaClass}>
                      Continuar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setAddressConfirmed(false)}
                      className="rounded-lg border border-border px-3 py-2 text-sm font-bold"
                    >
                      + Adicionar Endereço
                    </button>

                    <div className="flex items-start justify-between gap-3 rounded-xl border border-brand p-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <input type="radio" checked readOnly className="mt-1 h-4 w-4 accent-brand" aria-label="Endereço de entrega" />
                        <p className="min-w-0 text-sm">
                          <strong>{street}, {number}</strong>
                          <br />
                          {district} — {city}/{uf}
                          <br />
                          <span className="text-muted-foreground">Código Postal: {cep}</span>
                        </p>
                      </div>
                      <button type="button" onClick={() => setAddressConfirmed(false)} className="shrink-0 text-xs font-bold text-brand underline">
                        Alterar
                      </button>
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="mb-2 text-sm font-bold">Formas de entrega:</p>
                      <div className="space-y-3">
                        {SHIPPING.map((s) => (
                          <label
                            key={s.id}
                            className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 text-sm ${
                              shipping === s.id ? "border-brand bg-brand/5" : "border-border"
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <input
                                type="radio"
                                name="entrega"
                                className="h-4 w-4 accent-brand"
                                checked={shipping === s.id}
                                onChange={() => setShipping(s.id)}
                              />
                              <span className="min-w-0">
                                <span className="block font-bold uppercase">{s.label}</span>
                                <span className="block text-xs text-muted-foreground">Entregas para todo o Brasil</span>
                                <span className="block text-xs text-muted-foreground">{s.eta}</span>
                              </span>
                            </span>
                            <span className="shrink-0 font-bold">{brl(s.price)}</span>
                          </label>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Enviaremos para o seu e-mail <strong>o Código de Rastreio</strong> para você acompanhar toda a
                        jornada do seu pedido até você!
                      </p>
                    </div>

                    <button type="button" onClick={goToStep3} className={ctaClass}>
                      Ir para o Pagamento
                    </button>
                  </div>
                )}
              </StepShell>

              <StepShell
                index={3}
                title="Pagamento"
                subtitle={step < 3 ? "Preencha os dados de entrega para continuar" : ""}
                active={step === 3}
                done={false}
                onEdit={() => setStep(3)}
              >
                <div className="space-y-4">
                  <div className={`rounded-2xl border p-4 ${payment === "pix" ? "border-brand" : "border-border"}`}>
                    <label className="flex cursor-pointer items-start justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="pagamento"
                          checked={payment === "pix"}
                          onChange={() => setPayment("pix")}
                          className="h-4 w-4 accent-brand"
                        />
                        <span className="text-sm font-bold">Pix</span>
                      </span>
                      <span className="flex flex-col items-end gap-1">
                        <span className="rounded bg-buy/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-buy">
                          APROVAÇÃO IMEDIATA
                        </span>
                        {pixDiscount > 0 && (
                          <span className="rounded bg-buy/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-buy">
                            DESCONTO À VISTA
                          </span>
                        )}
                      </span>
                    </label>
                    {payment === "pix" && (
                      <>
                        <p className="mt-3 text-sm font-bold">
                          A confirmação de pagamento é realizada em poucos minutos. Utilize o aplicativo do seu banco
                          para pagar.
                        </p>
                        <p className="mt-3 text-lg font-bold text-buy">Valor no Pix: {brl(total)}</p>
                      </>
                    )}
                  </div>

                  <div className={`rounded-2xl border p-4 ${payment === "cartao" ? "border-brand" : "border-border"}`}>
                    <label className="flex cursor-pointer items-start justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="pagamento"
                          checked={payment === "cartao"}
                          onChange={() => setPayment("cartao")}
                          className="h-4 w-4 accent-brand"
                        />
                        <span className="text-sm font-bold">Cartão de crédito</span>
                      </span>
                      <span className="rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-brand-dark">
                        ATÉ 6X SEM JUROS
                      </span>
                    </label>

                    {payment === "cartao" && (
                      <div className="mt-4 grid gap-4 sm:grid-cols-6">
                        <Field className="sm:col-span-4" id="cardNumber" label="Número do cartão" placeholder="0000 0000 0000 0000" inputMode="numeric" value={cardNumber} onChange={(v) => setCardNumber(maskCard(v))} error={errors['cardNumber']} />
                        <Field className="sm:col-span-2" id="cardValidade" label="Validade" placeholder="MM/AA" inputMode="numeric" value={cardValidade} onChange={(v) => setCardValidade(maskValidade(v))} error={errors['cardValidade']} />
                        <Field className="sm:col-span-4" id="cardName" label="Nome impresso no cartão" placeholder="Ex.: MARIA DA SILVA" value={cardName} onChange={setCardName} error={errors['cardName']} />
                        <Field className="sm:col-span-2" id="cardCvv" label="CVV" placeholder="000" inputMode="numeric" maxLength={4} value={cardCvv} onChange={(v) => setCardCvv(onlyDigits(v).slice(0, 4))} error={errors['cardCvv']} />
                        <div className="sm:col-span-6">
                          <label htmlFor="parcelas" className="mb-1.5 block text-sm font-bold">
                            Parcelas
                          </label>
                          <select
                            id="parcelas"
                            value={cardParcelas}
                            onChange={(e) => setCardParcelas(e.target.value)}
                            className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm"
                          >
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                              <option key={n} value={n}>
                                {n}x de {brl(total / n)} sem juros
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className="text-xs text-muted-foreground sm:col-span-6">
                          Nenhum dado de cartão é cobrado ou armazenado: a captura real depende de integração com um
                          meio de pagamento.
                        </p>
                      </div>
                    )}
                  </div>

                  <Field
                    id="cpf"
                    label="CPF/CNPJ"
                    placeholder="Digite o número"
                    inputMode="numeric"
                    value={cpf}
                    onChange={(v) => setCpf(maskCpf(v))}
                    error={errors['cpf']}
                  />

                  <button type="submit" disabled={sending} className={ctaClass}>
                    {sending ? "Enviando…" : "Finalizar Compra"}
                  </button>
                </div>
              </StepShell>
            </div>

            <aside className="hidden space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-sm lg:sticky lg:top-4 lg:block">
              <h2 className="text-lg font-bold">Resumo do pedido</h2>

              <div>
                <button
                  type="button"
                  onClick={() => setCouponOpen((v) => !v)}
                  className="text-sm font-bold text-buy"
                >
                  Inserir cupom de desconto
                </button>
                {couponOpen && (
                  <div className="mt-2 flex gap-2">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      placeholder="CUPOM"
                      aria-label="Cupom de desconto"
                      className="h-10 w-full rounded-xl border border-border px-3 text-sm outline-none focus:border-brand"
                    />
                    <button type="button" className="h-10 shrink-0 rounded-xl bg-brand px-4 text-sm font-bold text-primary-foreground">
                      Aplicar
                    </button>
                  </div>
                )}
                {couponOpen && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Cupons dependem de integração com o sistema da loja.
                  </p>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span>Produtos ({count})</span>
                  <span>{brl(productsTotal)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Frete</span>
                  {cepOk ? <span>{brl(shippingPrice)}</span> : <span className="text-xs text-muted-foreground">informe o CEP</span>}
                </p>
                {savings + pixDiscount > 0 && (
                  <p className="flex justify-between text-buy">
                    <span>Você economiza</span>
                    <strong>{brl(savings + (payment === "pix" ? pixDiscount : 0))}</strong>
                  </p>
                )}
                <p className="flex justify-between border-t border-border pt-2 text-lg">
                  <strong>Total</strong>
                  <strong>{brl(total)}</strong>
                </p>
              </div>

              <ul className="max-h-[320px] divide-y divide-border overflow-y-auto border-t border-border">
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
