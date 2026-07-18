import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";
import { skillGroups } from "@/lib/portfolio-data";

export const Route = createFileRoute("/skills")({
  component: Skills,
  head: () => ({ meta: [
    { title: "Skills — Sankalp Misal" },
    { name: "description", content: "Python, FastAPI, Flask, React, Node.js, PostgreSQL, MongoDB, AI, and more." },
  ]}),
});

function Skills() {
  return (
    <PageShell
      eyebrow="Skills"
      title="An arsenal built for building."
      subtitle="Tools I reach for, refined by shipping real products."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, gi) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: gi * 0.05 }}
            whileHover={{ y: -4, rotateX: 2 }}
            style={{ transformStyle: "preserve-3d" }}
            className="glass-strong rounded-3xl p-6 group hover:glow-purple transition-shadow"
          >
            <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gradient-neon" />
              {g.title}
            </h3>
            <ul className="space-y-3">
              {g.items.map(([name, val]) => (
                <li key={name as string}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-foreground/90">{name}</span>
                    <span className="text-muted-foreground">{val as number}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className="h-full bg-gradient-neon"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}
