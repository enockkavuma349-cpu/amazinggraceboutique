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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
      <section className="relative border-b border-border bg-cover bg-center bg-no-repeat kitenge-home-hero">
        <div className="absolute inset-0 bg-foreground/75" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-6 px-4 py-10 sm:gap-8 sm:py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-block rounded-full bg-hero-foreground/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-hero-foreground backdrop-blur-sm sm:text-xs">
              New season · 200 slots ready
            </span>
            <h1 className="mt-3 font-serif text-3xl font-bold leading-[1.1] text-hero-foreground sm:mt-4 sm:text-4xl lg:text-5xl">
              Amazing Grace Boutique
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-hero-foreground/85 sm:mt-4 sm:text-base">
              Clothes, watches, perfumes and jewelry — all in one graceful storefront. Browse the catalogue,
              fill your cart, and let us bring it to your door.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
              <Link
                to="/browse"
                search={{ category: "All", q: "", page: 1 }}
                className="inline-flex min-h-[2.75rem] items-center justify-center rounded-md bg-hero-foreground px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-hero-foreground/90 sm:px-6 sm:py-3"
              >
                Browse the shop
              </Link>
              <Link
                to="/about"
                className="inline-flex min-h-[2.75rem] items-center justify-center rounded-md border border-hero-foreground/30 bg-hero-foreground/10 px-5 py-2.5 text-sm font-semibold text-hero-foreground backdrop-blur-sm hover:bg-hero-foreground/20 sm:px-6 sm:py-3"
              >
                About us
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to="/browse"
                search={{ category, q: "", page: 1 }}
                className="group relative flex h-32 flex-col justify-end overflow-hidden rounded-lg border border-hero-foreground/20 bg-foreground/30 p-3 text-hero-foreground backdrop-blur-sm transition hover:bg-foreground/40 hover:shadow-lg sm:h-40 sm:p-4 lg:h-44"
              >
                <span className="font-serif text-lg font-bold text-hero-foreground sm:text-xl">{category}</span>
                <span className="text-[0.65rem] text-hero-foreground/70 sm:text-xs">
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
            <Link to="/browse" search={{ category, q: "", page: 1 }} className="text-sm font-medium text-accent-foreground hover:underline">
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
