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
  payment: { method: string; brand?: string | null; installments?: number };
  coupon?: { code: string; discount: number } | null;
  items: { slug: string; name: string; image: string; unitPrice: number; qty: number }[];
  subtotal: number;
  total: number;
};

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
      coupon_code: data.coupon?.code ?? null,
      discount: data.coupon?.discount ?? 0,
      subtotal: data.subtotal,
      total: data.total,
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
