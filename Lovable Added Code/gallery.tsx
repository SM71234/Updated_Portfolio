import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Heart,
  Maximize2,
  Camera,
  FolderHeart,
  CalendarRange,
  Sparkles,
  Play,
  Shuffle,
  Map as MapIcon,
  Pause,
} from "lucide-react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Moments, Memories & Everything In Between" },
      {
        name: "description",
        content:
          "A collection of random clicks, unforgettable memories, beautiful places and little moments that shaped Sankalp's journey.",
      },
      { property: "og:title", content: "Gallery — Sankalp Misal" },
      {
        property: "og:description",
        content: "A cinematic photo album — college life, football, travel, nights of code, and everything in between.",
      },
    ],
  }),
  component: GalleryPage,
});

/* ------------------------- Data ------------------------- */

const CATS = ["All", "College", "Travel", "Friends", "Football", "Workspace", "Events", "Random"] as const;
type Cat = (typeof CATS)[number];

type Photo = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  location: string;
  year: number;
  date: string;
  cat: Cat;
  featured?: boolean;
  h?: "s" | "m" | "l" | "xl"; // masonry hint
};

// Curated Unsplash photos (stable IDs). Swap with real memories any time.
const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

const PHOTOS: Photo[] = [
  // ---- Featured (carousel) ----
  {
    id: "f1",
    src: u("photo-1519681393784-d120267933ba", 1400),
    alt: "Northern lights over a mountain lake",
    caption: "Chasing skies I didn't know existed.",
    location: "Lofoten, Norway",
    year: 2024,
    date: "Feb 2024",
    cat: "Travel",
    featured: true,
    h: "xl",
  },
  {
    id: "f2",
    src: u("photo-1502904550040-7534597429ae", 1400),
    alt: "Football under floodlights",
    caption: "90 minutes. One team. Everything.",
    location: "Kolhapur, IN",
    year: 2023,
    date: "Nov 2023",
    cat: "Football",
    featured: true,
    h: "l",
  },
  {
    id: "f3",
    src: u("photo-1517134191118-9d595e4c8c2b", 1400),
    alt: "Graduation cap in the air",
    caption: "The morning we became engineers.",
    location: "SGU Campus",
    year: 2026,
    date: "May 2026",
    cat: "College",
    featured: true,
    h: "l",
  },
  {
    id: "f4",
    src: u("photo-1498050108023-c5249f4df085", 1400),
    alt: "Late-night code on a laptop",
    caption: "3AM. Just one more commit.",
    location: "Home Studio",
    year: 2025,
    date: "Aug 2025",
    cat: "Workspace",
    featured: true,
    h: "m",
  },
  {
    id: "f5",
    src: u("photo-1523995462485-3d171b5c8fa9", 1400),
    alt: "Friends walking at sunset",
    caption: "The people who make the memories.",
    location: "Goa, IN",
    year: 2022,
    date: "Dec 2022",
    cat: "Friends",
    featured: true,
    h: "l",
  },
  {
    id: "f6",
    src: u("photo-1464822759023-fed622ff2c3b", 1400),
    alt: "Mountain range at golden hour",
    caption: "Silence, at 12,000 feet.",
    location: "Ladakh, IN",
    year: 2023,
    date: "Jul 2023",
    cat: "Travel",
    featured: true,
    h: "xl",
  },
  {
    id: "f7",
    src: u("photo-1533174072545-7a4b6ad7a6c3", 1400),
    alt: "Confetti at a fest",
    caption: "That one campus night.",
    location: "College Fest",
    year: 2024,
    date: "Mar 2024",
    cat: "Events",
    featured: true,
    h: "m",
  },
  {
    id: "f8",
    src: u("photo-1493246507139-91e8fad9978e", 1400),
    alt: "Reflection on a still lake",
    caption: "Nature does the design.",
    location: "Manali, IN",
    year: 2021,
    date: "Oct 2021",
    cat: "Random",
    featured: true,
    h: "l",
  },

  // ---- Rest of the gallery ----
  {
    id: "g1",
    src: u("photo-1522199755839-a2bacb67c546"),
    alt: "Classroom whiteboard scribbles",
    caption: "Where equations became addictions.",
    location: "SGU Lab",
    year: 2023,
    cat: "College",
    date: "Sep 2023",
    h: "m",
  },
  {
    id: "g2",
    src: u("photo-1521737604893-d14cc237f11d"),
    alt: "Friends laughing",
    caption: "Uncontrollable laughter kind of day.",
    location: "Hostel",
    year: 2024,
    date: "Jan 2024",
    cat: "Friends",
    h: "s",
  },
  {
    id: "g3",
    src: u("photo-1508098682722-e99c43a406b2"),
    alt: "Football on grass",
    caption: "The only round thing I trust.",
    location: "Ground 2",
    year: 2022,
    date: "Aug 2022",
    cat: "Football",
    h: "l",
  },
  {
    id: "g4",
    src: u("photo-1483058712412-4245e9b90334"),
    alt: "Clean desk setup",
    caption: "Made with a lot of dopamine.",
    location: "Workspace",
    year: 2025,
    date: "Feb 2025",
    cat: "Workspace",
    h: "m",
  },
  {
    id: "g5",
    src: u("photo-1500835556837-99ac94a94552"),
    alt: "Winding mountain road",
    caption: "Roads I'd take again in a heartbeat.",
    location: "Spiti",
    year: 2023,
    date: "Jun 2023",
    cat: "Travel",
    h: "xl",
  },
  {
    id: "g6",
    src: u("photo-1541519227354-08fa5d50c44d"),
    alt: "Coffee and code",
    caption: "Two things that never leave me.",
    location: "Cafe",
    year: 2024,
    date: "Dec 2024",
    cat: "Workspace",
    h: "s",
  },
  {
    id: "g7",
    src: u("photo-1517457373958-b7bdd4587205"),
    alt: "Team huddle",
    caption: "Before every big match.",
    location: "Home Ground",
    year: 2022,
    date: "Mar 2022",
    cat: "Football",
    h: "m",
  },
  {
    id: "g8",
    src: u("photo-1523580494863-6f3031224c94"),
    alt: "College corridor",
    caption: "Hallways that raised me.",
    location: "SGU",
    year: 2024,
    date: "Apr 2024",
    cat: "College",
    h: "l",
  },
  {
    id: "g9",
    src: u("photo-1526481280693-3bfa7568e0f3"),
    alt: "Concert lights",
    caption: "Loud, alive, unforgettable.",
    location: "Pune",
    year: 2023,
    date: "Nov 2023",
    cat: "Events",
    h: "m",
  },
  {
    id: "g10",
    src: u("photo-1441974231531-c6227db76b6e"),
    alt: "Forest trail",
    caption: "Reset button, in green.",
    location: "Coorg",
    year: 2021,
    date: "Dec 2021",
    cat: "Travel",
    h: "l",
  },
  {
    id: "g11",
    src: u("photo-1517486808906-6ca8b3f04846"),
    alt: "Late study session",
    caption: "Exams > sleep.",
    location: "Library",
    year: 2022,
    date: "May 2022",
    cat: "College",
    h: "s",
  },
  {
    id: "g12",
    src: u("photo-1487412720507-e7ab37603c6f"),
    alt: "Sky above buildings",
    caption: "Looked up. Everything felt small.",
    location: "Mumbai",
    year: 2020,
    date: "Feb 2020",
    cat: "Random",
    h: "s",
  },
  {
    id: "g13",
    src: u("photo-1552664730-d307ca884978"),
    alt: "Team celebration",
    caption: "The moment the whistle blew.",
    location: "Regional Cup",
    year: 2025,
    date: "Oct 2025",
    cat: "Football",
    h: "m",
  },
  {
    id: "g14",
    src: u("photo-1519389950473-47ba0277781c"),
    alt: "Group work",
    caption: "Six laptops. One deadline.",
    location: "Coworking",
    year: 2025,
    date: "Jun 2025",
    cat: "Workspace",
    h: "m",
  },
  {
    id: "g15",
    src: u("photo-1476514525535-07fb3b4ae5f1"),
    alt: "Snow-capped peaks",
    caption: "Cold air, warm memories.",
    location: "Kashmir",
    year: 2019,
    date: "Jan 2019",
    cat: "Travel",
    h: "l",
  },
  {
    id: "g16",
    src: u("photo-1543269865-cbf427effbad"),
    alt: "Friends smiling",
    caption: "Chosen family.",
    location: "Kolhapur",
    year: 2026,
    date: "Feb 2026",
    cat: "Friends",
    h: "s",
  },
  {
    id: "g17",
    src: u("photo-1516035069371-29a1b244cc32"),
    alt: "Random street click",
    caption: "Ordinary moments, extraordinary somehow.",
    location: "Old City",
    year: 2018,
    date: "Nov 2018",
    cat: "Random",
    h: "m",
  },
  {
    id: "g18",
    src: u("photo-1531058020387-3be344556be6"),
    alt: "Rooftop hangout",
    caption: "Tea, talk, terraces.",
    location: "Home",
    year: 2020,
    date: "Aug 2020",
    cat: "Friends",
    h: "s",
  },
];

