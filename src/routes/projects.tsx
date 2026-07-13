import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";

// Import project images
import autoRickshawDashboard from "@/assets/auto-rickshaw-dashboard.jpg";
import drhpBrainDashboard from "@/assets/drhp-brain-dashboard.jpg";
import tradingDeskSetup from "@/assets/trading-desk-setup.jpg";
import holographicBrainLab from "@/assets/holographic-brain-lab.jpg";

export const Route = createFileRoute("/projects")({
  component: Projects,
  head: () => ({ meta: [
    { title: "Projects — Sankalp Misal" },
    { name: "description", content: "Selected projects — full-stack, AI, tools, and systems." },
  ]}),
});

type Project = {
  title: string;
  category: "Mega Project" | "AI" | "Systems" | "Tools";
  description: string;
  tech: string[];
  features: string[];
  github?: string;
  demo?: string;
  accent: string;
  image?: string;
};

const projects: Project[] = [
  {
    title: "Auto Sarthi",
    category: "Mega Project",
    description: "An intelligent automobile companion connecting vehicle owners with services, diagnostics, and roadside assistance in real time.",
    tech: ["React", "Node.js", "PostgreSQL", "Maps API", "Socket.io"],
    features: ["Live service tracking", "Vehicle diagnostics", "Booking & payments", "Owner dashboard"],
    demo: "#",
    accent: "from-cyan-400 via-blue-500 to-purple-500",
    image: autoRickshawDashboard,
  },
  {
    title: "DocManager",
    category: "Mega Project",
    description: "A secure, multi-tenant document management platform with granular permissions, versioning, and search.",
    tech: ["React", "Express", "PostgreSQL", "S3", "Elasticsearch"],
    features: ["Role-based access", "Full-text search", "Version history", "Audit trail"],
    github: "https://github.com/SM71234/DocManager.git",
    accent: "from-purple-500 via-fuchsia-500 to-pink-500",
    image: drhpBrainDashboard,
  },
  {
    title: "Trader Dashboard",
    category: "Systems",
    description: "A comprehensive trading workspace and visualization tool analyzing market volume, order logs, and provider performance.",
    tech: ["Python", "Pandas", "Matplotlib", "Tkinter"],
    features: ["Real-time data visualization", "Order log analysis", "Multi-provider tracking", "Performance metrics"],
    github: "https://github.com/SM71234/Trader-Insight.git",
    accent: "from-blue-600 via-teal-500 to-indigo-600",
    image: tradingDeskSetup,
  },
  {
    title: "Jarvis Voice Assistant",
    category: "AI",
    description: "A Python-powered voice assistant that automates system tasks, answers queries, and controls apps by voice.",
    tech: ["Python", "SpeechRecognition", "OpenAI", "PyAutoGUI"],
    features: ["Wake-word activation", "System automation", "Web queries", "Custom skills"],
    github: "https://github.com/SM71234/Jarvis--Voice-Assistant-Python-.git",
    accent: "from-blue-500 via-indigo-500 to-purple-600",
    image: holographicBrainLab,
  },
  {
    title: "My Very Own ChatGPT",
    category: "AI",
    description: "A polished chat interface over LLM APIs with streaming, prompt library, and persistent conversations.",
    tech: ["React", "Node.js", "OpenAI", "SSE"],
    features: ["Streaming replies", "Prompt library", "Conversation memory", "Markdown rendering"],
    github: "https://github.com/SM71234/My-own-Chat-GPT-.git", demo: "https://my-own-chat-gpt-gamma.vercel.app",
    accent: "from-emerald-400 via-cyan-500 to-blue-600",
  },
  {
    title: "Cricket Scoreboard System",
    category: "Systems",
    description: "A real-time cricket scoreboard and match management system with live commentary and stats.",
    tech: ["Java", "Swing", "MySQL"],
    features: ["Live scoring", "Player stats", "Match history", "Reports"],
    github: "https://github.com/SM71234/Cricket-scoreboard-project.git",
    accent: "from-orange-400 via-rose-500 to-purple-600",
  },
  {
    title: "Student Information System",
    category: "Tools",
    description: "A complete SIS for managing students, courses, attendance, and grades with role-based dashboards.",
    tech: ["PHP", "MySQL", "Bootstrap"],
    features: ["Admin/Faculty/Student roles", "Attendance", "Grades", "Reports"],
    github: "https://github.com/SM71234/SIMS.git",
    accent: "from-cyan-400 via-teal-500 to-emerald-500",
  },
];

const categories = ["All", "Mega Project", "AI", "Systems", "Tools"] as const;

function Projects() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const list = projects.filter((p) => filter === "All" || p.category === filter);
  const [idx, setIdx] = useState(0);

  useEffect(() => { setIdx(0); }, [filter]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % list.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [list.length]);

  const project = list[idx];
  const next = () => setIdx((i) => (i + 1) % list.length);
  const prev = () => setIdx((i) => (i - 1 + list.length) % list.length);

  return (
    <PageShell
      eyebrow="Projects"
      title="Selected work, shipped with love."
      subtitle="Drag, swipe, or use arrow keys to explore."
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              filter === c ? "bg-gradient-neon text-background" : "glass hover:bg-white/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.article
            key={project.title}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) next();
              else if (info.offset.x > 80) prev();
            }}
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong rounded-[2rem] overflow-hidden cursor-grab active:cursor-grabbing"
          >
            <div className={`relative h-64 md:h-80 bg-gradient-to-br ${project.accent}`}>
              {project.image ? (
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-luminosity transition-all duration-700 hover:scale-[1.03] hover:opacity-75"
                />
              ) : (
                <div className="absolute inset-0 opacity-30 grid-bg" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/25 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-white/80">{project.category}</div>
                  <h2 className="mt-2 font-display text-3xl md:text-5xl font-semibold text-white">
                    {project.title}
                  </h2>
                </div>
                <div className="hidden md:block text-white/70 text-xs">
                  {idx + 1} / {list.length}
                </div>
              </div>
            </div>
            <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                <div className="mt-6">
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Key Features</h4>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gradient-neon flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span key={t} className="rounded-full glass px-3 py-1 text-xs">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer"
                       className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold hover:bg-white/10">
                      <Github className="h-3.5 w-3.5" /> GitHub
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noreferrer"
                       className="inline-flex items-center gap-2 rounded-full bg-gradient-neon px-4 py-2 text-xs font-semibold text-background">
                      <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-gradient-neon" : "w-4 bg-white/15"}`}
                aria-label={`Go to ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={prev} className="grid h-10 w-10 place-items-center rounded-full glass hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button onClick={next} className="grid h-10 w-10 place-items-center rounded-full bg-gradient-neon text-background">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
