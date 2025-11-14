import React, { useEffect, useMemo, useRef, useState } from "react";

// Shape Sort Dash — Drag falling shapes into matching outlines before they hit the ground.
// Core: collision + drag/drop. Skill: visual discrimination, motor speed.
// iPad-friendly: fat targets, pointer/touch support, no external libs.

function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }
function choice(arr){ return arr[randInt(0, arr.length-1)]; }

const SHAPES = ["circle", "square", "triangle", "star"];
const COLORS = {
  circle: "#60a5fa", // blue
  square: "#f59e0b", // amber
  triangle: "#10b981", // emerald
  star: "#f472b6", // pink
};

const BigButton = ({ children, onClick, variant = "primary", disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={
      "px-6 py-3 text-base md:text-lg rounded-2xl font-semibold shadow transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed " +
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
          <div key={i} className="h-2 rounded" style={{
            background: i%3===0?"#f59e0b": i%3===1?"#10b981":"#60a5fa",
            opacity: 0.8, transform:`rotate(${(i%5)*6}deg)` }} />
        ))}
      </div>
    </div>
  );
};

const Star = ({ filled }) => (
  <span className={"text-2xl md:text-3xl " + (filled ? "opacity-100" : "opacity-30")}>⭐</span>
);

// SVG for shapes
function ShapeSVG({ type, size = 64, color = "#999", outline=false }){
  const s = size;
  const stroke = outline ? color : "none";
  const fill = outline ? "none" : color;
  if (type === "circle") return (
    <svg width={s} height={s}>
      <circle cx={s/2} cy={s/2} r={s*0.42} fill={fill} stroke={stroke} strokeWidth={6} />
    </svg>
  );
  if (type === "square") return (
    <svg width={s} height={s}>
      <rect x={s*0.15} y={s*0.15} width={s*0.7} height={s*0.7} rx={12} fill={fill} stroke={stroke} strokeWidth={6} />
    </svg>
  );
  if (type === "triangle"){
    const p = `${s/2},${s*0.12} ${s*0.14},${s*0.82} ${s*0.86},${s*0.82}`;
    return (
      <svg width={s} height={s}>
        <polygon points={p} fill={fill} stroke={stroke} strokeWidth={6} />
      </svg>
    );
  }
  // star
  const points = [];
  const cx=s/2, cy=s/2, outer=s*0.42, inner=s*0.18;
  for(let i=0;i<10;i++){
    const a = Math.PI/2 + i*(Math.PI/5);
    const r = i%2===0? outer: inner;
    points.push(`${cx + r*Math.cos(a)},${cy - r*Math.sin(a)}`);
  }
  return (
    <svg width={s} height={s}>
      <polygon points={points.join(" ")} fill={fill} stroke={stroke} strokeWidth={6} />
    </svg>
  );
}

