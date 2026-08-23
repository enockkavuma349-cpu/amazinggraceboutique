import clothes from "@/assets/cat-clothes.jpg";
import watches from "@/assets/cat-watches.jpg";
import perfumes from "@/assets/cat-perfumes.jpg";
import jewelry from "@/assets/cat-jewelry.jpg";
import type { Category } from "./catalog";

export const CATEGORY_IMAGES: Record<Category, string> = {
  Clothes: clothes,
  Watches: watches,
  Perfumes: perfumes,
  Jewelry: jewelry,
};
