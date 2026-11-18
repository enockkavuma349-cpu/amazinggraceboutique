import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { SlotImage } from "@/components/shop/ProductCard";
import { CATEGORIES, formatUGX, type Category } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";
import { checkAdminAccess } from "@/lib/admin-gate.functions";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { listOrders } from "@/lib/orders.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Inventory Log — Amazing Grace Boutique" },
      {
        name: "description",
        content:
          "Admin inventory log for Amazing Grace Boutique: fill product image slots, edit names, prices and stock, and review activity history.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Inventory Log — Amazing Grace Boutique" },
      { property: "og:description", content: "Manage product slots, stock levels and activity history." },
    ],
  }),
  component: AdminGate,
});

function AdminGate() {
  const { user, ready } = useAuth();
  const check = useServerFn(checkAdminAccess);
  const [state, setState] = React.useState<"loading" | "ok" | "denied">("loading");

  React.useEffect(() => {
    if (!ready) return;
    if (!user) { setState("denied"); return; }
    setState("loading");
    check().then((r) => setState(r.ok ? "ok" : "denied")).catch(() => setState("denied"));
  }, [ready, user, check]);

  if (state === "ok") return <AdminPage />;
  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-md flex-col px-4 py-20 text-center">
        {state === "loading" ? (
          <p className="text-sm text-muted-foreground">Checking access…</p>
        ) : (
          <>
            <h1 className="font-serif text-3xl font-bold text-foreground">Admin only</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {user ? "This account doesn't have admin access." : "Please sign in with the admin account to continue."}
            </p>
            {!user && (
              <Link to="/login" className="mx-auto mt-6 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Sign in
              </Link>
            )}
          </>
        )}
      </div>
    </SiteLayout>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const { products, log, updateProduct, resetProduct } = useShop();

  const [category, setCategory] = React.useState<Category | "All">("All");
  const [term, setTerm] = React.useState("");
  const [editing, setEditing] = React.useState<string | null>(null);

  const list = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (!term || p.name.toLowerCase().includes(term.toLowerCase()) || String(p.slot).includes(term)),
  );

  const filled = products.filter((p) => p.image).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock <= 0).length;
  const value = products.reduce((n, p) => n + p.price * p.stock, 0);

  const STATS = [
    { label: "Total slots", value: String(products.length) },
    { label: "Photos uploaded", value: `${filled} / ${products.length}` },
    { label: "Low stock (≤5)", value: String(lowStock) },
    { label: "Out of stock", value: String(outOfStock) },
    { label: "Inventory value", value: formatUGX(value) },
  ];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Admin · Inventory log</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill each picture slot, edit product details and track every change. Saved to this browser.
            </p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/", replace: true });
            }}
            className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Sign out
          </button>
        </div>


        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-lg font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search by name or slot number"
            className="min-w-56 flex-1 rounded-md border border-input bg-card px-3 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "All")}
            className="rounded-md border border-input bg-card px-3 py-2 text-sm"
          >
            {(["All", ...CATEGORIES] as const).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Slot</th>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0, 60).map((p) => (
                <React.Fragment key={p.id}>
                  <tr className="border-t border-border bg-card">
                    <td className="p-3">
                      <div className="size-12 overflow-hidden rounded-md">
                        <SlotImage product={p} />
                      </div>
                    </td>
                    <td className="p-3 text-foreground">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{p.category}</td>
                    <td className="p-3 text-foreground">{formatUGX(p.price)}</td>
                    <td className={`p-3 ${p.stock <= 5 ? "font-semibold text-destructive" : "text-foreground"}`}>{p.stock}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setEditing(editing === p.id ? null : p.id)}
                        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                      >
                        {editing === p.id ? "Close" : "Edit slot"}
                      </button>
                    </td>
                  </tr>
                  {editing === p.id && (
                    <tr className="border-t border-border bg-secondary">
                      <td colSpan={6} className="p-4">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <label className="text-xs text-muted-foreground">
                            Product name
                            <input
                              defaultValue={p.name}
                              onBlur={(e) => updateProduct(p.id, { name: e.target.value })}
                              className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground"
                            />
                          </label>
                          <label className="text-xs text-muted-foreground">
                            Price (UGX)
                            <input
                              type="number"
                              defaultValue={p.price}
                              onBlur={(e) => updateProduct(p.id, { price: Number(e.target.value) || 0 })}
                              className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground"
                            />
                          </label>
                          <label className="text-xs text-muted-foreground">
                            Stock
                            <input
                              type="number"
                              defaultValue={p.stock}
                              onBlur={(e) => updateProduct(p.id, { stock: Number(e.target.value) || 0 })}
                              className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground"
                            />
                          </label>
                          <label className="text-xs text-muted-foreground">
                            Image URL
                            <input
                              defaultValue={p.image ?? ""}
                              placeholder="https://…"
                              onBlur={(e) => updateProduct(p.id, { image: e.target.value || null })}
                              className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground"
                            />
                          </label>
                          <label className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-3">
                            Description
                            <textarea
                              defaultValue={p.description}
                              rows={2}
                              onBlur={(e) => updateProduct(p.id, { description: e.target.value })}
                              className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground"
                            />
                          </label>
                          <label className="text-xs text-muted-foreground">
                            Upload a photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => updateProduct(p.id, { image: String(reader.result) });
                                reader.readAsDataURL(file);
                              }}
                              className="mt-1 w-full text-xs text-foreground"
                            />
                          </label>
                        </div>
                        <button
                          onClick={() => resetProduct(p.id)}
                          className="mt-3 text-xs text-destructive hover:underline"
                        >
                          Reset this slot to empty
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {list.length > 60 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Showing the first 60 of {list.length} matching slots — refine your search to reach the rest.
          </p>
        )}

        <OrdersSection />

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-foreground">Activity log</h2>
          <div className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
            {log.length === 0 && <p className="p-4 text-sm text-muted-foreground">No activity recorded yet.</p>}
            {log.slice(0, 40).map((entry) => (
              <div key={entry.id} className="flex flex-wrap justify-between gap-2 p-3 text-sm">
                <span className="text-foreground">{entry.message}</span>
                <span className="text-xs text-muted-foreground">{new Date(entry.at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

type OrderRow = Awaited<ReturnType<typeof listOrders>>[number];

function OrdersSection() {
  const fetchOrders = useServerFn(listOrders);
  const [orders, setOrders] = React.useState<OrderRow[] | null>(null);
  const [error, setError] = React.useState(false);

  const load = React.useCallback(() => {
    setError(false);
    fetchOrders()
      .then(setOrders)
      .catch(() => setError(true));
  }, [fetchOrders]);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold text-foreground">Customer orders</h2>
        <button
          onClick={load}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
        >
          Refresh
        </button>
      </div>
      <div className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
        {error && <p className="p-4 text-sm text-destructive">Could not load orders.</p>}
        {!error && orders === null && <p className="p-4 text-sm text-muted-foreground">Loading orders…</p>}
        {orders?.length === 0 && <p className="p-4 text-sm text-muted-foreground">No orders yet.</p>}
        {orders?.map((o) => {
          const items = (Array.isArray(o.items) ? o.items : []) as { name: string; qty: number }[];
          return (
            <details key={o.id} className="p-3 text-sm">
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-foreground">{o.reference}</span>
                <span className="text-foreground">{o.customer_name}</span>
                <span className="font-semibold text-foreground">{formatUGX(o.total)}</span>
                <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</span>
              </summary>
              <div className="mt-3 grid gap-1 text-muted-foreground sm:grid-cols-2">
                <p>Phone: <span className="text-foreground">{o.customer_phone}</span></p>
                <p>Email: <span className="text-foreground">{o.customer_email ?? "—"}</span></p>
                <p>Address: <span className="text-foreground">{o.delivery_address}</span></p>
                <p>Payment: <span className="text-foreground">{o.payment_method}</span></p>
                <p>Status: <span className="text-foreground">{o.status}</span></p>
                {o.notes && <p>Note: <span className="text-foreground">{o.notes}</span></p>}
                <p className="sm:col-span-2">
                  Items: <span className="text-foreground">{items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</span>
                </p>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