export default function ShapeSortDash({ onBack }){
  const [level, setLevel] = useState(1);
  const [stars, setStars] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [paused, setPaused] = useState(false);
  const [confetti, setConfetti] = useState(false);

  // Container ref to compute bounds
  const arenaRef = useRef(null);

  // Falling shapes
  const [pieces, setPieces] = useState([]);
  const dragRef = useRef({ id:null, offsetX:0, offsetY:0 });
  const idCounter = useRef(1);

  // Slots (bottom outlines)
  const slotRefs = useRef({}); // type -> element
  const slots = useMemo(()=>{
    const base = SHAPES.map((t)=> ({ type:t }));
    // For higher levels, duplicate some slots
    if (level >= 4) base.push({type: choice(SHAPES)});
    if (level >= 6) base.push({type: choice(SHAPES)});
    return base;
  }, [level]);

  // Spawn logic
  const spawnDelay = Math.max(700 - level*60, 280); // ms between spawns
  const speed = 0.06 + level*0.01; // px per ms
  const lastSpawnRef = useRef(0);
  const lastFrameRef = useRef(performance.now());

  // Game loop
  useEffect(()=>{
    let raf;
    const tick = (now)=>{
      const arena = arenaRef.current;
      if (!arena) { raf = requestAnimationFrame(tick); return; }
      const dt = now - lastFrameRef.current; // ms
      lastFrameRef.current = now;
      if (!paused){
        // spawn
        if (now - lastSpawnRef.current > spawnDelay){
          lastSpawnRef.current = now;
          setPieces((prev)=>{
            const w = arena.clientWidth; const s = 72; // shape size
            const x = randInt(10, Math.max(10, w - s - 10));
            const type = choice(SHAPES);
            return [...prev, { id: idCounter.current++, type, x, y: -80, vy: speed }];
          });
        }
        // gravity
        setPieces((prev)=> prev.map((p)=>{
          if (dragRef.current.id === p.id) return p; // dragging: position set elsewhere
          return { ...p, y: p.y + p.vy*dt };
        }));
        // check ground
        const groundY = arena.clientHeight - 16; // bottom padding
        setPieces((prev)=>{
          const stay=[];
          let lost=0;
          for (const p of prev){
            if (p.y + 72 >= groundY){ lost++; } else { stay.push(p); }
          }
          if (lost>0){ setLives((L)=> Math.max(0, L-lost)); }
          return stay;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return ()=> cancelAnimationFrame(raf);
  }, [paused, spawnDelay, speed]);

  // Handle game over
  useEffect(()=>{
    if (lives<=0){ setPaused(true); }
  }, [lives]);

  // Drag handlers (pointer)
  const onPointerDown = (e, id)=>{
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = { id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
  };
  const onPointerMove = (e, id)=>{
    if (dragRef.current.id !== id) return;
    const arena = arenaRef.current; if (!arena) return;
    const aRect = arena.getBoundingClientRect();
    const x = e.clientX - aRect.left - dragRef.current.offsetX;
    const y = e.clientY - aRect.top - dragRef.current.offsetY;
    setPieces((prev)=> prev.map((p)=> p.id===id ? { ...p, x, y } : p));
  };
  const onPointerUp = (e, id)=>{
    if (dragRef.current.id !== id) return;
    dragRef.current = { id:null, offsetX:0, offsetY:0 };
    // drop: check collision with matching slot
    const match = hitMatchingSlot(id);
    if (match){
      setPieces((prev)=> prev.filter((p)=> p.id!==id));
      setScore((s)=> s+1);
      setStars((s)=> s+1);
      if ((stars+1)%5===0){ setLevel((lv)=> lv+1); setConfetti(true); setTimeout(()=> setConfetti(false), 800); }
    }
  };

  // Collision with matching slot outline
  const hitMatchingSlot = (id)=>{
    const arena = arenaRef.current; if (!arena) return false;
    const aRect = arena.getBoundingClientRect();
    const piece = pieces.find((p)=> p.id===id); if (!piece) return false;
    const pRect = { left: piece.x, top: piece.y, right: piece.x+72, bottom: piece.y+72 };
    const slotEl = slotRefs.current[piece.type]; if (!slotEl) return false;
    const sRectDom = slotEl.getBoundingClientRect();
    const sRect = { left: sRectDom.left - aRect.left, top: sRectDom.top - aRect.top, right: sRectDom.right - aRect.left, bottom: sRectDom.bottom - aRect.top };
    const overlap = !(pRect.right < sRect.left || pRect.left > sRect.right || pRect.bottom < sRect.top || pRect.top > sRect.bottom);
    return overlap;
  };

  const restart = ()=>{
    setLevel(1); setStars(0); setScore(0); setLives(3); setPieces([]); setPaused(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50 text-stone-900 p-4 md:p-8">
      <ConfettiBar show={confetti} />

      {/* Header */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-3 md:mb-5">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-white shadow text-emerald-700 border-2 border-emerald-600 font-semibold hover:bg-emerald-50 transition"
            >
              ← Back
            </button>
          )}
          <span className="text-3xl md:text-4xl">🧩</span>
          <h1 className="text-2xl md:text-3xl font-extrabold">Shape Sort Dash</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-xl bg-white shadow">Score: <b>{score}</b></div>
          <div className="px-3 py-1 rounded-xl bg-white shadow">Level: <b>{level}</b></div>
          <div className="px-3 py-1 rounded-xl bg-white shadow">Lives: {"❤️".repeat(lives)}</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-4">
        {/* Arena */}
        <div className="md:col-span-3">
          <div ref={arenaRef} className="relative h-[540px] md:h-[620px] bg-white rounded-3xl shadow overflow-hidden">
            {/* falling pieces */}
            {pieces.map((p)=> (
              <div key={p.id}
                className="absolute touch-none"
                style={{ left: p.x, top: p.y, width: 72, height: 72 }}
                onPointerDown={(e)=> onPointerDown(e, p.id)}
                onPointerMove={(e)=> onPointerMove(e, p.id)}
                onPointerUp={(e)=> onPointerUp(e, p.id)}
              >
                <ShapeSVG type={p.type} size={72} color={COLORS[p.type]} />
              </div>
            ))}

            {/* ground */}
            <div className="absolute inset-x-0 bottom-0 h-4 bg-indigo-100" />
          </div>
          <div className="mt-3 flex gap-3">
            <BigButton onClick={()=> setPaused((v)=> !v)} variant="ghost">{paused? 'Resume' : 'Pause'}</BigButton>
            <BigButton onClick={restart}>Restart</BigButton>
          </div>
        </div>

        {/* Slots & tips */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl shadow p-4 md:p-6 h-full flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Match these outlines</h2>
            <div className="grid grid-cols-2 gap-3">
              {slots.map((s, i)=> (
                <div key={i} className="flex items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 py-2">
                  <div ref={(el)=> { if (el) slotRefs.current[s.type] = el; }}>
                    <ShapeSVG type={s.type} size={80} color={COLORS[s.type]} outline={true} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-indigo-50 text-indigo-900 text-sm">
              Drag a falling shape into the matching outline. Shapes speed up as you level up. Miss three and the game pauses.
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto mt-4 text-center text-sm opacity-70">
        Tip: Encourage naming shapes out loud while playing (circle, square, triangle, star). 💫
      </div>
    </div>
  );
}
