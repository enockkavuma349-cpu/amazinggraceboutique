import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { ProductCard, SlotImage } from "@/components/shop/ProductCard";
import { CATALOG, formatUGX } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const base = CATALOG.find((p) => p.id === params.id);
    if (!base) throw notFound();
    return { name: base.name, category: base.category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product unavailable — Amazing Grace Boutique" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} — Amazing Grace Boutique`;
    const description = `${loaderData.name} in our ${loaderData.category} department at Amazing Grace Boutique. Order online with fast delivery in Uganda.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { products, addToCart } = useShop();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-24 text-center text-muted-foreground">Product not found.</div>
      </SiteLayout>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="text-xs text-muted-foreground">
          <Link to="/">Home</Link> / <Link to="/browse" search={{ category: product.category, q: "", page: 1 }}>{product.category}</Link> /{" "}
          <span className="text-foreground">{product.subcategory}</span>
        </nav>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-lg border border-border bg-card">
            <SlotImage product={product} />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">{product.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.category} · {product.subcategory} · Slot {String(product.slot).padStart(3, "0")}
            </p>
            <p className="mt-4 text-3xl font-bold text-foreground">{formatUGX(product.price)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.stock > 0 ? `${product.stock} available` : "Currently out of stock"}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            <button
              onClick={() => addToCart(product.id)}
              disabled={product.stock <= 0}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-40"
            >
              <ShoppingCart className="size-4" /> Add to cart
            </button>
            <ul className="mt-6 space-y-1 text-sm text-muted-foreground">
              <li>• Free delivery on orders above UGX 200,000</li>
              <li>• 7-day returns on unworn items</li>
              <li>• Genuine goods, inspected before dispatch</li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-serif text-2xl font-bold text-foreground">More in {product.category}</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
