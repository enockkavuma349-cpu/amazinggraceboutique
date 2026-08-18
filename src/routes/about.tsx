import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/shop/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Amazing Grace Boutique" },
      {
        name: "description",
        content:
          "Amazing Grace Boutique is a Kampala-based fashion house selling clothes, watches, perfumes and jewelry with genuine goods and honest pricing.",
      },
      { property: "og:title", content: "About Amazing Grace Boutique" },
      { property: "og:description", content: "Our story, values and promise to every customer." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { title: "Authenticity", text: "We source directly and inspect every item before it reaches a shelf or a slot." },
  { title: "Fair pricing", text: "Boutique quality without boutique guilt. What you see is what you pay." },
  { title: "Grace in service", text: "Kind, patient help before, during and long after your purchase." },
  { title: "Community", text: "We hire and train locally, and we grow with the customers who grow with us." },
];

const MILESTONES = [
  { year: "2019", text: "Started as a single stall selling handpicked dresses and kitenge." },
  { year: "2021", text: "Added watches and perfumes after customer requests kept coming." },
  { year: "2023", text: "Opened our flagship store on Kampala Road with a dedicated jewelry counter." },
  { year: "2026", text: "Launched this online boutique with 200+ product slots and countrywide delivery." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-foreground">About Us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Amazing Grace Boutique began with one simple belief: everyone deserves to feel beautifully put
          together, without paying a fortune or gambling on quality.
        </p>
        <p className="mt-4 text-muted-foreground">
          What started as a single stall in Kampala is now a full boutique carrying clothes for every
          occasion, watches that last, perfumes that linger and jewelry made to be handed down. Our online
          shop brings that same counter-side care to your phone — browse, add to cart, and we handle the rest.
        </p>

        <h2 className="mt-12 font-serif text-2xl font-bold text-foreground">What we stand for</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-serif text-2xl font-bold text-foreground">Our journey</h2>
        <ol className="mt-4 space-y-4 border-l border-border pl-6">
          {MILESTONES.map((m) => (
            <li key={m.year} className="relative">
              <span className="absolute -left-[1.9rem] top-1.5 size-3 rounded-full bg-accent" />
              <p className="font-semibold text-foreground">{m.year}</p>
              <p className="text-sm text-muted-foreground">{m.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-lg border border-border bg-secondary p-6">
          <h2 className="font-serif text-xl font-bold text-foreground">Come shop with us</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Over 200 product slots waiting to be explored across four departments.
          </p>
          <Link
            to="/browse"
            search={{ category: "All", q: "", page: 1 }}
            className="mt-4 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            Browse the shop
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
