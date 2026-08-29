import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, ShieldCheck, MessageCircle, Search } from "lucide-react";
import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";
import { formatUGX, CATEGORIES, type Category } from "@/lib/catalog";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Browse" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
  { to: "/delivery", label: "Delivery" },
] as const;

const WHATSAPP_NUMBER = "256700000000"; // Replace with your real WhatsApp business number

function buildWhatsAppMessage(cartDetailed: { product: { name: string; price: number }; qty: number }[]) {
  if (cartDetailed.length === 0) {
    return encodeURIComponent("Hello Amazing Grace Boutique! I'd like to place an order.");
  }
  const lines = cartDetailed.map((l) => `${l.qty} × ${l.product.name} — ${formatUGX(l.product.price * l.qty)}`);
  const total = cartDetailed.reduce((n, l) => n + l.qty * l.product.price, 0);
  const body =
    `Hello Amazing Grace Boutique! I'd like to order:\n\n` +
    lines.join("\n") +
    `\n\n*Total: ${formatUGX(total)}*\n\nPlease confirm availability and delivery details. Thank you!`;
  return encodeURIComponent(body);
}

function MobileSearch({ onDone }: { onDone: () => void }) {
  const navigate = useNavigate();
  const [term, setTerm] = React.useState("");
  return (
    <form
      className="flex items-center gap-2 py-2 md:hidden"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onDone();
        navigate({ to: "/browse", search: { category: "All", q: term.trim(), page: 1 } });
      }}
    >
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
      />
      <button type="submit" aria-label="Search" className="rounded-md bg-accent px-3 py-2 text-accent-foreground">
        <Search className="size-4" />
      </button>
    </form>
  );
}

function HeaderSearch() {
  const navigate = useNavigate();
  const [term, setTerm] = React.useState("");
  const [category, setCategory] = React.useState<Category | "All">("All");

  return (
    <form
      className="ml-4 hidden flex-1 items-center gap-2 md:flex"
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/browse", search: { category, q: term.trim(), page: 1 } });
      }}
      role="search"
    >
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Category | "All")}
        aria-label="Category"
        className="rounded-md border border-input bg-background px-2 py-2 text-xs text-foreground"
      >
        {(["All", ...CATEGORIES] as const).map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search clothes, watches, perfumes…"
        aria-label="Search products"
        className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent"
      />
      <button
        type="submit"
        aria-label="Search"
        className="rounded-md bg-accent px-3 py-2 text-accent-foreground"
      >
        <Search className="size-4" />
      </button>
    </form>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const { cartCount, cartDetailed } = useShop();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="kitenge-bar text-primary-foreground">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs font-semibold tracking-wide drop-shadow-sm">
          Free delivery within Kampala on orders above UGX 200,000 · Pay on delivery available
        </p>
      </div>

      <header className="sticky top-0 z-40 border-b-4 border-transparent kitenge-edge bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <button
            className="rounded-md p-2 text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <Menu className="size-5" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <span className="kitenge-pattern grid size-9 place-items-center rounded-full font-serif text-lg font-bold text-primary-foreground shadow-sm">
              A
            </span>
            <span className="leading-tight">
              <span className="kitenge-text block font-serif text-lg font-bold">Amazing Grace</span>
              <span className="block text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">Boutique</span>
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-5 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <HeaderSearch />


          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/admin"
              className="hidden items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
            >
              <ShieldCheck className="size-4" /> Admin
            </Link>
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              <ShoppingCart className="size-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="grid min-w-5 place-items-center rounded-full bg-foreground/10 px-1.5 text-xs">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        <div className={cn("border-t border-border lg:hidden", open ? "block" : "hidden")}>
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            <MobileSearch onDone={() => setOpen(false)} />
            {[...NAV, { to: "/admin", label: "Admin Inventory" } as const].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-muted-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t-4 border-transparent kitenge-edge kitenge-pattern-soft">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="kitenge-text font-serif text-lg font-bold">Amazing Grace Boutique</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Clothes, watches, perfumes and fine jewelry — curated with grace, delivered with care.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/browse" search={{ category: "Clothes", q: "", page: 1 }}>Clothes</Link></li>
              <li><Link to="/browse" search={{ category: "Watches", q: "", page: 1 }}>Watches</Link></li>
              <li><Link to="/browse" search={{ category: "Perfumes", q: "", page: 1 }}>Perfumes</Link></li>
              <li><Link to="/browse" search={{ category: "Jewelry", q: "", page: 1 }}>Jewelry</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/delivery">Delivery</Link></li>
              <li><Link to="/admin">Admin Inventory</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Reach us</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Kampala Road, Kampala, Uganda</li>
              <li>+256 700 000 000</li>
              <li>hello@amazinggraceboutique.com</li>
            </ul>
          </div>
        </div>
        <div className="kitenge-bar py-4 text-center text-xs font-medium text-primary-foreground">
          © {new Date().getFullYear()} Amazing Grace Boutique. All rights reserved.
        </div>
      </footer>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(cartDetailed)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 sm:bottom-6 sm:right-6"
      >
        <MessageCircle className="size-5 fill-current" />
        <span className="hidden sm:inline">Order on WhatsApp</span>
      </a>
    </div>
  );
}
