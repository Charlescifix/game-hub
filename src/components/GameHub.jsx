import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Flower2,
  Puzzle,
  BookOpen,
  FlaskConical,
  Palette,
  Music,
  Brain,
  Sparkles,
  Compass,
} from "lucide-react";

const COLORS = {
  math: {
    from: "from-emerald-400",
    to: "to-teal-500",
    ring: "ring-emerald-300/60",
  },
  words: {
    from: "from-fuchsia-400",
    to: "to-pink-500",
    ring: "ring-fuchsia-300/60",
  },
  logic: {
    from: "from-sky-400",
    to: "to-indigo-500",
    ring: "ring-sky-300/60",
  },
  science: {
    from: "from-amber-400",
    to: "to-orange-500",
    ring: "ring-amber-300/60",
  },
  art: {
    from: "from-rose-400",
    to: "to-orange-400",
    ring: "ring-rose-300/60",
  },
  music: {
    from: "from-blue-400",
    to: "to-cyan-500",
    ring: "ring-blue-300/60",
  },
  brain: {
    from: "from-violet-400",
    to: "to-purple-500",
    ring: "ring-violet-300/60",
  },
  explore: {
    from: "from-lime-400",
    to: "to-green-500",
    ring: "ring-lime-300/60",
  },
};

const GAMES = [
  {
    id: "number-garden",
    title: "Number Garden",
    discipline: "math",
    minAge: 5,
    maxAge: 8,
    icon: Flower2,
    description:
      "Grow flowers by solving gentle sums and counting seeds. Add, subtract, and compare!",
  },
  {
    id: "snack-math",
    title: "Snack Math",
    discipline: "math",
    minAge: 5,
    maxAge: 8,
    icon: Calculator,
    description:
      "Feed Munchy the monster and learn subtraction! Count snacks on a picnic plate.",
  },
  {
    id: "shape-sort-dash",
    title: "Shape Sort Dash",
    discipline: "logic",
    minAge: 5,
    maxAge: 9,
    icon: Puzzle,
    description:
      "Drag falling shapes into matching outlines before they hit the ground!",
  },
  {
    id: "word-whizz-pop",
    title: "Word Whizz Pop",
    discipline: "words",
    minAge: 6,
    maxAge: 9,
    icon: BookOpen,
    description:
      "Build words from jelly letters, rhyme rockets, and silly synonyms!",
  },
  {
    id: "puzzle-pebbles",
    title: "Puzzle Pebbles",
    discipline: "logic",
    minAge: 6,
    maxAge: 9,
    icon: Puzzle,
    description:
      "Sort pebbles by rules that change—learn patterns, sequences, and reasoning.",
  },
  {
    id: "lab-bubbles",
    title: "Lab Bubbles",
    discipline: "science",
    minAge: 5,
    maxAge: 9,
    icon: FlaskConical,
    description:
      "Mix colors, test float vs sink, and pop facts in a bubbly mini‑lab!",
  },
  {
    id: "melody-marshmallows",
    title: "Melody Marshmallows",
    discipline: "music",
    minAge: 5,
    maxAge: 9,
    icon: Music,
    description:
      "Tap soft marshmallows to learn rhythm, pitch, and make tiny tunes.",
  },
  {
    id: "creative-clouds",
    title: "Creative Clouds",
    discipline: "art",
    minAge: 5,
    maxAge: 9,
    icon: Palette,
    description:
      "Paint with drip‑free jelly brushes and stamp shapes to tell mini stories.",
  },
  {
    id: "brain-bridges",
    title: "Brain Bridges",
    discipline: "brain",
    minAge: 7,
    maxAge: 9,
    icon: Brain,
    description:
      "Cross rivers by planning steps ahead—executive function and strategy!",
  },
  {
    id: "sum-slides",
    title: "Sum Slides",
    discipline: "math",
    minAge: 7,
    maxAge: 9,
    icon: Calculator,
    description:
      "Slide tiles to make target numbers—practice facts and mental math.",
  },
  {
    id: "curious-creatures",
    title: "Curious Creatures",
    discipline: "explore",
    minAge: 5,
    maxAge: 9,
    icon: Sparkles,
    description:
      "Mini quests about animals, habitats, and planet care with gentle reading.",
  },
];

