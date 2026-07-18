// Single source of truth for portfolio content.
// Consumed by pages, the Terminal, and the AI Assistant system prompt.

export const profile = {
  name: "Sankalp Misal",
  title: "Full Stack Developer · Python · AI Engineer",
  location: "India — Remote friendly",
  email: "hello@sankalp.dev",
  github: "https://github.com/sankalpmisal",
  linkedin: "https://linkedin.com/in/sankalpmisal",
  summary:
    "Software engineer specialising in Python, backend systems, full stack development, and Artificial Intelligence. I build fast, thoughtful, production-grade products end-to-end.",
};

export const education = [
  {
    degree: "B.Tech in Computer Science & Engineering",
    school: "Sanjay Ghodawat University",
    period: "2019 — 2023",
    highlight: "CGPA: 7.9",
    detail:
      "Deep focus on data structures, operating systems, DBMS, networks, and modern web engineering.",
  },
];

export const experience = [
  {
    role: "Technical Operations Executive",
    org: "Rotex IT Solutions",
    period: "2023 — Present",
    body: "Own production operations, automate internal workflows, and ship full-stack tooling that unlocks the team. Built dashboards, integrations, and monitoring from scratch.",
    tags: ["Python", "Node.js", "PostgreSQL", "Automation", "REST APIs"],
  },
  {
    role: "Web Development Intern",
    org: "Saiket Systems",
    period: "2022 — 2023",
    body: "Contributed features across the stack — reliable APIs, rebuilt legacy UI screens with a modern React + Tailwind foundation, and delivered production releases.",
    tags: ["React", "JavaScript", "REST", "Tailwind"],
  },
  {
    role: "B.Tech CSE — Sanjay Ghodawat University",
    org: "Education",
    period: "2019 — 2023",
    body: "Graduated with CGPA 7.9. Led college dev community and shipped multiple side projects in AI and full-stack.",
    tags: ["DSA", "OS", "DBMS", "Networks"],
  },
];

export const skillGroups = [
  {
    title: "Languages",
    items: [
      ["Python", 92],
      ["JavaScript", 92],
      ["TypeScript", 88],
      ["SQL", 86],
      ["HTML", 95],
      ["CSS", 92],
    ],
  },
  {
    title: "Backend",
    items: [
      ["FastAPI", 90],
      ["Flask", 85],
      ["Node.js", 88],
      ["Express.js", 86],
      ["REST APIs", 92],
      ["Socket.IO", 80],
      ["JWT", 85],
    ],
  },
  {
    title: "Frontend",
    items: [
      ["React", 93],
      ["Tailwind CSS", 94],
      ["Bootstrap", 85],
      ["Framer Motion", 82],
    ],
  },
  {
    title: "Database",
    items: [
      ["PostgreSQL", 88],
      ["MongoDB", 82],
      ["MySQL", 85],
      ["Supabase", 88],
    ],
  },
  {
    title: "AI / ML",
    items: [
      ["Machine Learning", 82],
      ["Artificial Intelligence", 85],
      ["Prompt Engineering", 90],
    ],
  },
  {
    title: "Tools",
    items: [
      ["Git", 92],
      ["GitHub", 92],
    ],
  },
] as const;

export type ProjectCategory = "Mega Project" | "AI" | "Full Stack" | "Tools";

export interface PortfolioProject {
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  tech: string[];
  features: string[];
  image: string; // imported url
  accent: string;
  github?: string;
  demo?: string;
}

