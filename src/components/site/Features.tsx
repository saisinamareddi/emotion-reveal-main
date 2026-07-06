import {
  Cpu,
  ShieldCheck,
  Smile,
  Frown,
  Angry,
  Meh,
  Zap,
  Ghost,
  HeartPulse,
  Users,
  Sparkles,
} from "lucide-react";

const emotions = [
  { icon: Smile, label: "Happy", cue: "lifted cheeks", color: "var(--accent-warm)" },
  { icon: Zap, label: "Surprised", cue: "wide eyes", color: "oklch(0.72 0.13 92)" },
  { icon: Sparkles, label: "Neutral", cue: "steady", color: "var(--accent-ink)" },
  { icon: Frown, label: "Sad", cue: "soft mouth", color: "oklch(0.52 0.12 258)" },
  { icon: Angry, label: "Angry", cue: "tight brow", color: "oklch(0.57 0.17 28)" },
  { icon: Ghost, label: "Fearful", cue: "tense eyes", color: "oklch(0.55 0.14 298)" },
  { icon: Meh, label: "Disgusted", cue: "creased nose", color: "oklch(0.54 0.13 142)" },
];

const useCases = [
  { icon: HeartPulse, title: "Mental wellness", body: "Track your mood over sessions and notice patterns you'd otherwise miss." },
  { icon: Users, title: "UX research", body: "Layer real reactions onto usability studies without heavy instrumentation." },
  { icon: Sparkles, title: "Play & social", body: "Trigger effects, games, or avatars from natural facial expressions." },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Features</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Simple pieces, thoughtfully arranged.
          </h2>
          <p className="mt-4 text-muted-foreground">
            A tiny neural network reads your webcam frame-by-frame and turns micro-movements
            into a readable emotion — with none of your video ever leaving the tab.
          </p>
        </div>

        {/* two anchor pillars */}
        <div className="mt-16 grid gap-4 md:grid-cols-2">
          <Pillar
            icon={<Cpu className="h-5 w-5" />}
            title="On-device inference"
            body="A tiny face detector and expression network load once, then run entirely in your browser at interactive speed."
          />
          <Pillar
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Private by design"
            body="No frames are uploaded, buffered, or stored server-side. Close the tab and every trace disappears."
          />
        </div>

        {/* emotions grid */}
        <div className="glass-panel mt-12 rounded-lg p-8">
          <h3 className="text-sm uppercase tracking-widest text-muted-foreground">
            Seven expressions
          </h3>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {emotions.map((e) => (
              <li
                key={e.label}
                className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background/80 px-3 py-5 text-center text-sm transition-all hover:-translate-y-0.5 hover:border-accent-ink/40 hover:shadow-lg"
              >
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    background: `color-mix(in oklch, ${e.color} 18%, transparent)`,
                    color: e.color,
                  }}
                >
                  <e.icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <span className="font-medium">{e.label}</span>
                <span className="text-xs text-muted-foreground">{e.cue}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* use cases */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {useCases.map((u) => (
            <div key={u.title} className="glass-panel rounded-lg p-6">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border">
                <u.icon className="h-4 w-4" strokeWidth={1.7} />
              </div>
              <h4 className="mt-4 text-lg font-medium tracking-tight">{u.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{u.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pillar({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="glass-panel group relative overflow-hidden rounded-lg p-8">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-ink text-accent-ink-foreground">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-medium tracking-tight">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
