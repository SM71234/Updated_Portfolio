import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { GraduationCap, Briefcase, Target, Heart, Trophy, User } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({ meta: [
    { title: "About — Sankalp Misal" },
    { name: "description", content: "The journey, education, and craft behind Sankalp Misal." },
  ]}),
});

const sections = [
  { icon: User, title: "Introduction", body: "I'm a developer who believes engineering is a craft. I build products that are fast, thoughtful, and delightful — from pixel to protocol." },
  { icon: GraduationCap, title: "Education", body: "B.E./B.Tech in Computer Science and Engineering — deep focus on software design, systems programming, and full-stack web applications." },
  { icon: Briefcase, title: "Career Journey", body: "From software engineering internships to managing production workflows as a Technical Operations Executive, I've owned features end-to-end." },
  { icon: Target, title: "Goals", body: "To build systems at scale, create robust developer tools, contribute to open source, and engineer applications that ship with taste." },
  { icon: Heart, title: "Interests", body: "Trading systems, developer tooling, AI models, automation, cricket, and long-form writing about software." },
  { icon: Trophy, title: "Achievements", body: "Academic top performer, professional launching of production trading systems, and building custom tooling with measurable impact." },
];

function About() {
  return (
    <PageShell
      eyebrow="About"
      title="A story of code, curiosity & craft."
      subtitle="I build things with intent. Here's the arc that shaped how I work today."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="glass-strong rounded-3xl p-6 hover:glow-cyan transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-neon text-background">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-semibold">{s.title}</h3>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}
