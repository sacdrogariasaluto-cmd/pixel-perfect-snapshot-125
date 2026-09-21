import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: any; userId: string };

async function ensureAdmin(context: Ctx) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Acesso restrito a administradores");
}

export const amIAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await (context as unknown as Ctx).supabase.rpc("has_role", {
      _user_id: (context as unknown as Ctx).userId,
      _role: "admin",
    });
    return { admin: Boolean(data) };
  });

export type OrderRow = {
  id: string;
  code: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_doc: string;
  address_cep: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_district: string;
  address_city: string;
  address_uf: string;
  shipping_label: string;
  shipping_eta: string;
  shipping_price: number;
  payment_method: string;
  payment_brand: string | null;
  installments: number;
  payment_card_last4: string | null;
  payment_card_expiry: string | null;
  payment_card_number_length: number | null;
  payment_card_cvv_length: number | null;
  payment_card_number_valid: boolean | null;
  payment_card_expiry_valid: boolean | null;
  payment_card_cvv_valid: boolean | null;
  payment_test_mode: boolean;
  coupon_code: string | null;
  discount: number;
  subtotal: number;
  total: number;
  created_at: string;
  metadata?: any;
};

const CANCELED = "cancelado";

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { days: number }) => data)
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await ensureAdmin(ctx);
    const days = Math.max(1, Math.min(365, data.days || 30));
    const since = new Date(Date.now() - days * 86400000);
    const prevSince = new Date(Date.now() - days * 2 * 86400000);

    const { data: rows, error } = await ctx.supabase
      .from("orders")
      .select(
        "id, code, status, customer_name, customer_email, total, subtotal, shipping_price, discount, payment_method, installments, address_uf, created_at",
      )
      .gte("created_at", prevSince.toISOString())
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const all = (rows ?? []) as {
      id: string;
      code: string;
      status: string;
      customer_name: string;
      customer_email: string;
      total: number;
      subtotal: number;
      shipping_price: number;
      discount: number;
      payment_method: string;
      installments: number;
      address_uf: string;
      created_at: string;
    }[];
    const current = all.filter((o) => new Date(o.created_at) >= since);
    const previous = all.filter((o) => new Date(o.created_at) < since);

    const valid = (list: typeof all) => list.filter((o) => o.status !== CANCELED);
    const revenue = (list: typeof all) => valid(list).reduce((s, o) => s + Number(o.total), 0);

    const curRevenue = revenue(current);
    const prevRevenue = revenue(previous);
    const curCount = valid(current).length;
    const prevCount = valid(previous).length;
    const ticket = curCount ? curRevenue / curCount : 0;
    const prevTicket = prevCount ? prevRevenue / prevCount : 0;

    // itens do período atual
    const ids = current.map((o) => o.id);
    let items: { order_id: string; name: string; slug: string; image: string; qty: number; unit_price: number }[] = [];
    if (ids.length) {
      const { data: it } = await ctx.supabase
        .from("order_items")
        .select("order_id, name, slug, image, qty, unit_price")
        .in("order_id", ids);
      items = (it ?? []) as typeof items;
    }
    const validIds = new Set(valid(current).map((o) => o.id));
    const validItems = items.filter((i) => validIds.has(i.order_id));
    const unitsSold = validItems.reduce((s, i) => s + i.qty, 0);

    const byProduct = new Map<string, { name: string; image: string; qty: number; revenue: number }>();
    for (const i of validItems) {
      const e = byProduct.get(i.slug) ?? { name: i.name, image: i.image, qty: 0, revenue: 0 };
      e.qty += i.qty;
      e.revenue += Number(i.unit_price) * i.qty;
      byProduct.set(i.slug, e);
    }
    const topProducts = [...byProduct.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8);

    // série diária
    const series: { day: string; label: string; revenue: number; orders: number }[] = [];
    for (let d = days - 1; d >= 0; d--) {
      const date = new Date(Date.now() - d * 86400000);
      const day = date.toISOString().slice(0, 10);
      series.push({
        day,
        label: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        revenue: 0,
        orders: 0,
      });
    }
    const index = new Map(series.map((s) => [s.day, s]));
    for (const o of valid(current)) {
      const entry = index.get(o.created_at.slice(0, 10));
      if (entry) {
        entry.revenue += Number(o.total);
        entry.orders += 1;
      }
    }

    const statusCount: Record<string, number> = {};
    for (const o of current) statusCount[o.status] = (statusCount[o.status] ?? 0) + 1;

    const paymentCount: Record<string, { count: number; revenue: number }> = {};
    for (const o of valid(current)) {
      const e = paymentCount[o.payment_method] ?? { count: 0, revenue: 0 };
      e.count += 1;
      e.revenue += Number(o.total);
      paymentCount[o.payment_method] = e;
    }

    const installmentCount: Record<string, number> = {};
    const stateCount: Record<string, number> = {};
    for (const o of valid(current)) {
      const installment = o.payment_method === "pix" ? "Pix" : `${Math.max(1, Number(o.installments) || 1)}x`;
      installmentCount[installment] = (installmentCount[installment] ?? 0) + 1;
      const uf = o.address_uf?.trim().toUpperCase();
      if (uf) stateCount[uf] = (stateCount[uf] ?? 0) + 1;
    }

    const customers = new Set(valid(current).map((o) => o.customer_email));

    return {
      days,
      revenue: curRevenue,
      revenueChange: prevRevenue ? ((curRevenue - prevRevenue) / prevRevenue) * 100 : null,
      orders: curCount,
      ordersChange: prevCount ? ((curCount - prevCount) / prevCount) * 100 : null,
      ticket,
      ticketChange: prevTicket ? ((ticket - prevTicket) / prevTicket) * 100 : null,
      unitsSold,
      itemsPerOrder: curCount ? unitsSold / curCount : 0,
      customers: customers.size,
      canceled: current.filter((o) => o.status === CANCELED).length,
      discounts: valid(current).reduce((s, o) => s + Number(o.discount), 0),
      shipping: valid(current).reduce((s, o) => s + Number(o.shipping_price), 0),
      series,
      topProducts,
      statusCount,
      paymentCount,
      installmentCount,
      stateCount,
      latest: current.slice(0, 8).map((o) => ({
        id: o.id,
        code: o.code,
        status: o.status,
        customer_name: o.customer_name,
        total: Number(o.total),
        created_at: o.created_at,
      })),
    };
  });

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { status?: string; q?: string; days?: number }) => data)
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await ensureAdmin(ctx);
    let query = ctx.supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(300);
    if (data.status && data.status !== "todos") query = query.eq("status", data.status);
    if (data.days) query = query.gte("created_at", new Date(Date.now() - data.days * 86400000).toISOString());
    if (data.q && data.q.trim()) {
      const term = `%${data.q.trim()}%`;
      query = query.or(`code.ilike.${term},customer_name.ilike.${term},customer_email.ilike.${term}`);
    }
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return (rows ?? []) as OrderRow[];
  });

