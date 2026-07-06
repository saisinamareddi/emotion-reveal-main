import { useEffect, useRef, useState, useCallback } from "react";
import { Camera, CameraOff, Loader2, AlertTriangle } from "lucide-react";

type EmotionLabel =
  | "Neutral"
  | "Happy"
  | "Sad"
  | "Angry"
  | "Surprised"
  | "Fearful"
  | "Disgusted";

const LABEL_MAP: Record<string, EmotionLabel> = {
  neutral: "Neutral",
  happy: "Happy",
  sad: "Sad",
  angry: "Angry",
  surprised: "Surprised",
  fearful: "Fearful",
  disgusted: "Disgusted",
};

const EXPRESSION_ORDER: EmotionLabel[] = [
  "Happy",
  "Surprised",
  "Neutral",
  "Sad",
  "Angry",
  "Fearful",
  "Disgusted",
];

const EXPRESSION_KEYS: Record<EmotionLabel, string> = {
  Neutral: "neutral",
  Happy: "happy",
  Sad: "sad",
  Angry: "angry",
  Surprised: "surprised",
  Fearful: "fearful",
  Disgusted: "disgusted",
};

const EXPRESSION_META: Record<EmotionLabel, { cue: string; color: string }> = {
  Neutral: { cue: "steady", color: "var(--accent-ink)" },
  Happy: { cue: "lifted cheeks", color: "var(--accent-warm)" },
  Sad: { cue: "soft mouth", color: "oklch(0.52 0.12 258)" },
  Angry: { cue: "tight brow", color: "oklch(0.57 0.17 28)" },
  Surprised: { cue: "wide eyes", color: "oklch(0.72 0.13 92)" },
  Fearful: { cue: "tense eyes", color: "oklch(0.55 0.14 298)" },
  Disgusted: { cue: "creased nose", color: "oklch(0.54 0.13 142)" },
};

type ExpressionScore = { label: EmotionLabel; value: number };

const EMPTY_SCORES: ExpressionScore[] = EXPRESSION_ORDER.map((label) => ({
  label,
  value: 0,
}));

type Status =
  | "idle"
  | "loading-model"
  | "requesting-camera"
  | "running"
  | "denied"
  | "no-camera"
  | "error";

