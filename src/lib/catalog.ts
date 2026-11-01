export type Category = "Clothes" | "Watches" | "Perfumes" | "Jewelry";

export interface Product {
  id: string;
  slot: number;
  name: string;
  category: Category;
  subcategory: string;
  price: number;
  stock: number;
  image: string | null;
  description: string;
}

export const CATEGORIES: Category[] = ["Clothes", "Watches", "Perfumes", "Jewelry"];

const BLUEPRINT: Record<Category, { count: number; subs: string[]; base: number; step: number }> = {
  Clothes: {
    count: 70,
    subs: ["Dresses", "Gomesi & Kitenge", "Shirts", "Trousers", "Suits", "Kidswear", "Outerwear"],
    base: 45000,
    step: 7500,
  },
  Watches: {
    count: 40,
    subs: ["Luxury", "Classic Leather", "Sports", "Digital", "Unisex"],
    base: 120000,
    step: 22000,
  },
  Perfumes: {
    count: 40,
    subs: ["Oriental", "Floral", "Fresh & Citrus", "Oud", "Body Mists"],
    base: 65000,
    step: 12000,
  },
  Jewelry: {
    count: 50,
    subs: ["Necklaces", "Earrings", "Bracelets", "Rings", "Anklets", "Bridal Sets"],
    base: 30000,
    step: 9000,
  },
};

// Shop photos for the first Clothes slots, in slot order (public/products/clothes-NN.jpg).
const CLOTHES_PHOTOS: string[] = [
  "Dresses", "Dresses", "Gomesi & Kitenge", "Dresses", "Dresses",
  "Outerwear", "Shirts", "Dresses", "Dresses", "Shirts",
  "Shirts", "Dresses", "Dresses", "Fabrics", "Dresses",
  "Gomesi & Kitenge", "Dresses", "Dresses", "Dresses", "Shirts",
  "Suits", "Shirts", "Outerwear", "Gomesi & Kitenge", "Shirts",
  "Gomesi & Kitenge", "Outerwear", "Outerwear", "Gomesi & Kitenge", "Gomesi & Kitenge",
  "Shirts", "Fabrics", "Dresses", "Fabrics", "Dresses",
  "Dresses", "Dresses", "Shirts", "Outerwear", "Dresses",
  "Dresses", "Dresses", "Dresses", "Gomesi & Kitenge", "Dresses",
  "Dresses", "Dresses", "Dresses", "Suits", "Gomesi & Kitenge",
  "Dresses", "Gomesi & Kitenge", "Gomesi & Kitenge",
];

function buildCatalog(): Product[] {
  const items: Product[] = [];
  let slot = 1;
  for (const category of CATEGORIES) {
    const cfg = BLUEPRINT[category];
    for (let i = 0; i < cfg.count; i++) {
      const photoSub = category === "Clothes" ? CLOTHES_PHOTOS[i] : undefined;
      const subcategory = photoSub ?? (cfg.subs[i % cfg.subs.length] as string);
      const n = i + 1;
      items.push({
        id: `${category.toLowerCase()}-${n}`,
        slot,
        name: `${subcategory} — Slot ${String(slot).padStart(3, "0")}`,
        category,
        subcategory,
        price: cfg.base + ((i * cfg.step) % (cfg.step * 9)),
        stock: 4 + ((i * 3) % 21),
        image: photoSub ? `/products/clothes-${String(n).padStart(2, "0")}.jpg` : null,
        description: photoSub
          ? `Amazing Grace Boutique ${subcategory.toLowerCase()} piece, available in store. Update the name and details from the admin inventory log.`
          : `Reserved display slot for an Amazing Grace Boutique ${subcategory.toLowerCase()} piece. Upload a photo and update the details from the admin inventory log.`,
      });
      slot++;
    }
  }
  return items;
}

export const CATALOG: Product[] = buildCatalog();

export const formatUGX = (amount: number) =>
  new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(amount);
