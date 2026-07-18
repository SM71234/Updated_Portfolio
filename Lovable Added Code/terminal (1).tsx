import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { profile, experience, skillGroups, projectsMeta, certificates } from "@/lib/portfolio-data";

export const Route = createFileRoute("/terminal")({
  head: () => ({
    meta: [
      { title: "Terminal — Sankalp Misal" },
      { name: "description", content: "Explore Sankalp's portfolio the developer way — an interactive terminal." },
      { property: "og:title", content: "Terminal — Sankalp Misal" },
      { property: "og:description", content: "A live, interactive terminal to navigate the portfolio." },
    ],
  }),
  component: TerminalPage,
});

type Line = { kind: "in" | "out" | "sys"; text: string };

const NAV: Record<string, string> = {
  home: "/", about: "/about", projects: "/projects", skills: "/skills",
  experience: "/experience", certifications: "/certificates", now: "/now",
  journey: "/journey", gallery: "/gallery", readme: "/readme", contact: "/contact",
};

const COMMANDS = [
  "help","about","projects","skills","experience","journey","gallery","contact",
  "resume","github","linkedin","clear","whoami","pwd","ls","tree","home","now","readme","certifications",
];

const TREE = `src/
├── App/
│   ├── home.sm
│   └── about.sm
├── Recruiter/
│   ├── projects.sm
│   ├── skills.sm
│   ├── experience.sm
│   ├── certifications.sm
│   └── now.sm
├── Personal/
│   ├── journey.sm
│   ├── gallery.sm
│   ├── README.md
│   └── contact.sm
└── terminal.sm`;

function TerminalPage() {
  const navigate = useNavigate();
  const [lines, setLines] = useState<Line[]>([
    { kind: "sys", text: "sankalp@portfolio ~ $ boot" },
    { kind: "sys", text: "> welcome. type 'help' to explore." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight }); }, [lines]);

  function run(cmd: string): Line[] {
    const c = cmd.trim().toLowerCase();
    if (!c) return [];
    if (c === "help") return [{ kind: "out", text: "Commands:\n  " + COMMANDS.join(", ") }];
    if (c === "clear") { setLines([]); return []; }
    if (c === "whoami") return [{ kind: "out", text: profile.name + " — " + profile.title }];
    if (c === "pwd") return [{ kind: "out", text: "/home/sankalp/portfolio" }];
    if (c === "ls") return [{ kind: "out", text: "App/  Recruiter/  Personal/  terminal.sm" }];
    if (c === "tree") return [{ kind: "out", text: TREE }];
    if (c === "resume") { if (typeof window !== "undefined") window.open("/resume.pdf", "_blank"); return [{ kind: "out", text: "Opening resume.pdf…" }]; }
    if (c === "github") { if (typeof window !== "undefined") window.open(profile.github, "_blank"); return [{ kind: "out", text: "→ " + profile.github }]; }
    if (c === "linkedin") { if (typeof window !== "undefined") window.open(profile.linkedin, "_blank"); return [{ kind: "out", text: "→ " + profile.linkedin }]; }
    if (c === "about") return [{ kind: "out", text: profile.summary }];
    if (c === "skills") return [{ kind: "out", text: skillGroups.map(g => `${g.title}: ${g.items.map(([n]) => n).join(", ")}`).join("\n") }];
    if (c === "experience") return [{ kind: "out", text: experience.map(e => `[${e.period}] ${e.role} @ ${e.org}\n  ${e.body}`).join("\n\n") }];
    if (c === "projects") return [{ kind: "out", text: projectsMeta.map(p => `- ${p.title} [${p.category}]`).join("\n") }];
    if (c === "certifications") return [{ kind: "out", text: certificates.map(c => `- ${c.title} (${c.issuer}, ${c.year})`).join("\n") }];
    if (c === "contact") return [{ kind: "out", text: `email:    ${profile.email}\ngithub:   ${profile.github}\nlinkedin: ${profile.linkedin}` }];
    if (NAV[c]) { navigate({ to: NAV[c] }); return [{ kind: "out", text: `Navigating → ${NAV[c]}` }]; }
    return [{ kind: "out", text: `command not found: ${c}\nType 'help'` }];
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input;
    setInput("");
    setHistory(h => [cmd, ...h].slice(0, 40));
    setHIdx(-1);
    const out = run(cmd);
    if (cmd.trim().toLowerCase() === "clear") return;
    setLines(l => [...l, { kind: "in", text: cmd }, ...out]);
  }

  function autocomplete() {
    const p = input.trim().toLowerCase();
    if (!p) return;
    const match = COMMANDS.find(c => c.startsWith(p));
    if (match) setInput(match);
  }

  return (
    <PageShell eyebrow="/terminal.sm" title="Terminal" subtitle="Navigate the portfolio the developer way. Try 'help', 'tree', or 'projects'.">
      <div className="overflow-hidden rounded-2xl neon-border glass-strong">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          <span className="ml-3 font-mono text-[11px] text-muted-foreground">sankalp@portfolio: ~</span>
        </div>
        <div
          ref={bodyRef}
          onClick={() => inputRef.current?.focus()}
          className="h-[60vh] overflow-y-auto p-5 font-mono text-[13px] leading-relaxed text-emerald-200/90"
        >
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {l.kind === "in" && <span className="text-cyan-400">➜ </span>}
              {l.kind === "sys" && <span className="text-muted-foreground">{l.text}</span>}
              {l.kind !== "sys" && <span className={l.kind === "in" ? "text-white" : "text-emerald-200/80"}>{l.text}</span>}
            </div>
          ))}
          <form onSubmit={submit} className="mt-1 flex items-center gap-2">
            <span className="text-cyan-400">➜</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Tab") { e.preventDefault(); autocomplete(); }
                else if (e.key === "ArrowUp") { e.preventDefault(); const n = Math.min(history.length - 1, hIdx + 1); if (n >= 0) { setHIdx(n); setInput(history[n]); } }
                else if (e.key === "ArrowDown") { e.preventDefault(); const n = Math.max(-1, hIdx - 1); setHIdx(n); setInput(n === -1 ? "" : history[n] ?? ""); }
              }}
              autoComplete="off"
              spellCheck={false}
              className="flex-1 bg-transparent text-white caret-cyan-400 outline-none"
            />
            <span className="caret-blink text-cyan-300">▍</span>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
