import { useEffect, useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";

const NAV = [
  { href: "#home", label: "Home" },
  { href: "#detect", label: "Live Detection" },
  { href: "#features", label: "Features" },
  { href: "#feedback", label: "Feedback" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-ink text-accent-ink-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-[17px]">Mien</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a href="#detect" className="btn-primary btn-primary-hover">
            Try live demo
          </a>
        </div>

        <button
          className="md:hidden -mr-2 rounded-md p-2"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4" aria-label="Mobile">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#detect"
              onClick={() => setOpen(false)}
              className="btn-primary btn-primary-hover mt-2 w-full"
            >
              Try live demo
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
