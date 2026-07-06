import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-40 pb-28"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.98 0.013 225), oklch(0.94 0.035 210) 48%, oklch(0.98 0.025 55))",
      }}
    >
      {/* subtle grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--accent-ink) 1px, transparent 1px), linear-gradient(90deg, var(--accent-ink) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-warm" />
          Real-time emotion detection · runs on your device
        </div>

        <h1 className="fade-in-up text-balance text-5xl font-semibold tracking-[-0.03em] leading-[1.02] sm:text-6xl md:text-7xl">
          See what your face
          <br />
          is really saying.
        </h1>

        <p className="fade-in-up mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Mien reads seven core emotions from your webcam in real time — right in your
          browser. Nothing uploaded, nothing stored.
        </p>

        <div className="fade-in-up mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="#detect" className="btn-primary btn-primary-hover">
            Start live detection
            <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#features" className="btn-ghost">
            How it works
          </a>
        </div>

        {/* face scan illustration */}
        <div className="mx-auto mt-20 max-w-md">
          <FaceScan />
        </div>
      </div>
    </section>
  );
}

function FaceScan() {
  return (
    <div className="glass-panel relative aspect-square rounded-lg p-6">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <clipPath id="scan">
            <rect x="0" y="0" width="200" height="200">
              <animate attributeName="height" values="0;200;0" dur="3s" repeatCount="indefinite" />
            </rect>
          </clipPath>
        </defs>
        {/* face outline */}
        <g fill="none" stroke="var(--accent-ink)" strokeWidth="1.25" strokeLinecap="round">
          <ellipse cx="100" cy="100" rx="52" ry="66" opacity="0.5" />
          <circle cx="82" cy="92" r="3" fill="var(--accent-ink)" />
          <circle cx="118" cy="92" r="3" fill="var(--accent-warm)" />
          <path d="M82 122 Q100 134 118 122" />
          <path d="M70 80 Q82 74 94 80" opacity="0.6" />
          <path d="M106 80 Q118 74 130 80" opacity="0.6" />
        </g>
        {/* scan line */}
        <g clipPath="url(#scan)">
          <line x1="10" y1="100" x2="190" y2="100" stroke="var(--accent-warm)" strokeWidth="1">
            <animate attributeName="y1" values="20;180;20" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y2" values="20;180;20" dur="3s" repeatCount="indefinite" />
          </line>
        </g>
        {/* corner brackets */}
        <g stroke="var(--accent-ink)" strokeWidth="1.5" fill="none">
          <path d="M20 40 V20 H40" />
          <path d="M160 20 H180 V40" />
          <path d="M180 160 V180 H160" />
          <path d="M40 180 H20 V160" />
        </g>
      </svg>
    </div>
  );
}
