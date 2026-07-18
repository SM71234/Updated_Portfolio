import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ChevronRight,
  FileCode2,
  FileText,
  Folder,
  FolderOpen,
  FolderTree,
  TerminalSquare,
  X,
} from "lucide-react";

export type ExplorerFile = {
  name: string;
  to: string;
  kind?: "sm" | "md" | "terminal";
};
export type ExplorerFolder = {
  name: string;
  children: (ExplorerFile | ExplorerFolder)[];
};
type Node = ExplorerFile | ExplorerFolder;

const isFolder = (n: Node): n is ExplorerFolder =>
  (n as ExplorerFolder).children !== undefined;

export const explorerTree: ExplorerFolder = {
  name: "src",
  children: [
    {
      name: "App",
      children: [
        { name: "home.sm", to: "/" },
        { name: "about.sm", to: "/about" },
      ],
    },
    {
      name: "Recruiter",
      children: [
        { name: "projects.sm", to: "/projects" },
        { name: "skills.sm", to: "/skills" },
        { name: "experience.sm", to: "/experience" },
        { name: "certifications.sm", to: "/certificates" },
        { name: "now.sm", to: "/now" },
      ],
    },
    {
      name: "Personal",
      children: [
        { name: "journey.sm", to: "/journey" },
        { name: "gallery.sm", to: "/gallery" },
        { name: "README.md", to: "/readme", kind: "md" },
        { name: "contact.sm", to: "/contact" },
      ],
    },
    { name: "terminal.sm", to: "/terminal", kind: "terminal" },
  ],
};

const STORAGE_KEY = "explorer.open-folders.v1";

function useOpenFolders(defaults: string[] = []) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(defaults));
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOpen(new Set(JSON.parse(raw)));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...open]));
    } catch {}
  }, [open]);
  const toggle = (path: string) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(path) ? n.delete(path) : n.add(path);
      return n;
    });
  return { open, toggle };
}

function FileIcon({ kind }: { kind?: ExplorerFile["kind"] }) {
  if (kind === "md") return <FileText className="h-3.5 w-3.5 text-orange-300/80" />;
  if (kind === "terminal")
    return <TerminalSquare className="h-3.5 w-3.5 text-emerald-300/90" />;
  return <FileCode2 className="h-3.5 w-3.5 text-cyan-300/80" />;
}

function FileRow({
  file,
  active,
  depth,
  onNavigate,
}: {
  file: ExplorerFile;
  active: boolean;
  depth: number;
  onNavigate: (to: string, name: string) => void;
}) {
  return (
    <motion.button
      layout
      onClick={() => onNavigate(file.to, file.name)}
      whileHover={{ x: 4 }}
      style={{ paddingLeft: 12 + depth * 14 }}
      className={[
        "group relative flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-left font-mono text-[12.5px] transition-colors",
        active
          ? "bg-white/5 text-white"
          : "text-muted-foreground hover:bg-white/[0.04] hover:text-white",
      ].join(" ")}
    >
      {active && (
        <motion.span
          layoutId="explorer-active-bar"
          className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full bg-gradient-neon"
        />
      )}
      <FileIcon kind={file.kind} />
      <span className="truncate">{file.name}</span>
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(56,189,248,0.7)]" />
      )}
    </motion.button>
  );
}