export function LiveCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceapiRef = useRef<typeof import("face-api.js") | null>(null);
  const rafRef = useRef<number | null>(null);
  const smoothingRef = useRef<{ label: EmotionLabel; t: number } | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [emotion, setEmotion] = useState<EmotionLabel | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [faceCount, setFaceCount] = useState<number | null>(null);
  const [scores, setScores] = useState<ExpressionScore[]>(EMPTY_SCORES);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle");
    setEmotion(null);
    setFaceCount(null);
    setScores(EMPTY_SCORES);
  }, []);

  const start = useCallback(async () => {
    try {
      setStatus("loading-model");
      if (!faceapiRef.current) {
        const faceapi = await import("face-api.js");
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        ]);
        faceapiRef.current = faceapi;
      }

      setStatus("requesting-camera");
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("no-camera");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setStatus("running");

      const faceapi = faceapiRef.current!;
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,
        scoreThreshold: 0.5,
      });

      let lastRun = 0;
      const loop = async (ts: number) => {
        rafRef.current = requestAnimationFrame(loop);
        if (ts - lastRun < 120) return; // ~8fps inference, plenty for expression
        lastRun = ts;
        if (!videoRef.current || videoRef.current.readyState < 2) return;
        try {
          const results = await faceapi
            .detectAllFaces(videoRef.current, options)
            .withFaceExpressions();
          setFaceCount(results.length);
          if (results.length === 0) {
            setEmotion(null);
            setScores(EMPTY_SCORES);
            return;
          }
          // pick largest face
          const primary = results.reduce((a, b) =>
            a.detection.box.area > b.detection.box.area ? a : b,
          );
          const exprs = primary.expressions as unknown as Record<string, number>;
          let topKey = "neutral";
          let topScore = 0;
          for (const [k, v] of Object.entries(exprs)) {
            if (v > topScore) {
              topScore = v;
              topKey = k;
            }
          }
          setScores(
            EXPRESSION_ORDER.map((label) => ({
              label,
              value: exprs[EXPRESSION_KEYS[label]] ?? 0,
            })),
          );
          const label = LABEL_MAP[topKey] ?? "Neutral";
          const now = performance.now();
          // debounce: require label to persist ~200ms before switching
          if (!smoothingRef.current || smoothingRef.current.label !== label) {
            if (!smoothingRef.current || smoothingRef.current.label !== label) {
              smoothingRef.current = { label, t: now };
            }
          }
          const stable = smoothingRef.current;
          if (stable && now - stable.t >= 180) {
            setEmotion(stable.label);
          }
          setConfidence(topScore);
        } catch (e) {
          // swallow per-frame errors
          console.debug("frame error", e);
        }
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (e: unknown) {
      const err = e as { name?: string; message?: string };
      console.error(err);
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        setStatus("denied");
      } else if (err?.name === "NotFoundError") {
        setStatus("no-camera");
      } else {
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  const running = status === "running";

  return (
    <section
      id="detect"
      className="scroll-mt-24 border-t border-border py-24"
      style={{
        background:
          "linear-gradient(180deg, var(--surface), var(--background) 48%, oklch(0.98 0.022 205))",
      }}
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Live detection
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Make an expression.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Grant camera access and Mien will read your expression in real time. Video
            stays entirely on your device.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-[1.45fr_1fr]">
          <div className="glass-panel relative overflow-hidden rounded-lg">
            <div
              aria-hidden
              className="absolute inset-0 opacity-80"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.47 0.12 178 / 0.13), transparent 36%), linear-gradient(315deg, oklch(0.68 0.15 38 / 0.16), transparent 42%)",
              }}
            />
            <div className="relative aspect-[4/3] w-full">
              <video
                ref={videoRef}
                playsInline
                muted
                className={[
                  "absolute inset-0 h-full w-full object-cover scale-x-[-1]",
                  running ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
              {!running && <IdleOverlay status={status} onStart={start} />}
              {running && (
                <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-5">
                  <EmotionBadge emotion={emotion} confidence={confidence} faceCount={faceCount} />
                  <span className="rounded-full border border-background/40 bg-accent-ink/70 px-2.5 py-1 text-[11px] font-medium text-accent-ink-foreground backdrop-blur">
                    ● LIVE
                  </span>
                </div>
              )}
            </div>
          </div>

          <aside className="glass-panel rounded-lg p-6">
            <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Detected
            </h3>
            <div className="mt-4">
              <div className="text-5xl font-semibold tracking-tight">
                {running ? (emotion ?? "—") : "—"}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {running
                  ? emotion
                    ? `${Math.round(confidence * 100)}% confidence`
                    : faceCount === 0
                      ? "No face detected"
                      : "Analyzing…"
                  : "Idle"}
              </div>
            </div>

            <div className="mt-6 h-px w-full bg-border" />

            <ExpressionMeters active={emotion} running={running} scores={scores} />

            <div className="mt-8 flex gap-2">
              {!running ? (
                <button onClick={start} className="btn-primary btn-primary-hover flex-1">
                  <Camera className="h-4 w-4" />
                  Start camera
                </button>
              ) : (
                <button onClick={stop} className="btn-ghost flex-1">
                  <CameraOff className="h-4 w-4" />
                  Stop
                </button>
              )}
            </div>
          </aside>
        </div>

        <ExpressionGuide active={emotion} running={running} />
      </div>
    </section>
  );
}

