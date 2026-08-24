import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type KitengePageBannerProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  motif?: "diamonds" | "sunbursts" | "weave";
};

const MOTIF_CLASSES = {
  diamonds: "kitenge-motif-diamonds",
  sunbursts: "kitenge-motif-sunbursts",
  weave: "kitenge-motif-weave",
} as const;

export function KitengePageBanner({
  eyebrow,
  title,
  description,
  icon: Icon,
  motif = "diamonds",
}: KitengePageBannerProps) {
  return (
    <section className={cn("kitenge-page-banner", MOTIF_CLASSES[motif])}>
      <div className="relative z-10 mx-auto flex max-w-7xl items-center gap-4 px-4 py-8 sm:py-10">
        <div className="grid size-12 shrink-0 place-items-center rounded-full border border-primary-foreground/35 bg-primary-foreground/10 backdrop-blur-sm sm:size-14">
          <Icon className="size-6 text-primary-foreground" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/80">{eyebrow}</p>
          <h1 className="mt-1 font-serif text-3xl font-bold leading-tight text-primary-foreground sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-primary-foreground/85 sm:text-base">{description}</p>
        </div>
      </div>
    </section>
  );
}