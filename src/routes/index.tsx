import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Download, Github, Linkedin, Mail, Sparkles, Instagram, Twitter } from "lucide-react";
import hero from "@/assets/hero-workspace.png";

export const Route = createFileRoute("/")({
  component: Home,
});

const roles = [
  "Full Stack Developer",
  "Technical Operations Executive",
  "Python Developer",
  "Problem Solver",
];

function useTyping(words: string[]) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[i];
    const speed = del ? 45 : 85;
    const t = setTimeout(() => {
      if (!del && text === word) { setTimeout(() => setDel(true), 1400); return; }
      if (del && text === "") { setDel(false); setI((i + 1) % words.length); return; }
      setText(del ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i, words]);
  return text;
}

function Home() {
  const typed = useTyping(roles);
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-6">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] items-center min-h-[80vh]">
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

          <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold leading-[1.02]">
            Hi, I'm{" "}
            <span className="text-gradient">Sankalp Misal</span>
          </h1>

          <div className="mt-4 h-9 md:h-11 text-2xl md:text-3xl font-display text-muted-foreground">
            <span className="text-foreground">{typed}</span>
            <span className="ml-1 inline-block h-6 md:h-7 w-[3px] translate-y-1 bg-gradient-neon animate-pulse" />
          </div>

          <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
            I design and build immersive, high-performance web experiences —
            blending elegant interfaces with resilient full-stack systems.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-neon px-6 py-3 text-sm font-semibold text-background glow-purple transition-transform hover:scale-[1.03]"
            >
              View Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3 text-sm font-semibold hover:bg-white/10"
            >
              View Resume
            </a>
            <a
              href="/resume.pdf"
              download="Sankalp_Misal_Resume.pdf"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold hover:bg-white/15"
            >
              <Download className="h-4 w-4" /> Download Resume
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3">
            {[
              { Icon: Github, href: "https://github.com/SM71234" },
              { Icon: Linkedin, href: "https://www.linkedin.com/in/sankalp-misal6/" },
              { Icon: Mail, href: "mailto:sankalpmisal007@gmail.com" },
              { Icon: Instagram, href: "https://www.instagram.com/sankalp_sm7?igsh=dTZ5YjN5Ym9jZnMx" },
              { Icon: Twitter, href: "https://x.com/MisalSankalp" },
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
               style={{ background: "radial-gradient(circle at 60% 40%, oklch(0.68 0.24 300 / 0.5), transparent 60%)" }} />
          <motion.img
            src={hero}
            alt="Developer workspace"
            width={1280}
            height={1280}
            className="animate-float-y select-none"
            draggable={false}
          />
        </motion.div>
      </div>

      <div className="mt-16 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        <span>React</span><span>·</span><span>TypeScript</span><span>·</span>
        <span>Node</span><span>·</span><span>Python</span><span>·</span>
        <span>PostgreSQL</span><span>·</span><span>AWS</span>
      </div>
    </section>
  );
}
