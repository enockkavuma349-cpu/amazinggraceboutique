import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Trash2 } from "lucide-react";
import * as React from "react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { SlotImage } from "@/components/shop/ProductCard";
import { CheckoutDialog } from "@/components/shop/CheckoutDialog";
import { placeOrder } from "@/lib/orders.functions";
import { formatUGX } from "@/lib/catalog";
import { useShop } from "@/lib/shop-store";


export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Amazing Grace Boutique" },
      {
        name: "description",
        content: "Review the clothes, watches, perfumes and jewelry in your Amazing Grace Boutique cart and check out.",
      },
      { property: "og:title", content: "Your Cart — Amazing Grace Boutique" },
      { property: "og:description", content: "Review your items and place your order." },
    ],
  }),
  component: CartPage,
});

const DELIVERY = 15000;

function CartPage() {
  const { cartDetailed, cartTotal, setQty, removeFromCart, clearCart } = useShop();
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const submitOrder = useServerFn(placeOrder);
  const navigate = useNavigate();

  const delivery = cartTotal >= 200000 || cartTotal === 0 ? 0 : DELIVERY;
  const total = cartTotal + delivery;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl font-bold text-foreground">Your cart</h1>

        {cartDetailed.length === 0 ? (
          <div className="mt-10 rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/browse" search={{ category: "All", q: "", page: 1 }} className="mt-4 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">
              Start browsing
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-3">
              {cartDetailed.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-4 rounded-lg border border-border bg-card p-3">
                  <div className="size-20 shrink-0 overflow-hidden rounded-md">
                    <SlotImage product={product} />
                  </div>
                  <div className="flex-1">
                    <Link to="/product/$id" params={{ id: product.id }} className="text-sm font-medium text-foreground hover:underline">
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                    <p className="mt-1 font-semibold text-foreground">{formatUGX(product.price)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(product.id)} aria-label="Remove" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-4" />
                    </button>
                    <div className="flex items-center rounded-md border border-border">
                      <button className="px-2.5 py-1 text-foreground" onClick={() => setQty(product.id, qty - 1)}>−</button>
                      <span className="min-w-8 text-center text-sm">{qty}</span>
                      <button className="px-2.5 py-1 text-foreground" onClick={() => setQty(product.id, qty + 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-destructive">
                Clear cart
              </button>
            </div>

            <aside className="h-fit rounded-lg border border-border bg-card p-5">
              <h2 className="font-serif text-lg font-bold text-foreground">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="text-foreground">{formatUGX(cartTotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="text-foreground">{delivery === 0 ? "Free" : formatUGX(delivery)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <dt className="text-foreground">Total</dt>
                  <dd className="text-foreground">{formatUGX(cartTotal + delivery)}</dd>
                </div>
              </dl>
              <button
                onClick={() => setCheckoutOpen(true)}
                className="mt-5 w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
              >
                Checkout · {formatUGX(total)}
              </button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Card (Mastercard/Visa), MTN MoMo, Airtel Money or pay on delivery.
              </p>
            </aside>
          </div>
        )}
      </div>

      <CheckoutDialog
        open={checkoutOpen}
        total={total}
        onClose={() => setCheckoutOpen(false)}
        onPaid={async (details) => {
          const result = await submitOrder({
            data: {
              customer_name: details.name,
              customer_phone: details.phone,
              customer_email: details.email,
              delivery_address: details.address,
              notes: details.note,
              payment_method: details.method,
              delivery_fee: delivery,
              items: cartDetailed.map(({ product, qty }) => ({
                id: product.id,
                name: product.name,
                price: product.price,
                qty,
              })),
            },
          });
          clearCart();
          setCheckoutOpen(false);
          await navigate({ to: "/order/$reference", params: { reference: result.reference } });
        }}
      />
    </SiteLayout>
  );
}

