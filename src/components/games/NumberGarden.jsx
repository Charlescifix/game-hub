import React, { useMemo, useState, useEffect } from "react";

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Hole = ({ filled, onTap }) => {
  return (
    <button
      onClick={onTap}
      className={`w-16 h-16 md:w-20 md:h-20 rounded-full m-2 flex items-center justify-center shadow-sm transition active:scale-95 ${
        filled ? "bg-amber-500" : "bg-emerald-200"
      }`}
      style={{ touchAction: "manipulation" }}
      aria-label={filled ? "Seed planted" : "Empty hole"}
    >
      {filled ? (
        <span className="text-2xl">🌱</span>
      ) : (
        <span className="text-xl opacity-70">⬤</span>
      )}
    </button>
  );
};

const BigButton = ({ children, onClick, variant = "primary" }) => (
  <button
    onClick={onClick}
    className={
      "px-6 py-4 text-lg md:text-xl rounded-2xl font-semibold shadow transition active:scale-95 " +
      (variant === "primary"
        ? "bg-emerald-600 text-white"
        : variant === "ghost"
        ? "bg-transparent border-2 border-emerald-600 text-emerald-700"
        : "bg-amber-500 text-white")
    }
    style={{ touchAction: "manipulation" }}
  >
    {children}
  </button>
);

