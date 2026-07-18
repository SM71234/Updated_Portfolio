import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { profile } from "@/lib/portfolio-data";

export const Route = createFileRoute("/readme")({
  head: () => ({
    meta: [
      { title: "README.md — Sankalp Misal" },
      { name: "description", content: "The README for Sankalp Misal — repository-style overview of the portfolio." },
      { property: "og:title", content: "README.md — Sankalp Misal" },
      { property: "og:description", content: "GitHub-style README for the portfolio project." },
    ],
  }),
  component: ReadmePage,
});

const sections = [
  {
    heading: "# sankalp-misal / portfolio",
    body: "> A premium, IDE-inspired developer portfolio — v3.",
  },
  {
    heading: "## Status",
    body: "🟢 **Available for Opportunities** — Remote friendly, based in India.",
  },
  {
    heading: "## Tech Stack",
    body: "`React` · `TanStack Start` · `TanStack Router` · `Tailwind CSS` · `Framer Motion` · `TypeScript` · `Lovable AI`",
  },
  {
    heading: "## Features",
    body: "- Project Explorer (VS Code style)\n- AI portfolio assistant\n- Interactive terminal\n- Cinematic AI artwork\n- Journey timeline · Gallery · Now page",
  },
  {
    heading: "## Current Focus",
    body: "Shipping AI-assisted developer tooling and premium full-stack products.",
  },
  {
    heading: "## Philosophy",
    body: "> Craft > ship > refine. Strong systems and beautiful UI are not a trade-off — they are the same discipline.",
  },
  {
    heading: "## Fun Facts",
    body: "- I obsess over animation timing.\n- I play football when I'm not shipping.\n- My terminal is prettier than my desk.",
  },
];

function ReadmePage() {
  return (
    <PageShell eyebrow="/README.md" title="README.md" subtitle="A GitHub-style overview of this project — and the person behind it.">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-2xl neon-border glass-strong">
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            <span className="ml-3">README.md · main</span>
            <span className="ml-auto">Last updated · today</span>
          </div>
          <div className="space-y-6 p-8 font-mono text-[13.5px] leading-relaxed">
            {sections.map((s, i) => (
              <motion.section
                key={s.heading}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <h2 className="font-display text-lg font-semibold text-gradient">
                  {s.heading}
                </h2>
                <div className="mt-2 whitespace-pre-line text-muted-foreground">
                  {s.body}
                </div>
              </motion.section>
            ))}

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-lg font-semibold text-gradient">## Terminal</h2>
              <pre className="mt-2 rounded-xl bg-black/40 p-4 text-[12.5px] text-emerald-200/90">
{`$ git status
On branch career
Working tree clean
$ npm run build
✓ built in 1.2s
$ deploy --production
✓ launched successfully`}
              </pre>
            </motion.section>

            <div className="pt-4 text-center text-xs text-muted-foreground">
              Made with <span className="text-rose-400">❤</span> in India
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl glass-strong p-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Developer</div>
            <div className="mt-1 font-display text-xl font-semibold text-gradient">{profile.name}</div>
            <div className="text-sm text-muted-foreground">{profile.title}</div>
            <div className="mt-4 flex gap-2">
              <a href={profile.github} className="grid h-9 w-9 place-items-center rounded-full glass hover:glow-cyan"><Github className="h-4 w-4" /></a>
              <a href={profile.linkedin} className="grid h-9 w-9 place-items-center rounded-full glass hover:glow-cyan"><Linkedin className="h-4 w-4" /></a>
              <a href={`mailto:${profile.email}`} className="grid h-9 w-9 place-items-center rounded-full glass hover:glow-cyan"><Mail className="h-4 w-4" /></a>
            </div>
          </div>

          <div className="rounded-2xl glass-strong p-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Quick Links</div>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                ["/projects", "Projects"],
                ["/experience", "Experience"],
                ["/now", "Now"],
                ["/journey", "Journey"],
                ["/gallery", "Gallery"],
                ["/contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="group inline-flex items-center gap-1.5 text-muted-foreground hover:text-white">
                    {label}
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
