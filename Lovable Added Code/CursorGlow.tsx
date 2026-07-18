import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 200, damping: 25, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 25, mass: 0.4 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
    const handler = (e: MouseEvent) => {
      x.set(e.clientX - 150);
      y.set(e.clientY - 150);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-0 h-[300px] w-[300px] rounded-full opacity-60 mix-blend-screen"
    >
      <div
        className="h-full w-full rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.78 0.16 220 / 0.35), transparent 60%)" }}
      />
    </motion.div>
  );
}
