import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-ink text-accent-ink-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              Mien
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Real-time facial expression detection that runs entirely in your browser.
              Your camera feed never leaves this device.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol title="Product" links={[
              { href: "#home", label: "Home" },
              { href: "#detect", label: "Live detection" },
              { href: "#features", label: "Features" },
              { href: "#feedback", label: "Feedback" },
            ]} />
            <FooterCol title="Company" links={[
              { href: "#", label: "About" },
              { href: "#", label: "Privacy" },
              { href: "#", label: "Contact" },
            ]} />
            <div>
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground">
                Social
              </h4>
              <div className="mt-4 flex gap-2">
                <SocialIcon href="#" label="Twitter"><Twitter className="h-4 w-4" /></SocialIcon>
                <SocialIcon href="#" label="GitHub"><Github className="h-4 w-4" /></SocialIcon>
                <SocialIcon href="#" label="LinkedIn"><Linkedin className="h-4 w-4" /></SocialIcon>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Mien. All rights reserved.</span>
          <span>Camera access is used only in your browser — no video is uploaded.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-widest text-muted-foreground">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-foreground/80 hover:text-foreground">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/80 transition-colors hover:bg-accent-ink hover:text-accent-ink-foreground"
    >
      {children}
    </a>
  );
}
