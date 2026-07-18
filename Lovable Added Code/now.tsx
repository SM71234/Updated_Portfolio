import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import {
  Activity,
  BookOpen,
  Compass,
  Hammer,
  Lightbulb,
  Rocket,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/now")({
  head: () => ({
    meta: [
      { title: "Now — Sankalp Misal" },
      {
        name: "description",
        content:
          "What Sankalp Misal is focused on right now — building, learning, reading, and available for.",
      },
      { property: "og:title", content: "Now — Sankalp Misal" },
      {
        property: "og:description",
        content: "Live status page — currently building, learning, and available for.",
      },
    ],
  }),
  component: NowPage,
});

const now = [
  {
    icon: Compass,
    label: "Current Focus",
    body: "Deep work on AI-assisted developer tooling and premium full-stack products.",
    tint: "from-cyan-400 to-blue-500",
  },
  {
    icon: Hammer,
    label: "Currently Building",
    body: "RedLeaf — AI IPO analysis platform, and Auto Sarthi mobility experience.",
    tint: "from-blue-500 to-purple-500",
  },
  {
    icon: Lightbulb,
    label: "Currently Learning",
    body: "Advanced LangGraph agents, streaming UIs, and Postgres performance engineering.",
    tint: "from-purple-500 to-fuchsia-500",
  },
  {
    icon: Target,
    label: "Current Goal",
    body: "Ship products that feel effortless — combining strong systems with beautiful UI.",
    tint: "from-emerald-400 to-cyan-500",
  },
  {
    icon: Rocket,
    label: "Current Stack",
    body: "Python · FastAPI · Node · React · Postgres · TanStack · Lovable AI",
    tint: "from-pink-500 to-purple-500",
  },
  {
    icon: BookOpen,
    label: "Reading",
    body: "Designing Data-Intensive Applications · The Pragmatic Programmer",
    tint: "from-cyan-400 to-emerald-400",
  },
];

function NowPage() {
  return (
    <PageShell
      eyebrow="/now"
      title="What I'm doing now"
      subtitle="A living snapshot — updated as I learn, ship, and grow."
    >
      <div className="mb-10 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <span className="font-medium text-emerald-300">Available for Opportunities</span>
        <span className="text-muted-foreground">· Remote friendly · India</span>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {now.map((n, i) => (
          <motion.div
            key={n.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="group relative overflow-hidden rounded-2xl glass-strong p-6 hover:bg-white/[0.06]"
          >
            <div
              className={`absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${n.tint} opacity-20 blur-3xl transition-opacity group-hover:opacity-40`}
            />
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl glass">
                <n.icon className="h-4 w-4 text-cyan-300" />
              </div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {n.label}
              </div>
            </div>
            <p className="mt-4 text-base leading-relaxed">{n.body}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
        <Activity className="h-3.5 w-3.5" /> last updated · today
      </div>
    </PageShell>
  );
}