// Image imports handled in the projects page — this data file stays framework-free.
export const projectsMeta = [
  {
    slug: "auto-sarthi",
    title: "Auto Sarthi",
    category: "Mega Project" as const,
    description:
      "An intelligent smart-mobility platform connecting auto-rickshaw drivers and passengers with real-time tracking, dynamic routing, and in-app booking. Built to modernise urban commuting.",
    tech: ["React", "Node.js", "Express", "PostgreSQL", "Socket.IO", "Maps API"],
    features: [
      "Live GPS tracking",
      "Passenger + driver apps",
      "Dynamic route optimisation",
      "Booking & payments",
    ],
    accent: "from-cyan-400 via-blue-500 to-purple-500",
  },
  {
    slug: "redleaf",
    title: "RedLeaf — AI IPO Analysis",
    category: "AI" as const,
    description:
      "A premium SaaS platform that ingests IPO DRHP documents, runs AI-driven SWOT and risk analysis, and produces investment recommendations backed by financial insights.",
    tech: ["Python", "FastAPI", "React", "PostgreSQL", "OpenAI", "Prompt Engineering"],
    features: [
      "DRHP PDF ingestion",
      "AI SWOT + risk analysis",
      "Financial charts & metrics",
      "Investment recommendations",
    ],
    accent: "from-purple-500 via-fuchsia-500 to-pink-500",
  },
  {
    slug: "trader-insight",
    title: "Trader Insight",
    category: "Full Stack" as const,
    description:
      "A professional trading terminal with live candlestick charts, portfolio analytics, position calculator, and market heatmaps for retail traders.",
    tech: ["React", "Node.js", "MongoDB", "WebSockets", "Charting"],
    features: [
      "Live candlestick charts",
      "Portfolio analytics",
      "Position calculator",
      "Market heatmap",
    ],
    accent: "from-emerald-400 via-cyan-500 to-blue-600",
  },
  {
    slug: "jarvis",
    title: "Jarvis Voice Assistant",
    category: "AI" as const,
    description:
      "A Python-powered voice assistant that automates system tasks, answers queries, and controls apps by voice — a personal AI command center inspired by Iron Man.",
    tech: ["Python", "SpeechRecognition", "OpenAI", "PyAutoGUI"],
    features: [
      "Wake-word activation",
      "Voice-driven automation",
      "Web queries",
      "Custom skill modules",
    ],
    accent: "from-blue-500 via-indigo-500 to-purple-600",
  },
  {
    slug: "portfolio",
    title: "Portfolio Website",
    category: "Full Stack" as const,
    description:
      "This very site — a premium, animated developer portfolio featuring an AI assistant, terminal mode, and cinematic AI-generated artwork.",
    tech: ["React", "TypeScript", "TanStack Router", "Tailwind", "Framer Motion", "Lovable AI"],
    features: [
      "AI portfolio assistant",
      "Interactive terminal",
      "Cinematic animations",
      "Fully responsive",
    ],
    accent: "from-cyan-400 via-blue-500 to-purple-500",
  },
  {
    slug: "blogging",
    title: "Blogging Platform",
    category: "Full Stack" as const,
    description:
      "A modern publishing platform with a markdown editor, live preview, reading analytics, tags, and responsive article layouts.",
    tech: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    features: [
      "Markdown editor + live preview",
      "Tags & search",
      "Reading analytics",
      "Auth & profiles",
    ],
    accent: "from-orange-400 via-rose-500 to-purple-600",
  },
];

export const certificates = [
  { title: "Full Stack Web Development", issuer: "Coursera", year: "2024" },
  { title: "Python for Everybody", issuer: "University of Michigan", year: "2023" },
  { title: "Machine Learning Basics", issuer: "Google", year: "2023" },
  { title: "Advanced React Patterns", issuer: "Meta", year: "2024" },
  { title: "SQL & Database Design", issuer: "IBM", year: "2023" },
  { title: "AI & Prompt Engineering", issuer: "DeepLearning.AI", year: "2024" },
];

// Compiled context passed to the AI assistant system prompt.
export function getAssistantContext() {
  const skills = skillGroups
    .map((g) => `${g.title}: ${g.items.map(([n]) => n).join(", ")}`)
    .join("\n");
  const exp = experience
    .map((e) => `- ${e.role} @ ${e.org} (${e.period}): ${e.body}`)
    .join("\n");
  const projs = projectsMeta
    .map(
      (p) =>
        `- ${p.title} [${p.category}]: ${p.description} Tech: ${p.tech.join(", ")}. Features: ${p.features.join(", ")}.`,
    )
    .join("\n");
  const edu = education
    .map((e) => `- ${e.degree}, ${e.school} (${e.period}) — ${e.highlight}`)
    .join("\n");
  const certs = certificates.map((c) => `- ${c.title} (${c.issuer}, ${c.year})`).join("\n");

  return `You are the personal AI assistant for ${profile.name}'s portfolio website.
Answer questions ONLY using the facts below. If a visitor asks something not covered here, say you don't have that information and suggest contacting Sankalp directly at ${profile.email}. Keep responses concise, elegant, and recruiter-friendly. Use short paragraphs and light markdown (bold, lists) when helpful. Never invent facts, dates, employers, or numbers.

# Profile
Name: ${profile.name}
Title: ${profile.title}
Location: ${profile.location}
Email: ${profile.email}
GitHub: ${profile.github}
LinkedIn: ${profile.linkedin}
Summary: ${profile.summary}

# Education
${edu}

# Experience
${exp}

# Skills
${skills}

# Projects
${projs}

# Certificates
${certs}

# Style
- Speak in first person about Sankalp only when explicitly asked; default to third person.
- Be warm, confident, and precise. Do not hallucinate.
- For "Explain my resume" or "Why hire Sankalp?" — give a crisp, well-structured summary.`;
}
