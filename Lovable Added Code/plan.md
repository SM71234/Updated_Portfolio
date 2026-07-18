# Portfolio Enhancement Plan

Keeping existing layout, navigation, theme, palette, glass, and typography. Elevating content, artwork, and interactions.

## Phase 1 — Content Corrections (fast, no assets)
- **About**: rewrite cards with real bio, B.Tech CSE @ Sanjay Ghodawat University (CGPA 7.9), current role, journey, achievements, goals, interests.
- **Experience**: replace timeline with:
  - Technical Operations Executive — Rotex IT Solutions (current)
  - Web Development Intern — Saiket Systems
  - B.Tech CSE — Sanjay Ghodawat University (CGPA 7.9)
- **Skills**: align to actual stack (Python, FastAPI, Flask, React, Node, Express, JS, HTML/CSS, Tailwind, Bootstrap, PostgreSQL, MongoDB, MySQL, Socket.IO, Supabase, JWT, Git/GitHub, ML, AI, Prompt Engineering, REST). Add small tech icons + card tilt on hover.
- **Projects**: replace list with Auto Sarthi, RedLeaf, Trader Insight, Jarvis, Portfolio Website, Blogging Platform — with accurate descriptions, tech, features.
- Global search-and-replace to purge any "BSc" reference.

## Phase 2 — Custom AI Artwork
Generate premium cinematic images with `imagegen` (standard tier) at 1280×800, save under `src/assets/`:
- `hero-workspace.png` — regenerate: ultrawide monitors, Python/React/Node/FastAPI/PostgreSQL/Docker/GitHub/ML logos on floating holo panels, blue+purple ambient light, glass UI, code windows. Blended with soft radial mask + faded edges (CSS mask-image).
- `project-auto-sarthi.jpg` — smart mobility / auto-rickshaw routes / driver+passenger app.
- `project-redleaf.jpg` — SaaS dashboard: DRHP upload, SWOT, risk gauges, AI insights.
- `project-trader-insight.jpg` — trading terminal, candlesticks, heatmap.
- `project-jarvis.jpg` — AI command center, voice waveform, neural net.
- `project-portfolio.jpg` — multi-device showcase.
- `project-blogging.jpg` — publishing platform, article cards, editor.

Project cards swap gradient banners for these images with a gradient overlay (keeps the accent), plus a subtle motion layer (parallax on hover, animated pulse dot).

## Phase 3 — Hero Refinement
- Typography hierarchy: increase name size, tighten leading, add spacing between name / typing / description / CTAs.
- Illustration: soft radial `mask-image` for faded edges, slow float already exists, add mouse-parallax (transform based on pointer), subtle rotate on scroll, layered ambient glow behind.
- Floating tech icons (small SVG chips: Python, React, Node, FastAPI, PG, Docker) orbiting around illustration with staggered floats.

## Phase 4 — Interactive Terminal Mode
- Floating "⌘ Terminal" FAB (bottom-right, above assistant) + optional nav button.
- Dialog with mono font, blinking caret, command history (up/down arrow), backdrop blur.
- Commands: `help`, `about`, `skills`, `experience`, `projects`, `certificates`, `contact`, `resume`, `clear`. Data pulled from a shared `src/lib/portfolio-data.ts`.
- Boot sequence: 3-line typewriter intro.

## Phase 5 — AI Portfolio Assistant + Resume Explainer
- Enable **Lovable Cloud** for AI Gateway access.
- Server route `src/routes/api/assistant.ts` streaming via AI SDK (`openai/gpt-5.5`, `google/gemini-3-flash-preview` fallback). System prompt embeds `portfolio-data.ts` content (resume, projects, skills, experience, certs, contact). Instruction: answer only from provided context; if unknown say so.
- Floating chat bubble (bottom-right). Click → glass panel with message list (react-markdown) + composer. Streaming with `useChat`.
- "Explain My Resume" quick-prompt chip inside the assistant + a secondary button next to Download Resume that opens the assistant with that prompt pre-sent.
- Suggested prompts row: "Tell me about RedLeaf", "Why hire Sankalp?", "Show AI projects".

## Phase 6 — Micro-Refinements
- **Background**: keep aurora + grid, add a lightweight canvas particle field (30–50 dots, gpu-friendly) and 2–3 slow neural-net lines connecting particles. Skip under `prefers-reduced-motion`.
- **Cursor**: context-aware — magnetic pull on `[data-magnetic]` buttons; scale up on cards; soft spotlight over hero illustration container.
- **Loader**: rotating messages ("Initializing Portfolio…", "Loading Projects…", "Preparing Experience…", "Loading AI Models…", "Rendering Interface…", "Launching Experience…") with progress bar, cinematic fade into hero.
- **Contact**: refine input focus glow, success animation (check-mark + confetti-lite), magnetic submit button.
- **Certificates**: hover reflection sheen, glow expand, animated "View Certificate" label.
- **Consistency sweep**: unify radii (rounded-3xl / rounded-2xl), shadow tokens, button variants, section paddings, transition durations (200 / 400 / 700).

## Phase 7 — Performance & A11y
- Convert large images to compressed JPGs; `loading="lazy"` on all non-hero art.
- Respect `prefers-reduced-motion` in Framer variants + particle canvas.
- Ensure focus rings, aria-labels on all icon buttons, semantic landmarks.

## Technical Notes
- New files:
  - `src/lib/portfolio-data.ts` (source of truth for all sections + AI context).
  - `src/components/site/Terminal.tsx`
  - `src/components/site/AIAssistant.tsx`
  - `src/components/site/Particles.tsx`
  - `src/components/site/Loader.tsx` (rotating messages)
  - `src/routes/api/assistant.ts` (streaming server route)
- Updated: all page routes, `__root.tsx` (mount Terminal + AIAssistant + Loader), `styles.css` (mask utility, magnetic hooks).
- Cloud: enable via `supabase--enable` prerequisite for AI Gateway key. Model default `google/gemini-3-flash-preview` (fast, cheap, streaming).

## Order of Execution
1. Enable Lovable Cloud (background).
2. Content corrections + `portfolio-data.ts` (fast, unblocks assistant + terminal).
3. Generate 7 AI artworks in parallel.
4. Hero refinement + project card image integration.
5. Terminal + AI assistant + resume explainer.
6. Loader, particles, cursor upgrades.
7. Micro-polish + consistency sweep.

Reply "go" to start, or tell me what to trim (e.g. skip terminal, skip AI assistant, skip particle field) if you want a lighter pass.