const FEATURED = PHOTOS.filter((p) => p.featured);
const REST = PHOTOS.filter((p) => !p.featured);

const STATS = [
  { icon: Camera, label: "Photos", value: `${PHOTOS.length * 20}+` },
  { icon: FolderHeart, label: "Albums", value: "24" },
  { icon: CalendarRange, label: "Years", value: "7+" },
  { icon: Sparkles, label: "Memories", value: "Countless" },
];

const SPAN_MAP: Record<NonNullable<Photo["h"]>, string> = {
  s: "row-span-1",
  m: "row-span-2",
  l: "row-span-3",
  xl: "row-span-4",
};

/* ------------------------- Page ------------------------- */

function GalleryPage() {
  const [cat, setCat] = useState<Cat>("All");
  const [year, setYear] = useState<number | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [viewerSource, setViewerSource] = useState<"grid" | "featured">("grid");
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Randomize order on mount for the "alive" feel
  useEffect(() => {
    setShuffleSeed(Math.random());
  }, []);

  const shuffled = useMemo(() => {
    const arr = [...REST];
    // seeded shuffle
    let s = Math.floor(shuffleSeed * 100000) || 1;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [shuffleSeed]);

  const filtered = useMemo(() => {
    return shuffled.filter((p) => {
      if (cat !== "All" && p.cat !== cat) return false;
      if (year !== null && p.year !== year) return false;
      if (showFavOnly && !favs.has(p.id)) return false;
      return true;
    });
  }, [shuffled, cat, year, showFavOnly, favs]);

  const years = useMemo(() => {
    const map = new Map<number, number>();
    PHOTOS.forEach((p) => map.set(p.year, (map.get(p.year) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, []);

  const toggleFav = useCallback((id: string) => {
    setFavs((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }, []);

  // Which list drives the lightbox (grid = filtered rest, featured = FEATURED)
  const viewerList = viewerSource === "featured" ? FEATURED : filtered;

  const openAt = useCallback((idx: number) => {
    setViewerSource("grid");
    setOpenIdx(idx);
  }, []);
  const openFeatured = useCallback((p: Photo) => {
    const idx = FEATURED.findIndex((x) => x.id === p.id);
    if (idx < 0) return;
    setViewerSource("featured");
    setOpenIdx(idx);
  }, []);
  const close = useCallback(() => setOpenIdx(null), []);
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? i : (i + 1) % viewerList.length)),
    [viewerList.length],
  );
  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? i : (i - 1 + viewerList.length) % viewerList.length)),
    [viewerList.length],
  );

  // Keyboard nav in lightbox
  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, close, next, prev]);

  // Slideshow mode
  const [slideshow, setSlideshow] = useState(false);
  useEffect(() => {
    if (!slideshow || openIdx === null) return;
    const t = setInterval(() => next(), 3200);
    return () => clearInterval(t);
  }, [slideshow, openIdx, next]);

  const active = openIdx !== null ? viewerList[openIdx] : null;

  return (
    <PageShell
      eyebrow="/gallery"
      title="Moments, Memories & Everything In Between"
      subtitle="A collection of random clicks, unforgettable memories, beautiful places and little moments that shaped my journey."
    >
      {/* Stats */}
      <StatsRow />

      {/* Featured 3D carousel */}
      <section className="relative mt-14 md:mt-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.28em] text-cyan-300">Featured</div>
            <h2 className="mt-1 font-display text-2xl md:text-3xl font-semibold">
              Memories worth <span className="text-gradient">framing</span>.
            </h2>
          </div>
        </div>
        <CoverFlow photos={FEATURED} onOpen={openFeatured} />
      </section>

      {/* Category filter */}
      <section className="mt-16">
        <div className="flex flex-wrap items-center gap-2">
          {CATS.map((c) => {
            const isActive = cat === c;
            const count = c === "All" ? REST.length : REST.filter((p) => p.cat === c).length;
            return (
              <motion.button
                key={c}
                layout
                onClick={() => setCat(c)}
                whileTap={{ scale: 0.96 }}
                className={[
                  "relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                  isActive
                    ? "text-background"
                    : "glass text-muted-foreground hover:text-white hover:border-white/20",
                ].join(" ")}
              >
                {isActive && (
                  <motion.span
                    layoutId="catPill"
                    className="absolute inset-0 rounded-full bg-gradient-neon shadow-[0_0_22px_oklch(0.7_0.22_260/0.55)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{c}</span>
                <span
                  className={[
                    "relative rounded-full px-1.5 py-0.5 text-[9px] font-bold tabular-nums",
                    isActive ? "bg-background/25 text-background" : "bg-white/5 text-white/60",
                  ].join(" ")}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}

          <div className="ml-auto flex items-center gap-2">
            {(year !== null || showFavOnly) && (
              <button
                onClick={() => {
                  setYear(null);
                  setShowFavOnly(false);
                }}
                className="rounded-full glass px-3 py-1.5 text-[11px] text-muted-foreground hover:text-white"
              >
                Clear filters
              </button>
            )}
            <span className="hidden text-[11px] uppercase tracking-[0.28em] text-muted-foreground md:inline">
              {filtered.length} shown
            </span>
          </div>
        </div>
      </section>

      {/* Masonry */}
      <section className="mt-8">
        <MasonryGrid photos={filtered} onOpen={openAt} favs={favs} onFav={toggleFav} />
        {filtered.length === 0 && (
          <div className="mt-16 text-center text-sm text-muted-foreground">
            No memories match this filter — yet.
          </div>
        )}
      </section>

      {/* Timeline */}
      <section className="mt-20">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.28em] text-cyan-300">Timeline</div>
            <h2 className="mt-1 font-display text-2xl md:text-3xl font-semibold">
              A <span className="text-gradient">decade</span> in moments.
            </h2>
          </div>
        </div>
        <div className="scroll-x flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
          {years.map(([y, n]) => {
            const isActive = year === y;
            return (
              <button
                key={y}
                onClick={() => setYear(isActive ? null : y)}
                className={[
                  "snap-start shrink-0 rounded-2xl px-5 py-4 text-left transition-all min-w-[120px]",
                  isActive
                    ? "glass-strong neon-border shadow-[0_0_28px_oklch(0.7_0.22_260/0.35)]"
                    : "glass hover:border-white/20",
                ].join(" ")}
              >
                <div className={`font-display text-2xl font-semibold ${isActive ? "text-gradient" : ""}`}>
                  {y}
                </div>
                <div className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {n} {n === 1 ? "memory" : "memories"}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Feature cards */}
      <section className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={Play}
          title="Slideshow"
          desc="Sit back and let the memories play."
          onClick={() => {
            if (filtered.length === 0) return;
            setOpenIdx(0);
            setSlideshow(true);
          }}
        />
        <FeatureCard
          icon={Shuffle}
          title="Shuffle"
          desc="Reshuffle the gallery for a fresh view."
          onClick={() => setShuffleSeed(Math.random())}
        />
        <FeatureCard
          icon={MapIcon}
          title="Map View"
          desc="Memories by location. Coming soon."
          soon
        />
        <FeatureCard
          icon={Heart}
          title={showFavOnly ? "Show all" : "Favorites"}
          desc={showFavOnly ? "Return to the full gallery." : `${favs.size} saved. Tap to filter.`}
          active={showFavOnly}
          onClick={() => setShowFavOnly((v) => !v)}
        />
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {active && openIdx !== null && (
          <Lightbox
            photo={active}
            index={openIdx}
            total={filtered.length}
            slideshow={slideshow}
            onSlideshowToggle={() => setSlideshow((v) => !v)}
            onClose={() => {
              setSlideshow(false);
              close();
            }}
            onNext={next}
            onPrev={prev}
            fav={favs.has(active.id)}
            onFav={() => toggleFav(active.id)}
          />
        )}
      </AnimatePresence>
    </PageShell>
  );
}



/* ------------------------- Stats ------------------------- */

function StatsRow() {
  return (
    <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {STATS.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-2xl glass-strong border border-white/10 p-4 md:p-5"
          >
            {/* floating orb */}
            <motion.span
              aria-hidden
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.22_260/0.4),transparent_65%)] blur-xl transition-opacity duration-500 group-hover:opacity-100"
            />
            <div className="relative flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl glass text-cyan-300 transition-all group-hover:bg-gradient-neon group-hover:text-background">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-xl font-semibold md:text-2xl">{s.value}</div>
                <div className="text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                  {s.label}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------------- 3D Cover Flow ------------------------- */

function CoverFlow({ photos, onOpen }: { photos: Photo[]; onOpen: (p: Photo) => void }) {
  const [center, setCenter] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = photos.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setCenter((c) => (c + 1) % n), 3500);
    return () => clearInterval(t);
  }, [paused, n]);

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* stage */}
      <div
        className="relative mx-auto flex items-center justify-center"
        style={{ perspective: 1400, height: 420 }}
      >
        {photos.map((p, i) => {
          // signed offset in [-n/2, n/2)
          let off = i - center;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;

          const abs = Math.abs(off);
          const isCenter = abs < 0.5;
          const visible = abs <= 3;

          const x = off * 130;
          const z = -abs * 140;
          const rotY = off * -22;
          const scale = isCenter ? 1 : Math.max(0.55, 1 - abs * 0.14);
          const opacity = visible ? Math.max(0.25, 1 - abs * 0.22) : 0;

          return (
            <motion.button
              key={p.id}
              onClick={() => (isCenter ? onOpen(p) : setCenter(i))}
              animate={{ x, z, rotateY: rotY, scale, opacity, y: isCenter ? [-4, 4, -4] : 0 }}
              transition={{
                x: { type: "spring", stiffness: 90, damping: 20 },
                z: { type: "spring", stiffness: 90, damping: 20 },
                rotateY: { type: "spring", stiffness: 90, damping: 20 },
                scale: { type: "spring", stiffness: 120, damping: 22 },
                opacity: { duration: 0.4 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                transformStyle: "preserve-3d",
                zIndex: 100 - Math.round(abs * 10),
              }}
              className={[
                "group absolute overflow-hidden rounded-3xl border border-white/10",
                isCenter ? "shadow-[0_30px_80px_-20px_oklch(0.7_0.22_260/0.55)]" : "shadow-2xl",
              ].join(" ")}
            >
              <div className="relative h-[300px] w-[220px] md:h-[340px] md:w-[260px]">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading={isCenter ? "eager" : "lazy"}
                  className={[
                    "h-full w-full object-cover transition-transform duration-700",
                    isCenter ? "group-hover:scale-[1.06]" : "",
                  ].join(" ")}
                />
                {/* reflection strip */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent" />
                {/* frame glow */}
                <div
                  className={[
                    "pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-500",
                    isCenter
                      ? "opacity-100 ring-1 ring-inset ring-cyan-300/40"
                      : "opacity-0",
                  ].join(" ")}
                />
                {/* meta on center only */}
                {isCenter && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent p-4"
                  >
                    <div className="flex items-center gap-2 text-[10.5px] text-cyan-200">
                      <MapPin className="h-3 w-3" /> {p.location}
                      <span className="mx-1 opacity-40">·</span>
                      <Calendar className="h-3 w-3" /> {p.year}
                    </div>
                    <div className="mt-1 font-display text-sm font-semibold leading-snug">
                      {p.caption}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}

        {/* floor glow */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2 mx-auto h-8 w-[70%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,oklch(0.7_0.22_260/0.35),transparent_70%)] blur-2xl" />
      </div>

      {/* dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCenter(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={[
              "h-1.5 rounded-full transition-all",
              i === center ? "w-6 bg-gradient-neon" : "w-1.5 bg-white/20 hover:bg-white/40",
            ].join(" ")}
          />
        ))}
        <button
          onClick={() => setPaused((v) => !v)}
          className="ml-3 inline-flex items-center gap-1 rounded-full glass px-2.5 py-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-white"
        >
          {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------- Masonry ------------------------- */

function MasonryGrid({
  photos,
  onOpen,
  favs,
  onFav,
}: {
  photos: Photo[];
  onOpen: (i: number) => void;
  favs: Set<string>;
  onFav: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
      style={{ gridAutoRows: "80px", gridAutoFlow: "dense" }}
    >
      <AnimatePresence mode="popLayout">
        {photos.map((p, i) => (
          <MasonryTile
            key={p.id}
            photo={p}
            index={i}
            onOpen={() => onOpen(i)}
            fav={favs.has(p.id)}
            onFav={() => onFav(p.id)}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function MasonryTile({
  photo,
  index,
  onOpen,
  fav,
  onFav,
}: {
  photo: Photo;
  index: number;
  onOpen: () => void;
  fav: boolean;
  onFav: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-40, 40], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-40, 40], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const span = SPAN_MAP[photo.h ?? "m"];

  return (
    <motion.div
      layout
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.4), ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`group relative ${span}`}
    >
      <button
        onClick={onOpen}
        className="relative block h-full w-full overflow-hidden rounded-2xl border border-white/10 glass text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
        />

        {/* neon border on hover */}
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/0 transition-all duration-300 group-hover:ring-cyan-300/50" />

        {/* corner tag */}
        <span className="absolute left-3 top-3 rounded-full glass-strong px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-cyan-200">
          {photo.cat}
        </span>

        {/* zoom hint */}
        <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full glass-strong opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Maximize2 className="h-3 w-3" />
        </span>

        {/* overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="font-display text-sm font-semibold leading-tight">{photo.caption}</div>
          <div className="mt-1 flex items-center gap-2 text-[10.5px] text-muted-foreground">
            <MapPin className="h-3 w-3 text-cyan-300" /> {photo.location}
            <span className="mx-0.5 opacity-40">·</span>
            <Calendar className="h-3 w-3 text-cyan-300" /> {photo.date}
          </div>
        </div>
      </button>

      {/* favorite */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFav();
        }}
        aria-label="Favorite"
        className={[
          "absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full glass-strong transition-all",
          fav ? "text-red-400" : "text-white/70 hover:text-white",
        ].join(" ")}
      >
        <Heart className={`h-3.5 w-3.5 ${fav ? "fill-red-400" : ""}`} />
      </button>
    </motion.div>
  );
}

/* ------------------------- Feature Card ------------------------- */

function FeatureCard({
  icon: Icon,
  title,
  desc,
  onClick,
  soon,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  onClick?: () => void;
  soon?: boolean;
  active?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={soon ? undefined : onClick}
      disabled={soon}
      className={[
        "group relative overflow-hidden rounded-2xl p-5 text-left",
        active ? "glass-strong neon-border" : "glass hover:border-white/20",
        soon ? "cursor-not-allowed opacity-70" : "",
      ].join(" ")}
    >
      <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.22_260/0.35),transparent_70%)] blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex items-center gap-3">
        <div
          className={[
            "grid h-10 w-10 place-items-center rounded-xl transition-all",
            active
              ? "bg-gradient-neon text-background"
              : "glass text-cyan-300 group-hover:bg-gradient-neon group-hover:text-background",
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="font-display text-base font-semibold">{title}</div>
        {soon && (
          <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[9px] uppercase tracking-widest text-muted-foreground">
            Soon
          </span>
        )}
      </div>
      <p className="relative mt-2 text-xs text-muted-foreground">{desc}</p>
    </motion.button>
  );
}

/* ------------------------- Lightbox ------------------------- */

function Lightbox({
  photo,
  index,
  total,
  slideshow,
  onSlideshowToggle,
  onClose,
  onNext,
  onPrev,
  fav,
  onFav,
}: {
  photo: Photo;
  index: number;
  total: number;
  slideshow: boolean;
  onSlideshowToggle: () => void;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  fav: boolean;
  onFav: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] flex flex-col bg-background/85 backdrop-blur-xl"
    >
      {/* top bar */}
      <div
        className="flex items-center justify-between px-5 py-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="rounded-full glass-strong px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-200">
            {photo.cat}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSlideshowToggle}
            className="inline-flex items-center gap-1.5 rounded-full glass-strong px-3 py-1.5 text-[11px] hover:bg-white/10"
          >
            {slideshow ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {slideshow ? "Pause" : "Play"}
          </button>
          <button
            onClick={onFav}
            aria-label="Favorite"
            className={[
              "rounded-full glass-strong p-2 hover:bg-white/10",
              fav ? "text-red-400" : "",
            ].join(" ")}
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-red-400" : ""}`} />
          </button>
          <button
            onClick={onClose}
            className="rounded-full glass-strong p-2 hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* center */}
      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full glass-strong p-2.5 hover:bg-white/10 md:inline-flex"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <AnimatePresence mode="wait">
          <motion.figure
            key={photo.id}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) onNext();
              else if (info.offset.x > 80) onPrev();
            }}
            className="flex max-h-full cursor-grab flex-col items-center gap-4 active:cursor-grabbing"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="max-h-[68vh] max-w-[92vw] rounded-2xl border border-white/10 object-contain shadow-[0_20px_80px_-10px_oklch(0.7_0.22_260/0.45)]"
              draggable={false}
            />
            <figcaption className="max-w-xl rounded-2xl glass-strong px-5 py-3 text-center">
              <div className="flex items-center justify-center gap-3 text-[10.5px] uppercase tracking-[0.22em] text-cyan-200">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {photo.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {photo.date}
                </span>
              </div>
              <div className="mt-1 font-display text-base font-semibold">{photo.caption}</div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full glass-strong p-2.5 hover:bg-white/10 md:inline-flex"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* mobile controls */}
      <div
        className="flex items-center justify-between gap-3 px-5 pb-6 md:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onPrev}
          className="flex flex-1 items-center justify-center gap-1 rounded-full glass-strong py-2 text-xs"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <button
          onClick={onNext}
          className="flex flex-1 items-center justify-center gap-1 rounded-full glass-strong py-2 text-xs"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
