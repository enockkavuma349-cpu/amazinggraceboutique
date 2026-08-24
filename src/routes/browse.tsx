import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { KitengePageBanner } from "@/components/shop/KitengePageBanner";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { CATEGORIES, type Category } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";

type BrowseSearch = { category: Category | "All"; q: string; page: number };

export const Route = createFileRoute("/browse")({
  validateSearch: (search: Record<string, unknown>): BrowseSearch => ({
    category: (CATEGORIES as string[]).includes(String(search["category"]))
      ? (search["category"] as Category)
      : "All",
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
    page: Number(search["page"]) > 1 ? Number(search["page"]) : 1,
  }),
  head: () => ({
    meta: [
      { title: "Browse All Products — Amazing Grace Boutique" },
      {
        name: "description",
        content:
          "Browse over 200 product slots at Amazing Grace Boutique: clothes, watches, perfumes and jewelry, filtered by category and price.",
      },
      { property: "og:title", content: "Browse All Products — Amazing Grace Boutique" },
      { property: "og:description", content: "Filter 200+ clothes, watches, perfumes and jewelry slots." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrowsePage,
});

const PER_PAGE = 24;

function BrowsePage() {
  const { category, q, page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { products } = useShop();
  const [term, setTerm] = React.useState(q ?? "");
  const [sort, setSort] = React.useState<"slot" | "low" | "high">("slot");

  const filtered = React.useMemo(() => {
    let list = products.filter((p) => (category === "All" ? true : p.category === category));
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.subcategory.toLowerCase().includes(needle) ||
          p.category.toLowerCase().includes(needle),
      );
    }
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, q, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <SiteLayout>
      <KitengePageBanner
        eyebrow="The complete collection"
        title="Browse the boutique"
        description={`${filtered.length} product slots ${category !== "All" ? `in ${category}` : "across clothes, watches, perfumes and jewelry"}.`}
        icon={Search}
        motif="diamonds"
      />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <form
          className="flex flex-wrap gap-3 border-b-4 border-transparent pb-6 kitenge-edge"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ search: { category, q: term, page: 1 } });
          }}
        >
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search dresses, oud, bracelets…"
            className="min-w-56 flex-1 rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground"
          >
            <option value="slot">Sort: Featured</option>
            <option value="low">Price: Low to high</option>
            <option value="high">Price: High to low</option>
          </select>
          <Button type="submit" variant="secondary"><Search /> Search</Button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["All", ...CATEGORIES] as const).map((c) => (
            <Link
              key={c}
              to="/browse"
              search={{ category: c, q, page: 1 }}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                category === c
                  ? "border-transparent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {shown.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">No slots match that search.</p>
        )}

        {pages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                to="/browse"
                search={{ category, q, page: n }}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  n === current
                    ? "border-transparent bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {n}
              </Link>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
