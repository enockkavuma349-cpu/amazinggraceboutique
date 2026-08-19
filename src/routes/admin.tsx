import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { SlotImage } from "@/components/shop/ProductCard";
import { CATEGORIES, formatUGX, type Category } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";
import { checkAdminUnlocked, lockAdmin, unlockAdmin } from "@/lib/admin-gate.functions";

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
  loader: () => checkAdminUnlocked(),
  component: AdminGate,
});

function AdminGate() {
  const { unlocked } = Route.useLoaderData();
  return unlocked ? <AdminPage /> : <AdminLogin />;
}

function AdminLogin() {
  const router = useRouter();
  const unlock = useServerFn(unlockAdmin);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const res = await unlock({ data: { password } });
    setBusy(false);
    if (res.ok) await router.invalidate();
    else setError(true);
  }

  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-md flex-col px-4 py-20">
        <h1 className="font-serif text-3xl font-bold text-foreground">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is restricted. Enter the admin password to manage inventory.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
          />
          {error && <p className="text-sm text-destructive">Incorrect password. Try again.</p>}
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Checking…" : "Unlock admin"}
          </button>
        </form>
      </div>
    </SiteLayout>
  );
}

function AdminPage() {
  const router = useRouter();
  const lock = useServerFn(lockAdmin);
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
              await lock();
              await router.invalidate();
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
