import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { Award, X, ArrowLeft, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/certificates")({
  component: Certificates,
  head: () => ({ meta: [
    { title: "Certificates — Sankalp Misal" },
    { name: "description", content: "Certifications and continued learning." },
  ]}),
});

const certs = [
  { title: "Full Stack Web Development", issuer: "Coursera", year: "2024", accent: "from-cyan-400 to-blue-600" },
  { title: "Python for Everybody", issuer: "University of Michigan", year: "2023", accent: "from-blue-500 to-purple-600" },
  { title: "AWS Cloud Practitioner", issuer: "Amazon", year: "2024", accent: "from-orange-400 to-rose-600" },
  { title: "Machine Learning Basics", issuer: "Google", year: "2023", accent: "from-emerald-400 to-cyan-600" },
  { title: "Advanced React Patterns", issuer: "Meta", year: "2024", accent: "from-purple-500 to-pink-600" },
  { title: "SQL & Database Design", issuer: "IBM", year: "2023", accent: "from-cyan-400 to-teal-600" },
];

function Certificates() {
  const [center, setCenter] = useState(2);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <PageShell
      eyebrow="Certificates"
      title="Learning that never sleeps."
      subtitle="A curated shelf of certifications and courses."
    >
      <div className="relative h-[420px] mb-6 [perspective:1500px]">
        <div className="absolute inset-0 flex items-center justify-center">
          {certs.map((c, i) => {
            const offset = i - center;
            const abs = Math.abs(offset);
            return (
              <motion.button
                key={c.title}
                onClick={() => (offset === 0 ? setOpen(i) : setCenter(i))}
                animate={{
                  x: offset * 180,
                  rotateY: offset * -25,
                  scale: 1 - abs * 0.12,
                  zIndex: 10 - abs,
                  opacity: abs > 2 ? 0 : 1 - abs * 0.2,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="absolute w-72 h-96 rounded-3xl glass-strong overflow-hidden text-left"
              >
                <div className={`h-40 bg-gradient-to-br ${c.accent} relative`}>
                  <div className="absolute inset-0 grid-bg opacity-20" />
                  <Award className="absolute right-4 top-4 h-8 w-8 text-white/80" />
                </div>
                <div className="p-5">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.year}</div>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-tight">{c.title}</h3>
                  <div className="mt-3 text-sm text-gradient font-medium">{c.issuer}</div>
                  {offset === 0 && (
                    <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-neon px-3 py-1 text-xs font-semibold text-background">
                      View certificate
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <button onClick={() => setCenter((c) => Math.max(0, c - 1))}
          className="grid h-10 w-10 place-items-center rounded-full glass hover:bg-white/10">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button onClick={() => setCenter((c) => Math.min(certs.length - 1, c + 1))}
          className="grid h-10 w-10 place-items-center rounded-full bg-gradient-neon text-background">
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {open !== null && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl grid place-items-center p-6"
          onClick={() => setOpen(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="glass-strong rounded-3xl p-8 max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setOpen(null)} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full glass">
              <X className="h-4 w-4" />
            </button>
            <div className={`h-48 rounded-2xl bg-gradient-to-br ${certs[open].accent} mb-6 grid place-items-center`}>
              <Award className="h-16 w-16 text-white" />
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{certs[open].year}</div>
            <h3 className="mt-1 font-display text-2xl font-semibold">{certs[open].title}</h3>
            <div className="mt-1 text-gradient">{certs[open].issuer}</div>
          </motion.div>
        </motion.div>
      )}
    </PageShell>
  );
}