function EmotionBadge({
  emotion,
  confidence,
  faceCount,
}: {
  emotion: EmotionLabel | null;
  confidence: number;
  faceCount: number | null;
}) {
  const text =
    emotion ??
    (faceCount === 0 ? "No face" : faceCount && faceCount > 1 ? "Multiple faces" : "…");
  return (
    <div className="rounded-2xl border border-background/30 bg-accent-ink/75 px-4 py-2.5 text-accent-ink-foreground backdrop-blur">
      <div className="text-[11px] uppercase tracking-widest opacity-70">Emotion</div>
      <div className="flex items-baseline gap-2">
        <div className="text-xl font-semibold tracking-tight">{text}</div>
        {emotion && (
          <div className="text-xs opacity-70">{Math.round(confidence * 100)}%</div>
        )}
      </div>
    </div>
  );
}

function IdleOverlay({ status, onStart }: { status: Status; onStart: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div className="max-w-sm text-center">
        {status === "idle" && (
          <>
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border">
              <Camera className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium">Turn on your camera</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll ask your browser for permission. Video never leaves this device.
            </p>
            <button onClick={onStart} className="btn-primary btn-primary-hover mt-5">
              Enable camera
            </button>
          </>
        )}
        {(status === "loading-model" || status === "requesting-camera") && (
          <>
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
            <p className="mt-3 text-sm text-muted-foreground">
              {status === "loading-model" ? "Loading detection model…" : "Waiting for camera…"}
            </p>
          </>
        )}
        {status === "denied" && (
          <ErrorBlock
            title="Camera access denied"
            body="Enable camera permission for this site in your browser settings, then try again."
            onRetry={onStart}
          />
        )}
        {status === "no-camera" && (
          <ErrorBlock
            title="No camera found"
            body="We couldn't find a webcam. Connect one and try again."
            onRetry={onStart}
          />
        )}
        {status === "error" && (
          <ErrorBlock
            title="Something went wrong"
            body="The detector couldn't start. Please retry."
            onRetry={onStart}
          />
        )}
      </div>
    </div>
  );
}

function ExpressionMeters({
  active,
  running,
  scores,
}: {
  active: EmotionLabel | null;
  running: boolean;
  scores: ExpressionScore[];
}) {
  return (
    <div className="mt-6 space-y-3">
      {scores.map(({ label, value }) => {
        const meta = EXPRESSION_META[label];
        const isActive = running && active === label;
        const width = running ? `${Math.max(4, Math.round(value * 100))}%` : "4%";
        return (
          <div key={label}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className={isActive ? "font-semibold text-foreground" : "text-muted-foreground"}>
                {label}
              </span>
              <span className="text-muted-foreground">
                {running ? `${Math.round(value * 100)}%` : "--"}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width,
                  background: isActive
                    ? `linear-gradient(90deg, ${meta.color}, var(--accent-ink))`
                    : meta.color,
                  opacity: running ? 1 : 0.35,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ExpressionGuide({
  active,
  running,
}: {
  active: EmotionLabel | null;
  running: boolean;
}) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {EXPRESSION_ORDER.map((label) => {
        const meta = EXPRESSION_META[label];
        const isActive = running && active === label;
        return (
          <div
            key={label}
            className={[
              "rounded-lg border bg-background/75 p-4 transition-all",
              isActive ? "border-accent-ink shadow-lg" : "border-border",
            ].join(" ")}
          >
            <div
              className="mb-3 h-1.5 w-10 rounded-full"
              style={{ background: meta.color }}
            />
            <div className="text-sm font-medium">{label}</div>
            <div className="mt-1 text-xs text-muted-foreground">{meta.cue}</div>
          </div>
        );
      })}
    </div>
  );
}

function ErrorBlock({
  title,
  body,
  onRetry,
}: {
  title: string;
  body: string;
  onRetry: () => void;
}) {
  return (
    <>
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <button onClick={onRetry} className="btn-ghost mt-5">
        Try again
      </button>
    </>
  );
}
