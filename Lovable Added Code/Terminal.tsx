import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TerminalSquare, X } from "lucide-react";
import {
  profile,
  education,
  experience,
  skillGroups,
  projectsMeta,
  certificates,
} from "@/lib/portfolio-data";

type Line = { kind: "in" | "out" | "sys"; text: string };

const HELP = `Available commands:
  help          - list commands
  about         - about Sankalp
  skills        - technical skills
  experience    - work history
  projects      - selected projects
  certificates  - certifications
  contact       - contact info
  resume        - download resume
  clear         - clear terminal`;

function run(cmd: string): string {
  const c = cmd.trim().toLowerCase();
  if (!c) return "";
  switch (c) {
    case "help":
      return HELP;
    case "about":
      return `${profile.name}\n${profile.title}\n\n${profile.summary}\n\nEducation:\n  ${education[0].degree}\n  ${education[0].school} (${education[0].period}) — ${education[0].highlight}`;
    case "skills":
      return skillGroups
        .map((g) => `${g.title}:\n  ${g.items.map(([n]) => n).join(", ")}`)
        .join("\n\n");
    case "experience":
      return experience
        .map((e) => `[${e.period}] ${e.role} @ ${e.org}\n  ${e.body}`)
        .join("\n\n");
    case "projects":
      return projectsMeta.map((p) => `- ${p.title} [${p.category}]`).join("\n");
    case "certificates":
      return certificates.map((c) => `- ${c.title} (${c.issuer}, ${c.year})`).join("\n");
    case "contact":
      return `Email:    ${profile.email}\nGitHub:   ${profile.github}\nLinkedIn: ${profile.linkedin}\nLocation: ${profile.location}`;
    case "resume":
      if (typeof window !== "undefined") window.open("/resume.pdf", "_blank");
      return "Opening resume.pdf…";
    case "clear":
      return "__CLEAR__";
    default:
      return `command not found: ${cmd}\nType 'help' for available commands.`;
  }
}

const BOOT: Line[] = [
  { kind: "sys", text: "sankalp@portfolio ~ $ boot sequence" },
  { kind: "sys", text: "> loading modules... ok" },
  { kind: "sys", text: "> welcome. type 'help' to explore." },
];

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "`") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input;
    setInput("");
    setHistory((h) => [cmd, ...h].slice(0, 30));
    setHIdx(-1);
    const output = run(cmd);
    if (output === "__CLEAR__") {
      setLines([]);
      return;
    }
    setLines((l) => [
      ...l,
      { kind: "in", text: cmd },
      ...(output ? [{ kind: "out" as const, text: output }] : []),
    ]);
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        aria-label="Open terminal"
        className="fixed bottom-6 right-24 z-50 inline-flex items-center gap-2 rounded-full glass-strong px-4 py-3 text-xs font-mono hover:bg-white/10"
      >
        <TerminalSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Terminal</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-md grid place-items-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-[min(720px,100%)] max-h-[80vh] glass-strong rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
            >
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">sankalp@portfolio: ~</span>
                <button
                  onClick={() => setOpen(false)}
                  className="ml-auto rounded p-1 hover:bg-white/10"
                  aria-label="Close terminal"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div
                ref={bodyRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed text-emerald-200/90"
                onClick={() => inputRef.current?.focus()}
              >
                {lines.map((l, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {l.kind === "in" && <span className="text-cyan-400">➜ </span>}
                    {l.kind === "sys" && <span className="text-muted-foreground">{l.text}</span>}
                    {l.kind !== "sys" && <span className={l.kind === "in" ? "text-white" : "text-emerald-200/80"}>{l.text}</span>}
                  </div>
                ))}
                <form onSubmit={submit} className="flex items-center gap-2 mt-1">
                  <span className="text-cyan-400">➜</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        const n = Math.min(history.length - 1, hIdx + 1);
                        if (n >= 0 && history[n] !== undefined) { setHIdx(n); setInput(history[n]); }
                      } else if (e.key === "ArrowDown") {
                        e.preventDefault();
                        const n = Math.max(-1, hIdx - 1);
                        setHIdx(n);
                        setInput(n === -1 ? "" : history[n] ?? "");
                      }
                    }}
                    className="flex-1 bg-transparent outline-none text-white caret-cyan-400"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
