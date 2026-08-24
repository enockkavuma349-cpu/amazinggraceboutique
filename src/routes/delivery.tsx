import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingCart, CreditCard, Truck, PackageCheck, Clock, RotateCcw } from "lucide-react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { KitengePageBanner } from "@/components/shop/KitengePageBanner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "How to Order & Delivery — Amazing Grace Boutique" },
      {
        name: "description",
        content:
          "Learn how to order from Amazing Grace Boutique: browse, add to cart, pay by card, MTN MoMo, Airtel Money or on delivery. Kampala same-day, countrywide in 1-3 days.",
      },
      { property: "og:title", content: "How to Order & Delivery — Amazing Grace Boutique" },
      {
        property: "og:description",
        content: "Ordering steps, payment options, delivery times and our returns policy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DeliveryPage,
});

const STEPS = [
  { icon: ShoppingCart, title: "1. Browse & add to cart", text: "Find your piece under Clothes, Watches, Perfumes or Jewelry and tap Add to cart." },
  { icon: CreditCard, title: "2. Checkout & pay", text: "Pay with Mastercard/Visa, MTN MoMo, Airtel Money, or choose Pay on Delivery." },
  { icon: PackageCheck, title: "3. We confirm", text: "You get an order reference instantly and a call from our team to confirm details." },
  { icon: Truck, title: "4. We deliver", text: "A rider brings your parcel to your door. Inspect it before you accept." },
];

const ZONES = [
  { zone: "Kampala (city centre)", time: "Same day", fee: "UGX 5,000 · Free above UGX 200,000" },
  { zone: "Greater Kampala / Wakiso / Mukono", time: "Within 24 hours", fee: "UGX 10,000" },
  { zone: "Major towns (Jinja, Mbarara, Gulu, Mbale…)", time: "1–2 days", fee: "UGX 15,000" },
  { zone: "Rest of Uganda", time: "2–3 days", fee: "From UGX 20,000" },
];

function DeliveryPage() {
  return (
    <SiteLayout>
      <KitengePageBanner
        eyebrow="From our boutique to your door"
        title="How to Order & Delivery"
        description="Shop in four simple steps, with flexible payment and dependable delivery across Uganda."
        icon={Truck}
        motif="sunbursts"
      />

      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.title} className="rounded-lg border-2 border-border bg-card p-4">
              <s.icon className="size-5 text-kitenge-flame" />
              <h2 className="mt-3 text-sm font-semibold text-foreground">{s.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10">
        <h2 className="font-serif text-2xl font-bold text-foreground">Delivery zones &amp; fees</h2>
        <div className="mt-4 overflow-hidden rounded-lg border-2 border-border">
          <table className="w-full text-left text-sm">
            <thead className="kitenge-pattern-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Zone</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Fee</th>
              </tr>
            </thead>
            <tbody>
              {ZONES.map((z) => (
                <tr key={z.zone} className="border-t border-border bg-card">
                  <td className="px-4 py-3 text-foreground">{z.zone}</td>
                  <td className="px-4 py-3 text-muted-foreground">{z.time}</td>
                  <td className="px-4 py-3 text-muted-foreground">{z.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-16 sm:grid-cols-2">
        <div className="rounded-lg border-2 border-border bg-card p-5">
          <RotateCcw className="size-5 text-kitenge-flame" />
          <h2 className="mt-3 font-serif text-xl font-bold text-foreground">Returns &amp; exchanges</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Not the right fit? Return or exchange any unworn item with its tags within 7 days of delivery.
            Perfumes must be unopened and sealed. Refunds are sent back through the same payment method within
            3 working days.
          </p>
        </div>
        <div className="rounded-lg border-2 border-border bg-card p-5">
          <Clock className="size-5 text-kitenge-flame" />
          <h2 className="mt-3 font-serif text-xl font-bold text-foreground">Order support hours</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We answer calls, WhatsApp and email 8:00am – 8:00pm, seven days a week. Orders placed after 5:00pm
            are dispatched the next morning.
          </p>
          <Button asChild className="mt-4 kitenge-bar">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
