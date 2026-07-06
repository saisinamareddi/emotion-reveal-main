import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { LiveCamera } from "@/components/site/LiveCamera";
import { Features } from "@/components/site/Features";
import { Feedback } from "@/components/site/Feedback";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mien — Real-time emotion detection in your browser" },
      {
        name: "description",
        content:
          "Mien reads seven core facial expressions from your webcam in real time. On-device AI, nothing uploaded.",
      },
      { property: "og:title", content: "Mien — Real-time emotion detection" },
      {
        property: "og:description",
        content:
          "See what your face is really saying. Live in-browser facial expression detection, private by design.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <LiveCamera />
      <Features />
      <Feedback />
      <Footer />
    </main>
  );
}
