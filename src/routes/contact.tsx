import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { Mail, Github, Linkedin, Send, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [
    { title: "Contact — Sankalp Misal" },
    { name: "description", content: "Get in touch — always open to interesting conversations." },
  ]}),
});

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Free contact form endpoint powered by Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "79b392ee-91e8-46cc-bcf0-60b6c683b584", // Pre-configured key for direct delivery
          name,
          email,
          subject: subject || `Contact Form - ${name}`,
          message,
        }),
      });

      if (response.ok) {
        setSent(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        // Fallback: Mailto redirect
        window.location.href = `mailto:sankalpmisal007@gmail.com?subject=${encodeURIComponent(subject || "Portfolio Contact")}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
        setSent(true);
      }
    } catch (err) {
      // Fallback: Mailto redirect
      window.location.href = `mailto:sankalpmisal007@gmail.com?subject=${encodeURIComponent(subject || "Portfolio Contact")}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="Contact"
      title="Let's build something remarkable."
      subtitle="I'm currently accepting new opportunities and collaborations."
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-strong rounded-3xl p-6 md:p-8 space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Name</span>
              <input 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary/60 transition" 
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary/60 transition" 
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Subject</span>
            <input 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary/60 transition" 
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Message</span>
            <textarea 
              required 
              rows={6} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-primary/60 transition resize-none" 
            />
          </label>
          <button 
            type="submit"
            disabled={loading}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-neon px-6 py-3 text-sm font-semibold text-background glow-purple disabled:opacity-50"
          >
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            {loading ? "Sending..." : sent ? "Sent — thank you!" : "Send message"}
          </button>
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
            { Icon: Mail, label: "Email", value: "sankalpmisal007@gmail.com", href: "mailto:sankalpmisal007@gmail.com" },
            { Icon: Linkedin, label: "LinkedIn", value: "/in/sankalp-misal6", href: "https://www.linkedin.com/in/sankalp-misal6/" },
            { Icon: Github, label: "GitHub", value: "@SM71234", href: "https://github.com/SM71234" },
            { Icon: MapPin, label: "Location", value: "Nipani, KA, India", href: "https://maps.google.com/?q=Nipani,+Karnataka,+India" },
          ].map(({ Icon, label, value, href }, i) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
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