function JellyTile({ game, onOpen }) {
  const Icon = game.icon;
  const theme = COLORS[game.discipline] ?? COLORS.explore;

  return (
    <motion.button
      onClick={() => onOpen(game.id)}
      whileHover={{ scale: 1.04, rotate: 0.25 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative w-full overflow-hidden rounded-3xl p-4 text-left shadow-xl ring-4 ${theme.ring} transition-shadow focus:outline-none focus-visible:ring-8`}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
      aria-label={`${game.title} — ${game.description}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${theme.from} ${theme.to} opacity-90`}
      />
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
      <div className="relative flex items-start gap-4">
        <div className="shrink-0 rounded-2xl bg-white/80 p-3 shadow-md backdrop-blur">
          <Icon className="h-8 w-8 text-black/70" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-xl font-extrabold text-white drop-shadow-sm">
            {game.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-white/90">
            {game.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black/70 shadow">
              Ages {game.minAge}–{game.maxAge}
            </span>
            <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white/95">
              {game.discipline.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-black/70 shadow-sm">
        Tap to Play
      </div>
    </motion.button>
  );
}

export default function GameHub({ onOpenGame, routes = {} }) {
  const [age, setAge] = useState(7);
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState("all");

  const handleOpenGame = (id) => {
    const url = routes[id];
    if (url) {
      window.location.href = url;
      return;
    }
    if (onOpenGame) {
      onOpenGame(id);
    } else {
      console.log(`Opening game: ${id}`);
    }
  };

  const filteredGames = useMemo(() => {
    return GAMES.filter(
      (g) =>
        g.minAge <= age &&
        g.maxAge >= age &&
        (discipline === "all" || g.discipline === discipline) &&
        (g.title.toLowerCase().includes(query.toLowerCase()) ||
          g.description.toLowerCase().includes(query.toLowerCase()))
    );
  }, [age, query, discipline]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-50 via-white to-rose-50 p-4 sm:p-6">
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-64 w-64 rounded-full bg-fuchsia-300/40 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10%] top-10 h-72 w-72 rounded-full bg-emerald-300/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-300/40 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
          className="relative mb-6 overflow-hidden rounded-3xl bg-white/70 p-5 shadow-2xl backdrop-blur-md ring-1 ring-black/5"
        >
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-rose-400 to-orange-400 p-2 shadow-lg">
                <Flower2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800">
                  Jelly Learning Arcade
                </h1>
                <p className="text-sm font-medium text-slate-600">
                  Bright, squishy games for ages 5–9
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-3">
              <label className="flex items-center gap-3 rounded-2xl bg-white/80 p-2 pl-3 shadow-inner ring-1 ring-black/5">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
                  Age: {age}
                </span>
                <input
                  aria-label="Age filter"
                  type="range"
                  min={5}
                  max={9}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10))}
                  className="h-2 w-40 cursor-pointer appearance-none rounded-full bg-gradient-to-r from-emerald-300 to-sky-300 outline-none"
                />
              </label>

              <div className="flex items-center gap-2 rounded-2xl bg-white/80 p-2 shadow-inner ring-1 ring-black/5">
                <span className="sr-only">Discipline</span>
                <select
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className="w-full rounded-xl bg-transparent px-2 py-1 text-sm font-semibold text-slate-700 outline-none"
                >
                  <option value="all">All Subjects</option>
                  <option value="math">Math</option>
                  <option value="words">Words</option>
                  <option value="logic">Logic</option>
                  <option value="science">Science</option>
                  <option value="art">Art</option>
                  <option value="music">Music</option>
                  <option value="brain">Brain</option>
                  <option value="explore">Explore</option>
                </select>
              </div>

              <label className="flex items-center gap-2 rounded-2xl bg-white/80 p-2 shadow-inner ring-1 ring-black/5">
                <span className="sr-only">Search games</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search games…"
                  className="w-full rounded-xl bg-transparent px-2 py-1 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                />
              </label>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredGames.map((g) => (
            <JellyTile key={g.id} game={g} onOpen={handleOpenGame} />
          ))}
        </motion.div>

        {filteredGames.length === 0 && (
          <div className="mt-8 rounded-3xl bg-white/70 p-8 text-center shadow-xl backdrop-blur ring-1 ring-black/5">
            <p className="text-lg font-semibold text-slate-700">
              No games match your filters.
            </p>
            <p className="text-sm text-slate-500">
              Try a different age or subject.
            </p>
          </div>
        )}

        <div className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-sm font-medium text-slate-600">
            Tip: Grown‑ups can map each tile to a game URL via the{" "}
            <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">
              routes
            </code>{" "}
            prop or handle clicks with{" "}
            <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">
              onOpenGame
            </code>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
