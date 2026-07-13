import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-6xl px-6 pb-24 pt-8"
    >
      <div className="mb-12">
        {eyebrow && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-neon" />
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-4xl md:text-6xl font-semibold">
          <span className="text-gradient">{title}</span>
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </motion.div>
  );
}
