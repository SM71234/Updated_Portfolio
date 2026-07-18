import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { Mail, Github, Linkedin, Send, MapPin, Check } from "lucide-react";
import { profile } from "@/lib/portfolio-data";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [
    { title: "Contact — Sankalp Misal" },
    { name: "description", content: "Get in touch — always open to interesting conversations." },
  ]}),
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <PageShell
      eyebrow="Contact"
      title="Let's build something remarkable."
      subtitle="Currently accepting new opportunities and collaborations."
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <motion.form
          onSubmit={(e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 4000); }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-strong rounded-3xl p-6 md:p-8 space-y-5 relative overflow-hidden"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Name</span>
              <input required className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--neon-blue)_20%,transparent)] transition" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
              <input required type="email" className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--neon-blue)_20%,transparent)] transition" />
            </label>
          </div>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Subject</span>
            <input className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--neon-blue)_20%,transparent)] transition" />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Message</span>
            <textarea required rows={6} className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--neon-blue)_20%,transparent)] transition resize-none" />
          </label>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-neon px-6 py-3 text-sm font-semibold text-background glow-purple"
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4" /> Message sent
                </motion.span>
              ) : (
                <motion.span key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /> Send message
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-strong rounded-3xl p-6"
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-muted-foreground">Available for new projects</span>
            </div>
            <p className="mt-4 text-lg font-display">
              I usually respond within <span className="text-gradient font-semibold">24 hours</span>.
            </p>
          </motion.div>

          {[
            { Icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
            { Icon: Linkedin, label: "LinkedIn", value: "/in/sankalpmisal", href: profile.linkedin },
            { Icon: Github, label: "GitHub", value: "@sankalpmisal", href: profile.github },
            { Icon: MapPin, label: "Location", value: profile.location, href: "#" },
          ].map(({ Icon, label, value, href }, i) => (
            <motion.a
              key={label}
              href={href}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
              whileHover={{ x: 4 }}
              className="glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-neon text-background">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
                <div className="text-sm font-medium">{value}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
