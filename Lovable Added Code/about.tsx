import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { GraduationCap, Briefcase, Target, Heart, Trophy, User, Sparkles, Rocket } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({ meta: [
    { title: "About — Sankalp Misal" },
    { name: "description", content: "The journey, education, and craft behind Sankalp Misal — B.Tech CSE, Rotex IT Solutions, and AI engineering." },
  ]}),
});

const sections = [
  {
    icon: User,
    title: "Introduction",
    body: "I'm Sankalp Misal — a software engineer who treats engineering as a craft. I ship products that are fast, thoughtful, and delightful, from Python backends to React interfaces.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    body: "B.Tech in Computer Science & Engineering from Sanjay Ghodawat University (CGPA 7.9). Deep focus on data structures, systems, DBMS, and modern web engineering.",
  },
  {
    icon: Rocket,
    title: "Current Role",
    body: "Technical Operations Executive at Rotex IT Solutions — owning production operations, automating workflows, and shipping full-stack tooling that unlocks the team.",
  },
  {
    icon: Briefcase,
    title: "Career Journey",
    body: "From a Web Development Internship at Saiket Systems to production ownership at Rotex — I've moved from writing features to owning outcomes end-to-end.",
  },
  {
    icon: Trophy,
    title: "Achievements",
    body: "Shipped multiple production launches with measurable impact, built internal AI tooling, and consistently delivered under tight timelines with high code quality.",
  },
  {
    icon: Target,
    title: "Goals",
    body: "To build AI-driven products used by millions, contribute meaningfully to open source, and grow into an engineer who blends strong systems thinking with product taste.",
  },
  {
    icon: Heart,
    title: "Interests",
    body: "Applied AI, developer tooling, backend architecture, prompt engineering, chess, and long-form writing about software craft.",
  },
  {
    icon: Sparkles,
    title: "Philosophy",
    body: "Great software is invisible. It gets out of the user's way. I optimise for clarity, resilience, and moments that feel small but deliberate.",
  },
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
            transition={{ duration: 0.5, delay: i * 0.05 }}
            whileHover={{ y: -4 }}
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
