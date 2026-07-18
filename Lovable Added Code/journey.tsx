import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  School,
  GraduationCap,
  BookOpen,
  Code2,
  Briefcase,
  Rocket,
  MapPin,
  Mouse,
  ChevronsDown,
} from "lucide-react";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Journey — Sankalp Misal" },
      { name: "description", content: "Drive through the milestones that built me — school to engineering to Rotex and beyond." },
      { property: "og:title", content: "Every Milestone Built Me — Sankalp Misal" },
      { property: "og:description", content: "A cinematic scroll-driven journey through Sankalp's career road." },
    ],
  }),
  component: JourneyPage,
});

type Stop = {
  n: string;
  icon: typeof School;
  title: string;
  date: string;
  place: string;
  body: string;
  tags?: string[];
  side: "left" | "right";
};

const stops: Stop[] = [
  {
    n: "01",
    icon: School,
    title: "School Days",
    date: "2010 — 2018",
    place: "Nipani, Karnataka",
    body: "The foundation years. Curiosity began, dreams took shape, and passion for building was born.",
    side: "left",
  },
  {
    n: "02",
    icon: BookOpen,
    title: "PUC / 12th",
    date: "2018 — 2020",
    place: "Nipani, Karnataka",
    body: "Discipline, dedication and late nights shaped the engineer in me.",
    side: "right",
  },
  {
    n: "03",
    icon: GraduationCap,
    title: "Engineering",
    date: "2022 — 2026",
    place: "Sanjay Ghodawat University",
    body: "B.Tech CSE. Where I discovered my potential, built projects, made memories, and grew.",
    tags: ["Python", "React", "Node", "Postgres"],
    side: "left",
  },
  {
    n: "04",
    icon: Code2,
    title: "Internship",
    date: "2024 — 2025",
    place: "Saiket Systems · Remote",
    body: "Real-world exposure. Learned by building, collaborating and solving problems in production.",
    tags: ["Full-stack", "Agile"],
    side: "right",
  },
  {
    n: "05",
    icon: Briefcase,
    title: "Rotex IT Solutions",
    date: "2026 — Present",
    place: "Kolhapur, Maharashtra",
    body: "Technical Operations Executive. Building automations, dashboards and full-stack tooling that unlock the team.",
    tags: ["Automation", "Dashboards", "DX"],
    side: "left",
  },
  {
    n: "06",
    icon: Rocket,
    title: "Dream Ahead",
    date: "The Future",
    place: "The World",
    body: "Ship AI-first products that feel effortless. Build things people love using — and never stop learning.",
    side: "right",
  },
];

// Zig-zag road path — vertical, curves left/right through a 400x2400 viewBox.
const ROAD_PATH =
  "M 200 40 C 60 220, 340 420, 200 620 S 60 1020, 200 1220 S 340 1620, 200 1820 S 60 2220, 200 2380";

function JourneyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });

  // Car offset along the path (0..1)
  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    // 6 stops spread across path
    const idx = Math.min(stops.length - 1, Math.max(0, Math.floor(v * stops.length + 0.05)));
    setActiveIndex(idx);
  });

  const dash = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative min-h-[520vh] w-full">
      {/* Ambient background */}
      <BackgroundLayers />

      {/* Sticky stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <RoadStage progress={progress} dash={dash} activeIndex={activeIndex} />
      </div>

      {/* Intro */}
      <section className="pointer-events-none absolute inset-x-0 top-0 z-20 mx-auto max-w-6xl px-6 pt-16 md:pt-24">
        <div className="pointer-events-auto">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[10.5px] uppercase tracking-[0.28em] text-cyan-200">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-neon" />
            My Journey
          </div>
          <h1 className="max-w-2xl font-display text-4xl leading-[1.05] font-semibold md:text-6xl">
            Every Milestone{" "}
            <span className="text-gradient">Built Me.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm md:text-base text-muted-foreground">
            A journey of learning, building, failing, improving and never giving up.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs text-muted-foreground">
            <Mouse className="h-3.5 w-3.5 text-cyan-300" />
            Scroll to begin
            <ChevronsDown className="h-3.5 w-3.5 animate-bounce text-cyan-300" />
          </div>
        </div>
      </section>

      {/* Milestone cards positioned along scroll */}
      <div className="relative z-10">
        {stops.map((s, i) => (
          <MilestoneCard
            key={s.n}
            stop={s}
            index={i}
            total={stops.length}
            active={activeIndex === i}
          />
        ))}
      </div>

      {/* Right-side progress rail */}
      <ProgressRail activeIndex={activeIndex} />

      {/* Ending sunrise */}
      <EndingHorizon />
    </div>
  );
}