const ConfettiBar = ({ show }) => {
  if (!show) return null;
  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none">
      <div className="mx-auto mt-2 w-11/12 grid grid-cols-12 gap-1">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="h-2 rounded"
            style={{
              background:
                i % 3 === 0
                  ? "#f59e0b"
                  : i % 3 === 1
                  ? "#10b981"
                  : "#60a5fa",
              opacity: 0.8,
              transform: `rotate(${(i % 5) * 6}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Star = ({ filled }) => (
  <span
    className={
      "text-2xl md:text-3xl " + (filled ? "opacity-100" : "opacity-30")
    }
  >
    ⭐
  </span>
);

const GardenGrid = ({ holes, onTapHole }) => {
  return (
    <div className="grid grid-cols-4 gap-2 justify-items-center">
      {holes.map((filled, idx) => (
        <Hole key={idx} filled={filled} onTap={() => onTapHole(idx)} />
      ))}
    </div>
  );
};

export default function NumberGarden({ onBack }) {
  const [mode, setMode] = useState("count");
  const [level, setLevel] = useState(1);
  const [stars, setStars] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  const gridSize = 12;
  const [holes, setHoles] = useState(Array(gridSize).fill(false));
  const [target, setTarget] = useState(randInt(2, 9));

  const [a, setA] = useState(randInt(1, 5));
  const [b, setB] = useState(randInt(1, 5));
  const [potLeft, setPotLeft] = useState(0);
  const [potRight, setPotRight] = useState(0);

  const resetCounting = (nextTarget) => {
    setHoles(Array(gridSize).fill(false));
    setTarget(nextTarget ?? randInt(2, 9));
  };

  const resetAddition = (nextA, nextB) => {
    setPotLeft(0);
    setPotRight(0);
    setA(nextA ?? randInt(1, 5));
    setB(nextB ?? randInt(1, 5));
  };

  const plantedCount = useMemo(() => holes.filter(Boolean).length, [holes]);

  useEffect(() => {
    if (mode === "count" && plantedCount === target) {
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 900);
      return () => clearTimeout(t);
    }
  }, [mode, plantedCount, target]);

  const handleTapHole = (idx) => {
    setHoles((prev) => {
      const next = [...prev];
      const currentCount = prev.filter(Boolean).length;
      if (!prev[idx] && currentCount >= target) return prev;
      next[idx] = !prev[idx];
      return next;
    });
  };

  const countingDone = mode === "count" && plantedCount === target;
  const additionDone = mode === "add" && potLeft === a && potRight === b;

  const goNext = () => {
    if (mode === "count" && countingDone) {
      setMode("add");
      resetAddition();
    } else if (mode === "add" && additionDone) {
      setStars((s) => Math.min(3, s + 1));
      setLevel((lv) => lv + 1);
      setMode("count");
      const nextTarget = Math.min(10, randInt(2, 6) + Math.floor(level / 2));
      resetCounting(nextTarget);
    }
  };

  const restart = () => {
    setLevel(1);
    setStars(0);
    setMode("count");
    resetCounting(randInt(2, 9));
    resetAddition(randInt(1, 5), randInt(1, 5));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 text-emerald-900 p-4 md:p-8">
      <ConfettiBar show={celebrate || additionDone} />

      <div className="max-w-4xl mx-auto flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="text-emerald-700 hover:text-emerald-900 transition"
              aria-label="Back to game hub"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
          )}
          <span className="text-3xl md:text-4xl">🌼</span>
          <h1 className="text-2xl md:text-3xl font-extrabold">Number Garden</h1>
        </div>
        <div className="flex items-center gap-2">
          <Star filled={stars >= 1} />
          <Star filled={stars >= 2} />
          <Star filled={stars >= 3} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow p-4 md:p-6">
            <div className="text-sm md:text-base opacity-70">Level {level}</div>
            {mode === "count" ? (
              <>
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  Plant <span className="text-emerald-700">{target}</span> seeds
                </h2>
                <p className="mb-3 md:mb-4 text-emerald-800">
                  Tap the garden holes to plant seeds. When you have {target},
                  press Next!
                </p>
                <div className="flex items-center gap-2 mb-2 text-lg">
                  <span>Planted:</span>
                  <span className="font-bold">{plantedCount}</span>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  Make the numbers
                </h2>
                <p className="mb-3 md:mb-4 text-emerald-800">
                  Fill the left pot with <strong>{a}</strong> seeds and the
                  right pot with <strong>{b}</strong> seeds.
                </p>
                <div className="flex items-center gap-3 text-lg">
                  <div className="bg-emerald-600 text-white rounded-xl px-3 py-1">
                    {a} + {b}
                  </div>
                  <div>=</div>
                  <div className="bg-amber-500 text-white rounded-xl px-3 py-1">
                    {a + b}
                  </div>
                </div>
              </>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <BigButton onClick={restart} variant="ghost">
                Restart
              </BigButton>
              {((mode === "count" && countingDone) ||
                (mode === "add" && additionDone)) && (
                <BigButton onClick={goNext}>Next ▶</BigButton>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl shadow p-4 md:p-6">
            {mode === "count" ? (
              <div className="flex flex-col items-center">
                <GardenGrid holes={holes} onTapHole={handleTapHole} />
                <div className="mt-4 text-lg md:text-xl">
                  Tap to plant exactly <strong>{target}</strong> 🌱
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:gap-8 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center">
                    <div className="text-4xl md:text-5xl">
                      {"🌱".repeat(Math.min(potLeft, 8))}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3">
                    <BigButton
                      onClick={() => setPotLeft((x) => Math.min(x + 1, 10))}
                    >
                      + 1
                    </BigButton>
                    <BigButton
                      variant="ghost"
                      onClick={() => setPotLeft((x) => Math.max(x - 1, 0))}
                    >
                      − 1
                    </BigButton>
                  </div>
                  <div className="mt-2 text-lg">
                    Seeds: <strong>{potLeft}</strong> / {a}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center">
                    <div className="text-4xl md:text-5xl">
                      {"🌱".repeat(Math.min(potRight, 8))}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3">
                    <BigButton
                      onClick={() => setPotRight((x) => Math.min(x + 1, 10))}
                    >
                      + 1
                    </BigButton>
                    <BigButton
                      variant="ghost"
                      onClick={() => setPotRight((x) => Math.max(x - 1, 0))}
                    >
                      − 1
                    </BigButton>
                  </div>
                  <div className="mt-2 text-lg">
                    Seeds: <strong>{potRight}</strong> / {b}
                  </div>
                </div>

                <div className="col-span-2 mt-2 flex justify-center">
                  {additionDone ? (
                    <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-lg md:text-xl">
                      Great job! Tap Next ▶
                    </div>
                  ) : (
                    <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800">
                      Match the numbers to continue.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-4 text-center text-sm opacity-70">
        Tip: Short sessions are best. Celebrate success; no penalties for
        trying! 💚
      </div>
    </div>
  );
}