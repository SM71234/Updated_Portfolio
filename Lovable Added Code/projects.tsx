import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import { projectsMeta } from "@/lib/portfolio-data";
import autoSarthiImg from "@/assets/project-auto-sarthi.jpg";
import redleafImg from "@/assets/project-redleaf.jpg";
import traderImg from "@/assets/project-trader-insight.jpg";
import jarvisImg from "@/assets/project-jarvis.jpg";
import portfolioImg from "@/assets/project-portfolio.jpg";
import bloggingImg from "@/assets/project-blogging.jpg";

export const Route = createFileRoute("/projects")({
  component: Projects,
  head: () => ({ meta: [
    { title: "Projects — Sankalp Misal" },
    { name: "description", content: "Selected projects — Auto Sarthi, RedLeaf, Trader Insight, Jarvis, Portfolio, Blogging Platform." },
  ]}),
});

const imageMap: Record<string, string> = {
  "auto-sarthi": autoSarthiImg,
  "redleaf": redleafImg,
  "trader-insight": traderImg,
  "jarvis": jarvisImg,
  "portfolio": portfolioImg,
  "blogging": bloggingImg,
};

const projects = projectsMeta.map((p) => ({
  ...p,
  image: imageMap[p.slug],
  github: "https://github.com",
  demo: p.slug === "portfolio" ? "/" : undefined,
}));

const categories = ["All", "Mega Project", "AI", "Full Stack"] as const;

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

  if (!project) return null;

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
            <div className="relative h-64 md:h-96 overflow-hidden">
              <motion.img
                src={project.image}
                alt={project.title}
                loading="lazy"
                width={1280}
                height={800}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} mix-blend-overlay opacity-40`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white/90">
                    <motion.span
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    />
                    {project.category}
                  </div>
                  <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold text-white drop-shadow-lg">
                    {project.title}
                  </h2>
                </div>
                <div className="hidden md:block text-white/70 text-xs font-mono">
                  {String(idx + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
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
            <button onClick={prev} className="grid h-10 w-10 place-items-center rounded-full glass hover:bg-white/10" aria-label="Previous">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button onClick={next} className="grid h-10 w-10 place-items-center rounded-full bg-gradient-neon text-background" aria-label="Next">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