/* ------------------------- Road Stage ------------------------- */

function RoadStage({
  progress,
  dash,
  activeIndex,
}: {
  progress: MotionValue<number>;
  dash: MotionValue<number>;
  activeIndex: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(0);

  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
  }, []);

  const carOffset = useTransform(progress, (v) => v * pathLen);
  const carPos = useTransform(carOffset, (len) => {
    if (!pathRef.current || pathLen === 0) return { x: 200, y: 40, angle: 0 };
    const clamped = Math.min(Math.max(len, 1), pathLen - 1);
    const p = pathRef.current.getPointAtLength(clamped);
    const p2 = pathRef.current.getPointAtLength(Math.min(pathLen, clamped + 1));
    const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI + 90;
    return { x: p.x, y: p.y, angle };
  });

  const carX = useTransform(carPos, (p) => p.x);
  const carY = useTransform(carPos, (p) => p.y);
  const carA = useTransform(carPos, (p) => p.angle);
  const tilt = useTransform(carA, (a) => Math.sin((a * Math.PI) / 180) * 8);

  const dashOffset = useTransform(dash, (v) => (1 - v) * pathLen);
  const glowOffset = useTransform(dash, (v) => (1 - v) * pathLen);

  return (
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 400 2400"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="road-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.85 0.18 200)" />
            <stop offset="0.5" stopColor="oklch(0.7 0.22 260)" />
            <stop offset="1" stopColor="oklch(0.68 0.24 300)" />
          </linearGradient>
          <linearGradient id="road-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.85 0.18 200 / 0.6)" />
            <stop offset="1" stopColor="oklch(0.68 0.24 300 / 0.5)" />
          </linearGradient>
          <filter id="road-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="car-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Road glow halo */}
        <path
          d={ROAD_PATH}
          fill="none"
          stroke="url(#road-edge)"
          strokeWidth="34"
          strokeLinecap="round"
          opacity="0.35"
          filter="url(#road-glow)"
        />
        {/* Road base */}
        <path
          ref={pathRef}
          d={ROAD_PATH}
          fill="none"
          stroke="oklch(0.18 0.03 265)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* Road edges */}
        <path
          d={ROAD_PATH}
          fill="none"
          stroke="url(#road-edge)"
          strokeWidth="24"
          strokeLinecap="round"
          opacity="0.9"
          style={{ mixBlendMode: "screen" }}
          strokeDasharray="0.001 40"
        />
        {/* Traveled portion — brighter */}
        {pathLen > 0 && (
          <motion.path
            d={ROAD_PATH}
            fill="none"
            stroke="url(#road-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            style={{
              strokeDasharray: pathLen,
              strokeDashoffset: dashOffset,
              filter: "drop-shadow(0 0 10px oklch(0.7 0.22 260))",
            }}
          />
        )}
        {/* Center dashed lane */}
        <path
          d={ROAD_PATH}
          fill="none"
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          strokeDasharray="10 14"
        />
        {/* Milestone dots along path */}
        {stops.map((_, i) => {
          const t = (i + 0.5) / stops.length;
          return <MilestoneDot key={i} pathRef={pathRef} pathLen={pathLen} t={t} active={activeIndex >= i} />;
        })}

        {/* Car */}
        {pathLen > 0 && (
          <motion.g style={{ x: carX, y: carY }}>
            <motion.g style={{ rotate: carA }}>
              {/* underglow */}
              <ellipse cx="0" cy="6" rx="18" ry="6" fill="oklch(0.7 0.22 260)" opacity="0.55" filter="url(#car-glow)" />
              {/* headlight cone */}
              <path d="M -10 -14 L 10 -14 L 22 -60 L -22 -60 Z" fill="oklch(0.85 0.18 200)" opacity="0.18" />
              {/* body */}
              <motion.g style={{ skewX: tilt }}>
                <rect x="-11" y="-16" width="22" height="30" rx="6" fill="oklch(0.22 0.05 265)" stroke="oklch(0.85 0.18 200)" strokeWidth="1.2" />
                <rect x="-8" y="-11" width="16" height="10" rx="2" fill="oklch(0.35 0.09 260)" />
                {/* headlights */}
                <circle cx="-7" cy="-15" r="1.6" fill="white" />
                <circle cx="7" cy="-15" r="1.6" fill="white" />
                {/* taillights */}
                <rect x="-9" y="12" width="4" height="2" fill="oklch(0.7 0.22 25)" />
                <rect x="5" y="12" width="4" height="2" fill="oklch(0.7 0.22 25)" />
              </motion.g>
            </motion.g>
          </motion.g>
        )}
      </svg>

      {/* Moving light particles overlay */}
      <RoadParticles progress={progress} />

      {/* subtle vignette to focus center */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.14_0.03_265/0.85)_100%)]" />
    </div>
  );
}

