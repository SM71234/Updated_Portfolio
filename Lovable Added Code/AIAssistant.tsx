import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Tell me about RedLeaf",
  "Why should I hire Sankalp?",
  "Show AI projects",
  "Explain my resume",
];

let externalOpen: ((prompt?: string) => void) | null = null;
export function openAIAssistant(prompt?: string) {
  externalOpen?.(prompt);
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi 👋 I'm Sankalp's AI assistant. Ask me about his projects, skills, experience, or resume — I've been trained on his portfolio.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async (prompt: string) => {
    if (!prompt.trim() || loading) return;
    const nextMessages: Msg[] = [...messages, { role: "user", content: prompt }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      if (!res.ok || !res.body) throw new Error(`Request failed (${res.status})`);
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += value;
        setMessages((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e) {
      setMessages((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "I couldn't reach the assistant right now. Try again in a moment or email hello@sankalp.dev.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  useEffect(() => {
    externalOpen = (prompt?: string) => {
      setOpen(true);
      if (prompt) setTimeout(() => send(prompt), 250);
    };
    return () => { externalOpen = null; };
  }, [send]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI assistant"
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-neon text-background glow-purple shadow-2xl"
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[min(400px,calc(100vw-2rem))] glass-strong rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            style={{ height: "min(560px, calc(100vh - 8rem))" }}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-neon text-background">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">Sankalp's AI</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Portfolio Assistant
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full glass p-1.5" aria-label="Close">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-neon text-background"
                        : "glass text-foreground"
                    }`}
                  >
                    {m.role === "assistant" && m.content === "" && loading ? (
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce" />
                      </span>
                    ) : m.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full glass px-3 py-1 text-[11px] hover:bg-white/10 transition inline-flex items-center gap-1"
                  >
                    {s === "Explain my resume" && <FileText className="h-3 w-3" />}
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="border-t border-white/10 p-3 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, skills, resume…"
                className="flex-1 bg-white/5 rounded-full px-4 py-2.5 text-sm outline-none border border-white/10 focus:border-primary/60 transition"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="grid h-10 w-10 place-items-center rounded-full bg-gradient-neon text-background disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
