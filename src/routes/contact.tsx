import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import * as React from "react";
import { SiteLayout } from "@/components/shop/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Amazing Grace Boutique" },
      {
        name: "description",
        content:
          "Reach Amazing Grace Boutique in Kampala by phone, email or WhatsApp, or send us a message about orders, delivery and returns.",
      },
      { property: "og:title", content: "Contact Amazing Grace Boutique" },
      { property: "og:description", content: "Phone, email, store address, opening hours and a message form." },
    ],
  }),
  component: ContactPage,
});

const DETAILS = [
  { icon: MapPin, label: "Store", value: "Plot 24, Kampala Road, Kampala, Uganda" },
  { icon: Phone, label: "Phone / WhatsApp", value: "+256 700 000 000" },
  { icon: Mail, label: "Email", value: "hello@amazinggraceboutique.com" },
  { icon: Clock, label: "Open", value: "Mon–Sat 8:00am–8:00pm · Sun 10:00am–5:00pm" },
];

const FAQ = [
  { q: "How long does delivery take?", a: "Same day within Kampala when ordered before 3pm, and 1–3 working days elsewhere in Uganda." },
  { q: "Can I pay on delivery?", a: "Yes. We accept cash, mobile money and card on delivery within Kampala." },
  { q: "What is your returns policy?", a: "Unworn items in original packaging can be returned or exchanged within 7 days of delivery." },
];

function ContactPage() {
  const [sent, setSent] = React.useState(false);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-foreground">Contact</h1>
        <p className="mt-2 text-muted-foreground">
          Questions about an order, a size, or a scent? We would love to hear from you.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {DETAILS.map((d) => (
              <div key={d.label} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                <d.icon className="mt-0.5 size-5 shrink-0 text-accent-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{d.label}</p>
                  <p className="text-sm text-muted-foreground">{d.value}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            className="space-y-4 rounded-lg border border-border bg-card p-6"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <h2 className="font-serif text-xl font-bold text-foreground">Send a message</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="Your name" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <input required type="email" placeholder="Email address" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <input placeholder="Subject" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <textarea
              required
              rows={5}
              placeholder="How can we help?"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <button className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground">
              Send message
            </button>
            {sent && (
              <p className="text-sm text-muted-foreground">
                Thank you — your message has been noted. We reply within one working day.
              </p>
            )}
          </form>
        </div>

        <h2 className="mt-12 font-serif text-2xl font-bold text-foreground">Frequently asked</h2>
        <div className="mt-4 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="rounded-lg border border-border bg-card p-4">
              <summary className="cursor-pointer text-sm font-semibold text-foreground">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
