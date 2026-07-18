import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MESSAGES = [
  "Initializing Portfolio…",
  "Loading Projects…",
  "Preparing Experience…",
  "Loading AI Models…",
  "Rendering Interface…",
  "Launching Experience…",
];

export function Loader() {
  const [done, setDone] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("sm_boot") === "1") { setDone(true); return; }
    let i = 0;
    const t = setInterval(() => {
      i++;
      setIdx(i);
      if (i >= MESSAGES.length - 1) {
        clearInterval(t);
        setTimeout(() => {
          setDone(true);
          sessionStorage.setItem("sm_boot", "1");
        }, 500);
      }
    }, 300);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center bg-background"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-neon text-background font-display font-bold text-2xl">
                SM
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-neon blur-2xl opacity-40 -z-10" />
            </div>
            <div className="h-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28 }}
                  className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
                >
                  {MESSAGES[idx]}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${((idx + 1) / MESSAGES.length) * 100}%` }}
                transition={{ ease: "easeOut", duration: 0.4 }}
                className="h-full bg-gradient-neon"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
