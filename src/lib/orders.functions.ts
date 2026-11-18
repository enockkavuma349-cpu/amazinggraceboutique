import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isAdminEmail } from "./admin-email";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().int().nonnegative(),
  qty: z.number().int().positive(),
});

const placeOrderSchema = z.object({
  customer_name: z.string().trim().min(2).max(120),
  customer_phone: z.string().trim().min(7).max(30),
  customer_email: z.string().trim().email().max(160).optional().or(z.literal("")),
  delivery_address: z.string().trim().min(4).max(400),
  notes: z.string().trim().max(600).optional().or(z.literal("")),
  payment_method: z.enum(["card", "mtn", "airtel", "cod"]),
  items: z.array(itemSchema).min(1).max(100),
  delivery_fee: z.number().int().nonnegative(),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => placeOrderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const subtotal = data.items.reduce((n, i) => n + i.price * i.qty, 0);
    const total = subtotal + data.delivery_fee;
    const reference = `AGB-${Date.now().toString(36).toUpperCase()}`;

    const { error } = await supabaseAdmin.from("orders").insert({
      reference,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email || null,
      delivery_address: data.delivery_address,
      notes: data.notes || null,
      payment_method: data.payment_method,
      items: data.items,
      subtotal,
      delivery_fee: data.delivery_fee,
      total,
      status: "new",
    });
    if (error) throw new Error(error.message);

    return { reference, subtotal, total };
  });

export const getOrder = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ reference: z.string().min(4).max(40) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .select(
        "reference, customer_name, delivery_address, payment_method, items, subtotal, delivery_fee, total, status, created_at",
      )
      .eq("reference", data.reference)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
  if (!isAdminEmail((context.claims as { email?: string }).email)) throw new Error("Forbidden");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return data ?? [];
});
