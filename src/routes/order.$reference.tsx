import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { formatUGX } from "@/lib/catalog";
import { getOrder } from "@/lib/orders.functions";

const METHOD_LABEL: Record<string, string> = {
  card: "Card (Mastercard/Visa)",
  mtn: "MTN MoMo",
  airtel: "Airtel Money",
  cod: "Pay on delivery",
};

export const Route = createFileRoute("/order/$reference")({
  loader: ({ params }) => getOrder({ data: { reference: params.reference } }),
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.reference} — Amazing Grace Boutique` },
      {
        name: "description",
        content: "Your Amazing Grace Boutique order summary with items, delivery and payment details.",
      },
      { property: "og:title", content: "Order confirmation — Amazing Grace Boutique" },
      { property: "og:description", content: "Thank you for shopping with Amazing Grace Boutique." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  errorComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground">We could not load that order</h1>
        <p className="mt-2 text-muted-foreground">Please check the reference and try again.</p>
      </div>
    </SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground">Order not found</h1>
      </div>
    </SiteLayout>
  ),
  component: OrderPage,
});

function OrderPage() {
  const order = Route.useLoaderData();
  const { reference } = Route.useParams();

  if (!order) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="font-serif text-2xl font-bold text-foreground">Order not found</h1>
          <p className="mt-2 text-muted-foreground">No order matches reference {reference}.</p>
        </div>
      </SiteLayout>
    );
  }

  const items = (order.items as { name: string; price: number; qty: number }[]) ?? [];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <CheckCircle2 className="mx-auto size-12 text-accent" />
          <h1 className="mt-3 font-serif text-3xl font-bold text-foreground">Order confirmed</h1>
          <p className="mt-2 text-muted-foreground">
            Thank you, {order.customer_name}. Our team will call you shortly to confirm delivery.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Reference: <span className="font-mono text-foreground">{order.reference}</span>
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-lg font-bold text-foreground">Items</h2>
          <ul className="mt-3 divide-y divide-border text-sm">
            {items.map((i, idx) => (
              <li key={idx} className="flex justify-between py-2">
                <span className="text-foreground">
                  {i.qty} × {i.name}
                </span>
                <span className="text-muted-foreground">{formatUGX(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="text-foreground">{formatUGX(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="text-foreground">{order.delivery_fee === 0 ? "Free" : formatUGX(order.delivery_fee)}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt className="text-foreground">Total</dt>
              <dd className="text-foreground">{formatUGX(order.total)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-muted-foreground">
            Payment: <span className="text-foreground">{METHOD_LABEL[order.payment_method] ?? order.payment_method}</span>
            <br />
            Deliver to: <span className="text-foreground">{order.delivery_address}</span>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/browse"
            search={{ category: "All", q: "", page: 1 }}
            className="inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
