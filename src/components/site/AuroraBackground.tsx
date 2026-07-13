import { useEffect, useRef } from "react";

export function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      ref.current.style.setProperty("--mx", `${x}px`);
      ref.current.style.setProperty("--my", `${y}px`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.35]" />
      <div
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-40 animate-aurora"
        style={{
          background: "radial-gradient(circle, oklch(0.7 0.22 260) 0%, transparent 70%)",
          transform: "translate(var(--mx,0), var(--my,0))",
        }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full blur-3xl opacity-30 animate-aurora"
        style={{
          background: "radial-gradient(circle, oklch(0.68 0.24 300) 0%, transparent 70%)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full blur-3xl opacity-25 animate-aurora"
        style={{
          background: "radial-gradient(circle, oklch(0.85 0.18 200) 0%, transparent 70%)",
          animationDelay: "-12s",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
    </div>
  );
}
