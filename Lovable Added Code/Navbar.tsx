import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/experience", label: "Experience" },
  { to: "/projects", label: "Projects" },
  { to: "/journey", label: "Journey" },
  { to: "/gallery", label: "Gallery" },
  { to: "/certificates", label: "Certificates" },
  { to: "/now", label: "Now" },
  { to: "/readme", label: "README" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[min(1100px,calc(100%-2rem))] -translate-x-1/2">
      <nav className="glass-strong rounded-full px-4 py-2.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 pl-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-neon font-display text-sm font-bold text-background">
            SM
          </span>
          <span className="hidden sm:block font-display font-semibold tracking-tight">
            Sankalp
          </span>
        </Link>

        <ul className="hidden xl:flex items-center gap-0.5 text-[13px]">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="relative px-2.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative ${active ? "text-foreground" : ""}`}>{l.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="/resume.pdf"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-neon px-4 py-2 text-xs font-semibold text-background transition-transform hover:scale-[1.03]"
          >
            <Download className="h-3.5 w-3.5" /> Resume
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden rounded-full glass p-2"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="xl:hidden mt-2 glass-strong rounded-3xl p-3"
          >
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-2.5 rounded-2xl text-sm ${pathname === l.to ? "bg-white/10 text-foreground" : "text-muted-foreground"}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/resume.pdf"
                  className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-neon px-4 py-2.5 text-sm font-semibold text-background"
                >
                  <Download className="h-4 w-4" /> Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
