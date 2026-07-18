import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Download, Github, Linkedin, Mail, Sparkles, MessageSquare } from "lucide-react";
import hero from "@/assets/hero-workspace.png";
import { openAIAssistant } from "@/components/site/AIAssistant";
import { ExplorerPanel } from "@/components/site/Explorer";


export const Route = createFileRoute("/")({
  component: Home,
});

const roles = [
  "Full Stack Developer",
  "Python & AI Engineer",
  "Backend Developer",
  "Technical Operations Executive",
];

function useTyping(words: string[]) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[i];
    const speed = del ? 45 : 85;
    const t = setTimeout(() => {
      if (!del && text === word) { setTimeout(() => setDel(true), 1500); return; }
      if (del && text === "") { setDel(false); setI((i + 1) % words.length); return; }
      setText(del ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i, words]);
  return text;
}

const techBadges = ["Python", "React", "Node.js", "FastAPI", "PostgreSQL", "Docker"];

function Home() {
  const typed = useTyping(roles);

  // Parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const tx = useTransform(sx, (v) => v * 20);
  const ty = useTransform(sy, (v) => v * 20);
  const rotZ = useTransform(sx, (v) => v * 3);

  useEffect(() => {
    const on = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mx.set(x); my.set(y);
    };
    window.addEventListener("mousemove", on);
    return () => window.removeEventListener("mousemove", on);
  }, [mx, my]);

  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-6">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] items-center min-h-[82vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Open to Opportunities
          </div>

          <h1 className="mt-8 font-display text-6xl md:text-8xl font-semibold leading-[0.98] tracking-tight">
            Hi, I'm
            <br />
            <span className="text-gradient">Sankalp Misal</span>
          </h1>

          <div className="mt-6 h-10 md:h-12 text-2xl md:text-3xl font-display text-muted-foreground">
            <span className="text-foreground">{typed}</span>
            <span className="ml-1 inline-block h-6 md:h-7 w-[3px] translate-y-1 bg-gradient-neon animate-pulse" />
          </div>

          <p className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
            I engineer immersive, high-performance products — blending resilient
            Python & Node backends, elegant React interfaces, and applied AI to
            ship experiences that feel effortless.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-neon px-6 py-3 text-sm font-semibold text-background glow-purple transition-transform hover:scale-[1.03]"
            >
              View Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="/resume.pdf"
              className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3 text-sm font-semibold hover:bg-white/10"
            >
              <Download className="h-4 w-4" /> Download Resume
            </a>
            <button
              onClick={() => openAIAssistant("Explain my resume")}
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold hover:bg-white/10"
            >
              <MessageSquare className="h-4 w-4" /> Ask AI: Explain Resume
            </button>
          </div>

          <div className="mt-10 flex items-center gap-3">
            {[
              { Icon: Github, href: "https://github.com" },
              { Icon: Linkedin, href: "https://linkedin.com" },
              { Icon: Mail, href: "mailto:hello@sankalp.dev" },
            ].map(({ Icon, href }, idx) => (
              <motion.a
                key={idx}
                href={href}
                whileHover={{ y: -3 }}
                className="grid h-10 w-10 place-items-center rounded-full glass hover:glow-cyan"
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 blur-3xl opacity-70"
               style={{ background: "radial-gradient(circle at 60% 40%, oklch(0.68 0.24 300 / 0.55), transparent 60%)" }} />
          <div className="absolute inset-0 -z-10 blur-3xl opacity-60"
               style={{ background: "radial-gradient(circle at 30% 60%, oklch(0.7 0.22 220 / 0.4), transparent 60%)" }} />

          <motion.div
            style={{ x: tx, y: ty, rotateZ: rotZ }}
            className="animate-float-y relative"
          >
            <img
              src={hero}
              alt="Sankalp's futuristic developer workspace — Python, React, FastAPI, AI"
              width={1280}
              height={1280}
              className="select-none rounded-3xl"
              draggable={false}
              style={{
                WebkitMaskImage:
                  "radial-gradient(ellipse at center, black 55%, transparent 88%)",
                maskImage:
                  "radial-gradient(ellipse at center, black 55%, transparent 88%)",
              }}
            />
          </motion.div>

          {/* Floating tech badges */}
          <div className="pointer-events-none absolute inset-0">
            {techBadges.map((t, i) => {
              const angle = (i / techBadges.length) * Math.PI * 2;
              const r = 46;
              const x = 50 + Math.cos(angle) * r;
              const y = 50 + Math.sin(angle) * r * 0.55;
              return (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                  transition={{
                    opacity: { delay: 0.4 + i * 0.08, duration: 0.5 },
                    scale: { delay: 0.4 + i * 0.08, duration: 0.5 },
                    y: { duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full glass-strong px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-foreground/80"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {t}
                </motion.span>
              );
            })}
          </div>

          {/* Inline Project Explorer */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="relative mt-8"
          >
            <ExplorerPanel />
          </motion.div>
        </motion.div>
      </div>


      <div className="mt-16 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        <span>Python</span><span>·</span><span>FastAPI</span><span>·</span>
        <span>React</span><span>·</span><span>Node.js</span><span>·</span>
        <span>PostgreSQL</span><span>·</span><span>AI</span><span>·</span><span>ML</span>
      </div>
    </section>
  );
}
