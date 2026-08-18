import * as React from "react";
import { CATALOG, type Product } from "./catalog";

export interface ProductOverride {
  name?: string;
  price?: number;
  stock?: number;
  image?: string | null;
  description?: string;
}

export interface CartLine {
  id: string;
  qty: number;
}

export interface LogEntry {
  id: string;
  at: string;
  message: string;
}

interface ShopState {
  overrides: Record<string, ProductOverride>;
  cart: CartLine[];
  log: LogEntry[];
}

const EMPTY: ShopState = { overrides: {}, cart: [], log: [] };
const STORAGE_KEY = "agb-shop-state-v1";

interface ShopContextValue {
  products: Product[];
  cart: CartLine[];
  log: LogEntry[];
  cartCount: number;
  cartTotal: number;
  cartDetailed: { product: Product; qty: number }[];
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateProduct: (id: string, patch: ProductOverride) => void;
  resetProduct: (id: string) => void;
}

const ShopContext = React.createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ShopState>(EMPTY);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as ShopState) });
    } catch {
      /* ignore corrupt state */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const products = React.useMemo(
    () => CATALOG.map((p) => ({ ...p, ...(state.overrides[p.id] ?? {}) })),
    [state.overrides],
  );

  const byId = React.useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const pushLog = (prev: ShopState, message: string): LogEntry[] =>
    [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: new Date().toISOString(), message }, ...prev.log].slice(0, 300);

  const value: ShopContextValue = {
    products,
    cart: state.cart,
    log: state.log,
    cartCount: state.cart.reduce((n, l) => n + l.qty, 0),
    cartTotal: state.cart.reduce((n, l) => n + l.qty * (byId.get(l.id)?.price ?? 0), 0),
    cartDetailed: state.cart
      .map((l) => ({ product: byId.get(l.id)!, qty: l.qty }))
      .filter((l) => Boolean(l.product)),
    addToCart: (id, qty = 1) =>
      setState((prev) => {
        const existing = prev.cart.find((l) => l.id === id);
        const cart = existing
          ? prev.cart.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l))
          : [...prev.cart, { id, qty }];
        return { ...prev, cart, log: pushLog(prev, `Cart: added ${qty} × ${byId.get(id)?.name ?? id}`) };
      }),
    setQty: (id, qty) =>
      setState((prev) => ({
        ...prev,
        cart: qty <= 0 ? prev.cart.filter((l) => l.id !== id) : prev.cart.map((l) => (l.id === id ? { ...l, qty } : l)),
      })),
    removeFromCart: (id) =>
      setState((prev) => ({ ...prev, cart: prev.cart.filter((l) => l.id !== id) })),
    clearCart: () => setState((prev) => ({ ...prev, cart: [] })),
    updateProduct: (id, patch) =>
      setState((prev) => ({
        ...prev,
        overrides: { ...prev.overrides, [id]: { ...(prev.overrides[id] ?? {}), ...patch } },
        log: pushLog(prev, `Inventory: updated ${Object.keys(patch).join(", ")} on ${byId.get(id)?.name ?? id}`),
      })),
    resetProduct: (id) =>
      setState((prev) => {
        const overrides = { ...prev.overrides };
        delete overrides[id];
        return { ...prev, overrides, log: pushLog(prev, `Inventory: reset slot ${id} to empty`) };
      }),
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = React.useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}
