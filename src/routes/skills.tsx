import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/skills")({
  component: Skills,
  head: () => ({ meta: [
    { title: "Skills — Sankalp Misal" },
    { name: "description", content: "Frontend, backend, databases, languages, cloud, and tools I work with." },
  ]}),
});

const groups = [
  { title: "Frontend", items: [["React", 95], ["TypeScript", 92], ["Tailwind", 95], ["Framer Motion", 88], ["Next.js", 85]] },
  { title: "Backend", items: [["Node.js", 90], ["Express", 88], ["FastAPI", 82], ["REST/GraphQL", 85]] },
  { title: "Database", items: [["PostgreSQL", 88], ["MongoDB", 82], ["Redis", 78], ["Supabase", 85]] },
  { title: "Languages", items: [["JavaScript", 95], ["TypeScript", 92], ["Python", 90], ["SQL", 85]] },
  { title: "Tools", items: [["Git", 92], ["Docker", 80], ["VS Code", 95], ["Figma", 78]] },
  { title: "Cloud", items: [["AWS", 78], ["Vercel", 90], ["Cloudflare", 82]] },
  { title: "Soft Skills", items: [["Communication", 92], ["Ownership", 95], ["Mentorship", 85], ["Systems Thinking", 90]] },
] as const;

function Skills() {
  return (
    <PageShell
      eyebrow="Skills"
      title="An arsenal built for building."
      subtitle="Tools I reach for, refined by shipping real products."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, gi) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: gi * 0.05 }}
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