function MilestoneDot({
  pathRef,
  pathLen,
  t,
  active,
}: {
  pathRef: React.RefObject<SVGPathElement | null>;
  pathLen: number;
  t: number;
  active: boolean;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (pathRef.current && pathLen > 0) {
      const p = pathRef.current.getPointAtLength(pathLen * t);
      setPos({ x: p.x, y: p.y });
    }
  }, [pathRef, pathLen, t]);
  return (
    <g transform={`translate(${pos.x} ${pos.y})`}>
      <circle r="14" fill="oklch(0.7 0.22 260)" opacity={active ? 0.35 : 0.12}>
        {active && (
          <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
        )}
      </circle>
      <circle r="5" fill={active ? "oklch(0.85 0.18 200)" : "oklch(0.4 0.05 265)"} stroke="white" strokeOpacity="0.7" strokeWidth="1" />
    </g>
  );
}

function RoadParticles({ progress }: { progress: MotionValue<number> }) {
  const particles = useMemo(() => Array.from({ length: 14 }, (_, i) => i), []);
  return (
    <svg viewBox="0 0 400 2400" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full">
      {particles.map((i) => (
        <Particle key={i} progress={progress} phase={i / particles.length} />
      ))}
    </svg>
  );
}

function Particle({ progress, phase }: { progress: MotionValue<number>; phase: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(0);
  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
  }, []);
  const pos = useTransform(progress, (v) => {
    if (!pathRef.current || pathLen === 0) return { x: -100, y: -100 };
    const t = ((v * 2 + phase) % 1) * pathLen;
    const p = pathRef.current.getPointAtLength(t);
    return { x: p.x, y: p.y };
  });
  const x = useTransform(pos, (p) => p.x);
  const y = useTransform(pos, (p) => p.y);
  return (
    <>
      <path ref={pathRef} d={ROAD_PATH} fill="none" stroke="transparent" />
      <motion.circle r="1.6" fill="oklch(0.85 0.18 200)" style={{ cx: x, cy: y, opacity: 0.85 }} />
    </>
  );
}

/* ------------------------- Milestone Cards ------------------------- */

