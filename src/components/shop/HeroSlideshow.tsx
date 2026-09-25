import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/catalog";
import { CATEGORY_IMAGES } from "@/lib/category-images";
import { cn } from "@/lib/utils";

const SLIDES = CATEGORIES.map((category: Category) => ({
  category,
  image: CATEGORY_IMAGES[category],
}));

export function HeroSlideshow() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const go = React.useCallback(
    (next: number) => setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length),
    []
  );

  React.useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 4500);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-hero-foreground/20 shadow-xl sm:aspect-[16/9] lg:aspect-[4/3]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <Link
          key={slide.category}
          to="/browse"
          search={{ category: slide.category, q: "", page: 1 }}
          aria-hidden={i !== index}
          tabIndex={i === index ? 0 : -1}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <img
            src={slide.image}
            alt={slide.category}
            className="h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-3 pt-8 sm:p-4 sm:pt-10">
            <span className="block font-serif text-lg font-bold text-hero-foreground sm:text-xl">
              {slide.category}
            </span>
            <span className="text-[0.65rem] text-hero-foreground/80 sm:text-xs">Tap to shop this category</span>
          </span>
        </Link>
      ))}

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => go(index - 1)}
        className="absolute left-2 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-foreground/50 text-hero-foreground backdrop-blur-sm transition hover:bg-foreground/70 sm:size-10"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => go(index + 1)}
        className="absolute right-2 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-foreground/50 text-hero-foreground backdrop-blur-sm transition hover:bg-foreground/70 sm:size-10"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.category}
            type="button"
            aria-label={`Go to ${slide.category} slide`}
            onClick={() => go(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-5 bg-hero-foreground" : "w-1.5 bg-hero-foreground/50 hover:bg-hero-foreground/80"
            )}
          />
        ))}
      </div>
    </div>
  );
}