function TreeNode({
  node,
  path,
  depth,
  openSet,
  toggle,
  activePath,
  onNavigate,
}: {
  node: Node;
  path: string;
  depth: number;
  openSet: Set<string>;
  toggle: (p: string) => void;
  activePath: string;
  onNavigate: (to: string, name: string) => void;
}) {
  if (!isFolder(node)) {
    return (
      <FileRow
        file={node}
        depth={depth}
        active={activePath === node.to}
        onNavigate={onNavigate}
      />
    );
  }
  const isOpen = openSet.has(path);
  return (
    <div>
      <button
        onClick={() => toggle(path)}
        style={{ paddingLeft: 8 + depth * 14 }}
        className="flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-left font-mono text-[12.5px] text-foreground/85 transition-colors hover:bg-white/[0.04]"
      >
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.18 }}
          className="inline-flex h-3.5 w-3.5 items-center justify-center text-muted-foreground"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </motion.span>
        {isOpen ? (
          <FolderOpen className="h-3.5 w-3.5 text-blue-300/90" />
        ) : (
          <Folder className="h-3.5 w-3.5 text-blue-300/80" />
        )}
        <span className="font-medium">{node.name}</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="c"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="py-0.5">
              {node.children.map((child) => (
                <TreeNode
                  key={path + "/" + child.name}
                  node={child}
                  path={path + "/" + child.name}
                  depth={depth + 1}
                  openSet={openSet}
                  toggle={toggle}
                  activePath={activePath}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ExplorerTree({
  onNavigated,
  className = "",
}: {
  onNavigated?: () => void;
  className?: string;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { open, toggle } = useOpenFolders(["/src/App"]);
  const [loading, setLoading] = useState<string | null>(null);

  const onNavigate = (to: string, name: string) => {
    setLoading(name);
    setTimeout(() => {
      navigate({ to });
      setLoading(null);
      onNavigated?.();
    }, 220);
  };

  return (
    <div className={"flex h-full flex-col " + className}>
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <FolderTree className="h-3.5 w-3.5 text-cyan-300" />
          Explorer
        </div>
        <span className="font-mono text-[10px] text-muted-foreground/70">
          portfolio-v3
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-2 pr-1">
        <button
          onClick={() => toggle("/src")}
          className="flex w-full items-center gap-1.5 rounded-md py-1.5 pl-2 pr-2 text-left font-mono text-[12.5px] text-foreground/90 hover:bg-white/[0.04]"
        >
          <motion.span
            animate={{ rotate: open.has("/src") ? 90 : 0 }}
            transition={{ duration: 0.18 }}
            className="inline-flex h-3.5 w-3.5 items-center justify-center text-muted-foreground"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </motion.span>
          {open.has("/src") ? (
            <FolderOpen className="h-3.5 w-3.5 text-blue-300/90" />
          ) : (
            <Folder className="h-3.5 w-3.5 text-blue-300/80" />
          )}
          <span className="font-semibold">src</span>
        </button>
        <AnimatePresence initial={false}>
          {open.has("/src") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              {explorerTree.children.map((child) => (
                <TreeNode
                  key={"/src/" + child.name}
                  node={child}
                  path={"/src/" + child.name}
                  depth={1}
                  openSet={open}
                  toggle={toggle}
                  activePath={pathname}
                  onNavigate={onNavigate}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="border-t border-white/10 px-3 py-2 font-mono text-[10.5px] text-muted-foreground/80">
        {loading ? (
          <span className="text-cyan-300">Opening {loading}…</span>
        ) : (
          <span>
            <span className="text-emerald-300">●</span> ready · {pathname}
          </span>
        )}
      </div>
    </div>
  );
}

/** Home-hero inline panel (no floating chrome). */
export function ExplorerPanel({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-2xl neon-border glass-strong " +
        className
      }
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        <span className="ml-3 font-mono text-[11px] text-muted-foreground">
          sankalp-portfolio — explorer
        </span>
      </div>
      <div className="h-[420px]">
        <ExplorerTree />
      </div>
    </div>
  );
}

/** Floating button + modal for inner pages. */
export function ExplorerFAB() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Hide on home (explorer is inline in hero) and on terminal page (has its own).
  if (pathname === "/" || pathname === "/terminal") return null;

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(true)}
        aria-label="Open project explorer"
        className="fixed left-1/2 top-24 z-40 -translate-x-1/2 inline-flex items-center gap-2 rounded-full glass-strong px-4 py-2 font-mono text-xs text-foreground/90 hover:bg-white/10"
      >
        <FolderTree className="h-3.5 w-3.5 text-cyan-300" />
        <span>Explorer</span>
        <kbd className="ml-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground">
          ⌘E
        </kbd>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[70] bg-background/60 backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <motion.div
              ref={panelRef}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-1/2 w-[min(420px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl neon-border glass-strong shadow-2xl"
            >
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                <span className="ml-3 font-mono text-[11px] text-muted-foreground">
                  sankalp-portfolio
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="ml-auto rounded p-1 text-muted-foreground hover:bg-white/10 hover:text-white"
                  aria-label="Close explorer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="h-[min(520px,70vh)]">
                <ExplorerTree onNavigated={() => setOpen(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