function MilestoneCard({
  stop,
  index,
  total,
  active,
}: {
  stop: Stop;
  index: number;
  total: number;
  active: boolean;
}) {
  const Icon = stop.icon;
  // Each card sits in its own scroll band
  const topVh = 60 + index * 80; // pushes cards down the long page
  return (
    <div
      className="relative mx-auto max-w-6xl px-6"
      style={{ marginTop: index === 0 ? `${topVh}vh` : "40vh" }}
    >
      <div
        className={[
          "flex w-full",
          stop.side === "left" ? "justify-start md:justify-start" : "justify-end md:justify-end",
        ].join(" ")}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, margin: "-30% 0px -30% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={[
            "relative w-full max-w-sm rounded-2xl p-6",
            "glass-strong",
            active ? "neon-border glow-purple scale-[1.02]" : "border border-white/10",
            "transition-all duration-500",
          ].join(" ")}
        >
          <div className="absolute -top-3 -right-3 rounded-full bg-gradient-neon px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-background">
            {stop.n}
          </div>

          <div className="flex items-center gap-3">
            <motion.div
              animate={active ? { rotate: [0, -8, 8, 0] } : {}}
              transition={{ duration: 0.8 }}
              className={[
                "grid h-11 w-11 place-items-center rounded-xl",
                active ? "bg-gradient-neon text-background" : "glass text-cyan-300",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
            <div>
              <div className="font-display text-lg font-semibold leading-tight">{stop.title}</div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/80">{stop.date}</div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{stop.body}</p>

          {stop.tags && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {stop.tags.map((t) => (
                <span key={t} className="rounded-full glass px-2 py-0.5 text-[10.5px] text-cyan-200">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3 text-cyan-300" />
            {stop.place}
          </div>

          {/* connector line to road */}
          <div
            aria-hidden
            className={[
              "pointer-events-none absolute top-1/2 hidden h-[2px] w-16 -translate-y-1/2 md:block",
              stop.side === "left" ? "right-[-4rem]" : "left-[-4rem]",
              active ? "bg-gradient-neon opacity-90" : "bg-white/15",
            ].join(" ")}
          />
        </motion.div>
      </div>
      {/* spacer so total scroll length matches */}
      {index === total - 1 && <div style={{ height: "40vh" }} />}
    </div>
  );
}

/* ------------------------- Progress Rail ------------------------- */

function ProgressRail({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="pointer-events-none fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 md:block">
      <div className="flex flex-col items-center gap-3 rounded-full glass px-2 py-4">
        <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Start</div>
        {stops.map((_, i) => {
          const done = i <= activeIndex;
          const current = i === activeIndex;
          return (
            <div key={i} className="relative">
              <span
                className={[
                  "block h-2.5 w-2.5 rounded-full transition-all duration-300",
                  current
                    ? "bg-gradient-neon shadow-[0_0_12px_oklch(0.7_0.22_260)]"
                    : done
                    ? "bg-cyan-300/70"
                    : "bg-white/15",
                ].join(" ")}
              />
              {current && (
                <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-cyan-300/40" />
              )}
            </div>
          );
        })}
        <div className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Future</div>
      </div>
    </div>
  );
}

/* ------------------------- Background ------------------------- */

function BackgroundLayers() {
  const stars = useMemo(
    () => Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 1.4 + 0.3,
      d: Math.random() * 4 + 2,
    })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Stars */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            opacity: 0.6,
            animation: `twinkle ${s.d}s ease-in-out ${i * 0.1}s infinite`,
          }}
        />
      ))}
      {/* Mountain silhouettes */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[38vh] w-full"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path d="M0 300 L120 180 L220 260 L340 140 L460 240 L560 160 L680 240 L820 120 L960 240 L1080 180 L1200 260 L1200 400 L0 400 Z" fill="oklch(0.14 0.04 270)" opacity="0.9" />
        <path d="M0 340 L140 240 L260 300 L400 220 L520 300 L640 240 L780 300 L900 220 L1040 300 L1200 260 L1200 400 L0 400 Z" fill="oklch(0.12 0.05 275)" opacity="0.95" />
      </svg>
      {/* Aurora blobs */}
      <div className="absolute -top-32 left-1/3 h-[60vh] w-[60vw] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.22_260/0.25),transparent_60%)] animate-aurora" />
      <div className="absolute top-1/3 right-0 h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(circle,oklch(0.68_0.24_300/0.2),transparent_60%)] animate-aurora" />
      {/* Fog */}
      <div className="absolute inset-x-0 top-1/2 h-40 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent blur-2xl" />
      <style>{`@keyframes twinkle { 0%,100% { opacity: 0.2 } 50% { opacity: 0.9 } }`}</style>
    </div>
  );
}

function EndingHorizon() {
  return (
    <section className="relative z-10 mt-40 pb-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-lg px-6"
      >
        <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,oklch(0.85_0.18_200/0.9),oklch(0.68_0.24_300/0.4)_60%,transparent_75%)] blur-[2px]" />
        <div className="text-[11px] uppercase tracking-[0.3em] text-cyan-300">Next Destination</div>
        <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
          <span className="text-gradient">The road continues...</span>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The best chapters are still being written. This journey is just getting started.
        </p>
      </motion.div>
    </section>
  );
}
