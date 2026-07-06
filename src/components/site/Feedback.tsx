import { useEffect, useState, type FormEvent } from "react";
import { Star } from "lucide-react";

type Item = { id: string; name: string; body: string; rating: number };

const SEED: Item[] = [
  {
    id: "s1",
    name: "Priya N.",
    body: "Wild — I ran a usability test and used Mien to tag frustration in real time. Way less busywork.",
    rating: 5,
  },
  {
    id: "s2",
    name: "Marcus T.",
    body: "Runs locally, feels instant, and the UI stays out of the way. Exactly what I wanted.",
    rating: 5,
  },
  {
    id: "s3",
    name: "Ana R.",
    body: "I use it as a tiny mood journal after long focus sessions. Surprisingly grounding.",
    rating: 4,
  },
];

const STORAGE_KEY = "mien.feedback.v1";

export function Feedback() {
  const [items, setItems] = useState<Item[]>(SEED);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Item[];
        if (Array.isArray(parsed)) setItems([...parsed, ...SEED]);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    const item: Item = {
      id: crypto.randomUUID(),
      name: name.trim(),
      body: body.trim(),
      rating,
    };
    const userItems = items.filter((i) => !SEED.some((s) => s.id === i.id));
    const next = [item, ...userItems];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setItems([...next, ...SEED]);
    setName("");
    setBody("");
    setRating(5);
  }

  return (
    <section id="feedback" className="scroll-mt-24 border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Feedback</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            What early users say.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Share how you'd use Mien — your note will appear alongside these.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          <ul className="grid gap-4 sm:grid-cols-2">
            {items.slice(0, 6).map((i) => (
              <li
                key={i.id}
                className="rounded-3xl border border-border bg-background p-6"
              >
                <Stars value={i.rating} />
                <p className="mt-3 text-sm leading-relaxed">{i.body}</p>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar name={i.name} />
                  <span className="text-sm font-medium">{i.name}</span>
                </div>
              </li>
            ))}
          </ul>

          <form
            onSubmit={submit}
            className="rounded-3xl border border-border bg-surface/40 p-6"
          >
            <h3 className="text-lg font-medium tracking-tight">Leave feedback</h3>
            <p className="mt-1 text-sm text-muted-foreground">Stored locally on your device.</p>

            <div className="mt-5 space-y-4">
              <Field label="Name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={40}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent-ink"
                />
              </Field>
              <Field label="Message">
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  rows={4}
                  maxLength={280}
                  placeholder="A short note about your experience"
                  className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent-ink"
                />
              </Field>
              <Field label="Rating">
                <RatingPicker value={rating} onChange={setRating} />
              </Field>
              <button type="submit" className="btn-primary btn-primary-hover w-full">
                Submit feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          strokeWidth={1.5}
          fill={i < value ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

function RatingPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className="rounded-md p-1 transition-colors hover:bg-muted"
        >
          <Star
            className="h-5 w-5"
            strokeWidth={1.5}
            fill={n <= value ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-ink text-xs font-medium text-accent-ink-foreground">
      {initial}
    </span>
  );
}
