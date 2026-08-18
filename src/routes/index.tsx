import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, ShieldCheck, Sparkles, Headphones } from "lucide-react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORIES } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amazing Grace Boutique — Clothes, Watches, Perfumes & Jewelry" },
      {
        name: "description",
        content:
          "Shop clothes, watches, perfumes and fine jewelry at Amazing Grace Boutique. 200+ curated display slots, fast Kampala delivery and pay on delivery.",
      },
      { property: "og:title", content: "Amazing Grace Boutique — Online Shop" },
      {
        property: "og:description",
        content: "Curated clothes, watches, perfumes and jewelry with cart, checkout and fast delivery.",
      },
    ],
  }),
  component: HomePage,
});

const PERKS = [
  { icon: Truck, title: "Fast delivery", text: "Same-day within Kampala, 1–3 days countrywide." },
  { icon: ShieldCheck, title: "Genuine goods", text: "Every piece is inspected before it ships." },
  { icon: Sparkles, title: "Fresh arrivals", text: "New slots filled with new stock every week." },
  { icon: Headphones, title: "Real support", text: "Talk to a human 8am–8pm, seven days a week." },
];

function HomePage() {
  const { products } = useShop();

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
              New season · 200 slots ready
            </span>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Amazing Grace Boutique
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Clothes, watches, perfumes and jewelry — all in one graceful storefront. Browse the catalogue,
              fill your cart, and let us bring it to your door.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/browse"
                search={{ category: "All", q: "", page: 1 }}
                className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:opacity-90"
              >
                Browse the shop
              </Link>
              <Link
                to="/about"
                className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted"
              >
                About us
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to="/browse"
                search={{ category }}
                className="group relative flex h-36 flex-col justify-end overflow-hidden rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-lg sm:h-44"
              >
                <span className="font-serif text-xl font-bold text-foreground">{category}</span>
                <span className="text-xs text-muted-foreground">
                  {products.filter((p) => p.category === category).length} slots
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {PERKS.map((perk) => (
          <div key={perk.title} className="rounded-lg border border-border bg-card p-4">
            <perk.icon className="size-5 text-accent-foreground" />
            <h3 className="mt-3 text-sm font-semibold text-foreground">{perk.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{perk.text}</p>
          </div>
        ))}
      </section>

      {CATEGORIES.map((category) => (
        <section key={category} className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold text-foreground">{category}</h2>
            <Link to="/browse" search={{ category }} className="text-sm font-medium text-accent-foreground hover:underline">
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {products
              .filter((p) => p.category === category)
              .slice(0, 6)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>
      ))}
    </SiteLayout>
  );
}
