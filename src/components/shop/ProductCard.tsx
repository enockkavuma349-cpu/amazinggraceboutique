import { Link } from "@tanstack/react-router";
import { ImagePlus, ShoppingCart } from "lucide-react";
import { formatUGX, type Product } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";

export function SlotImage({ product, className = "" }: { product: Product; className?: string }) {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-1.5 kitenge-pattern-soft text-primary ${className}`}>
      <ImagePlus className="size-6" />
      <span className="text-[0.6rem] uppercase tracking-[0.2em]">Slot {String(product.slot).padStart(3, "0")}</span>
      <span className="text-[0.65rem]">{product.subcategory}</span>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useShop();

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border-2 border-border bg-card transition-all hover:-translate-y-0.5 hover:border-kitenge-fuchsia hover:shadow-lg">
      <Link to="/product/$id" params={{ id: product.id }} className="block aspect-square overflow-hidden">
        <SlotImage product={product} className="transition-transform duration-300 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="w-fit rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-secondary-foreground">{product.category}</span>
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="line-clamp-2 text-sm font-medium text-foreground hover:underline"
        >
          {product.name}
        </Link>
        <p className="mt-1 font-semibold text-kitenge-flame">{formatUGX(product.price)}</p>
        <p className="text-xs text-muted-foreground">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
        <button
          onClick={() => addToCart(product.id)}
          disabled={product.stock <= 0}
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-md kitenge-bar px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <ShoppingCart className="size-3.5" /> Add to cart
        </button>
      </div>
    </article>
  );
}
