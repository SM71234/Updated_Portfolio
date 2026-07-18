import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/experience")({
  component: Experience,
  head: () => ({ meta: [
    { title: "Experience — Sankalp Misal" },
    { name: "description", content: "Professional experience and career timeline." },
  ]}),
});

const items = [
  {
    role: "Technical Operations Executive",
    org: "Rotex IT Solutions",
    time: "Jan 2026 — Present",
    body: "Managing daily technical operations across MT5 Terminal, MT5 Manager, and MT5 Administrator platforms. Directing CRM system administration for client accounts, commission processing, and workflow reporting.",
    tags: ["MT5 Administration", "CRM Operations", "Technical Support", "Troubleshooting"],
  },
  {
    role: "Software Engineering Intern (Online)",
    org: "Saiket Systems",
    time: "May 2025 — June 2025",
    body: "Collaborated on designing and integrating full-stack components, building Flask APIs, and optimizing relational databases during an online software engineering internship.",
    tags: ["Python", "Flask", "SQLAlchemy", "API Design"],
  },
  {
    role: "B.E./B.Tech in Computer Science and Engineering",
    org: "Sanjay Ghodawat University",
    time: "Sept 2022 — June 2026",
    body: "Completed Bachelor's degree in Computer Science and Engineering (8.23 CGPA). Focused on data structures, systems engineering, database management, and full-stack web application development.",
    tags: ["CSE", "Algorithms", "Database Systems", "Software Design"],
  },
];

function Experience() {
  return (
    <PageShell
      eyebrow="Experience"
      title="Milestones on the map."
      subtitle="Each role sharpened a different edge — engineering, ownership, and delivery."
    >
      <div className="relative pl-6 md:pl-10">
        <div className="absolute left-2 md:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-white/10 to-transparent" />
        <div className="space-y-8">
          {items.map((it, i) => (
            <motion.div
              key={it.role}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="relative"
            >
              <div className="absolute -left-[26px] md:-left-[38px] top-6 h-3 w-3 rounded-full bg-gradient-neon glow-cyan" />
              <div className="glass-strong rounded-3xl p-6 md:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl md:text-2xl font-semibold">{it.role}</h3>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{it.time}</span>
                </div>
                <div className="mt-1 text-sm text-gradient font-medium">{it.org}</div>
                <p className="mt-4 text-muted-foreground leading-relaxed">{it.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {it.tags.map((t) => (
                    <span key={t} className="rounded-full glass px-3 py-1 text-xs">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
