import { useRouterState } from "@tanstack/react-router";
import * as React from "react";

const SELECTOR = "main section, main article, main h1, main h2, main table, main .grid > *, [data-reveal]";

export function ScrollEffects() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const barRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    const t = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (el.classList.contains("reveal")) return;
        const idx = Array.from(el.parentElement?.children ?? []).indexOf(el);
        el.style.setProperty("--reveal-delay", `${Math.min(idx % 8, 7) * 60}ms`);
        el.classList.add("reveal");
        io.observe(el);
      });
    }, 50);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, [path]);

  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      barRef.current?.style.setProperty("--p", String(h > 0 ? window.scrollY / h : 0));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div ref={barRef} className="scroll-progress" aria-hidden />;
}