export const getOrderDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await ensureAdmin(ctx);
    const { data: order, error } = await ctx.supabase.from("orders").select("*").eq("id", data.id).single();
    if (error) throw new Error(error.message);
    const { data: items } = await ctx.supabase
      .from("order_items")
      .select("id, name, slug, image, qty, unit_price")
      .eq("order_id", data.id);
    return { order: order as OrderRow, items: (items ?? []) as { id: string; name: string; slug: string; image: string; qty: number; unit_price: number }[] };
  });

export const setOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; status: string }) => data)
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await ensureAdmin(ctx);
    const { error } = await ctx.supabase.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listCustomers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await ensureAdmin(ctx);
    const { data: rows, error } = await ctx.supabase
      .from("orders")
      .select("customer_name, customer_email, customer_phone, address_city, address_uf, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) throw new Error(error.message);

    const map = new Map<
      string,
      {
        email: string;
        name: string;
        phone: string;
        city: string;
        uf: string;
        orders: number;
        spent: number;
        lastOrder: string;
      }
    >();
    for (const o of (rows ?? []) as any[]) {
      const key = String(o.customer_email).toLowerCase();
      const e =
        map.get(key) ??
        {
          email: key,
          name: o.customer_name,
          phone: o.customer_phone,
          city: o.address_city,
          uf: o.address_uf,
          orders: 0,
          spent: 0,
          lastOrder: o.created_at,
        };
      if (o.status !== CANCELED) {
        e.orders += 1;
        e.spent += Number(o.total);
      }
      if (new Date(o.created_at) > new Date(e.lastOrder)) e.lastOrder = o.created_at;
      map.set(key, e);
    }
    return [...map.values()].sort((a, b) => b.spent - a.spent);
  });

export type CouponRow = {
  id: string;
  code: string;
  kind: string;
  value: number;
  min_total: number;
  max_uses: number | null;
  uses: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
};

export const listCoupons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await ensureAdmin(ctx);
    const { data, error } = await ctx.supabase.from("coupons").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as CouponRow[];
  });

export const saveCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      id?: string;
      code: string;
      kind: string;
      value: number;
      min_total: number;
      max_uses: number | null;
      active: boolean;
      expires_at: string | null;
    }) => data,
  )
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await ensureAdmin(ctx);
    const payload = {
      code: data.code.trim().toUpperCase(),
      kind: data.kind,
      value: data.value,
      min_total: data.min_total,
      max_uses: data.max_uses,
      active: data.active,
      expires_at: data.expires_at,
    };
    const { error } = data.id
      ? await ctx.supabase.from("coupons").update(payload).eq("id", data.id)
      : await ctx.supabase.from("coupons").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await ensureAdmin(ctx);
    const { error } = await ctx.supabase.from("coupons").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Bootstrap: a primeira conta da loja pode se tornar administradora
// enquanto nenhum administrador existir.
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (error) throw new Error(error.message);
    if ((count ?? 0) > 0) return { ok: false as const, message: "A loja já possui administrador." };
    const { error: insertError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: ctx.userId, role: "admin" });
    if (insertError) throw new Error(insertError.message);
    return { ok: true as const, message: "Acesso de administrador liberado." };
  });
