import React, { useMemo, useState, useEffect, useRef } from "react";

// Snack Math — Picnic Edition
// “We have N snacks. Feed M to Munchy — how many left?”
// Upgraded, more interesting interface: picnic theme, friendly monster, feed animation,
// tummy meter, optional speech, and lively equation strip.

function randInt(min, max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

// ---- Tiny audio (Web Audio API) ----
function useSfx(){
  const ctxRef = useRef(null);
  const ensure = async () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    if (ctxRef.current.state !== 'running') { try { await ctxRef.current.resume(); } catch {}
    }
    return ctxRef.current;
  };
  const blip = async (freq=500, dur=0.08) => {
    const ctx = await ensure();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.18, ctx.currentTime+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+dur);
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur+0.02);
  };
  const chomp = async () => { await blip(220,0.09); await blip(320,0.06); };
  return { blip, chomp };
}

// ---- Optional speech ----
function speak(text){
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0; u.pitch = 1.2; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
  } catch {}
}

const BigButton = ({ children, onClick, variant = "primary", disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={
      "px-6 py-4 text-lg md:text-xl rounded-2xl font-semibold shadow transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed " +
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

const Snack = ({ eaten, onTap, emoji }) => (
  <button
    onClick={onTap}
    className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl shadow 
      ${eaten ? 'bg-stone-200 opacity-40' : 'bg-white'} active:scale-95`}
    style={{ touchAction:'manipulation' }}
    aria-label={eaten ? 'eaten' : 'snack'}
  >
    <span>{emoji}</span>
  </button>
);

export default function SnackMath({ onBack }){
  const { chomp } = useSfx();
  const [level, setLevel] = useState(1);
  const [stars, setStars] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [snack, setSnack] = useState('🍇'); // 🍇 🍪 🫐 🍓 🥕

  // Problem state
  const [have, setHave] = useState(10);
  const [eat, setEat] = useState(3);
  const [items, setItems] = useState(Array(10).fill(false)); // false = not eaten

  const eatenCount = useMemo(()=> items.filter(Boolean).length, [items]);
  const remaining = useMemo(()=> have - Math.min(eatenCount, eat), [have, eatenCount, eat]);
  const success = eatenCount === eat;

  // Flight animation overlay
  const [flying, setFlying] = useState(false);

  useEffect(()=>{
    if (success) {
      setCelebrate(true);
      const t = setTimeout(()=> setCelebrate(false), 900);
      if (voiceOn) speak(`Great! ${have} minus ${eat} equals ${remaining}.`);
      return ()=> clearTimeout(t);
    }
  }, [success, voiceOn, have, eat, remaining]);

  const newProblem = () => {
    const maxHave = Math.min(15, 8 + level); // 8..15
    const nextHave = randInt(6, maxHave);
    const nextEat = randInt(1, Math.max(2, Math.min(5, nextHave-1)));
    setHave(nextHave);
    setEat(nextEat);
    setItems(Array(nextHave).fill(false));
    if (voiceOn) speak(`We have ${nextHave}. Feed Munchy ${nextEat}.`);
  };

  const nextRound = () => {
    if (!success) return;
    setStars((s)=> s+1);
    if ((stars+1)%3===0) setLevel((lv)=> lv+1);
    newProblem();
  };

  const restart = () => {
    setLevel(1); setStars(0); setSnack('🍇');
    setHave(10); setEat(3); setItems(Array(10).fill(false)); setFlying(false);
    if (voiceOn) speak('New picnic! Feed the snacks to Munchy.');
  };

  const setSnackType = (type) => { setSnack(type); };

  const eatOne = async (idx) => {
    if (items[idx]) return; // already eaten
    if (items.filter(Boolean).length >= eat) return; // reached target
    // mark eaten visually first for snappy feedback
    setItems((prev)=>{ const n=[...prev]; n[idx]=true; return n; });
    setFlying(true);
    await chomp();
    setTimeout(()=> setFlying(false), 550);
  };

  // Ensure items length matches have
  useEffect(()=>{ if (items.length !== have) setItems(Array(have).fill(false)); }, [have, items.length]);

  return (
    <div className="min-h-screen text-emerald-900 p-4 md:p-8"
      style={{
        // picnic tablecloth background
        backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.9) 24px, rgba(255,255,255,0) 25px), linear-gradient(45deg, #fde68a 25%, transparent 25%), linear-gradient(-45deg, #fcd34d 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fde68a 75%), linear-gradient(-45deg, transparent 75%, #fcd34d 75%)',
        backgroundSize: '50px 50px, 50px 50px, 50px 50px, 50px 50px, 50px 50px',
        backgroundPosition: '0 0, 0 0, 25px 0, 0 25px, 25px 25px'
      }}>

      <ConfettiBar show={celebrate} />

      {/* Header */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-white/80 text-emerald-700 border-2 border-emerald-600 font-semibold hover:bg-emerald-50 transition"
            >
              ← Back
            </button>
          )}
          <span className="text-3xl md:text-4xl">🧺</span>
          <h1 className="text-2xl md:text-3xl font-extrabold">Snack Math — Picnic Edition</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={()=> setVoiceOn(v=>!v)} className={`px-3 py-2 rounded-xl text-sm border ${voiceOn? 'bg-emerald-600 text-white border-emerald-600':'bg-white border-emerald-600 text-emerald-700'}`}>{voiceOn? '🔊 Voice On':'🔈 Voice Off'}</button>
          <div className="flex items-center gap-2">
            <Star filled={stars % 3 >= 1} />
            <Star filled={stars % 3 >= 2} />
            <Star filled={stars % 3 >= 3} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-4">
        {/* Left: Plate & equation strip */}
        <div className="md:col-span-3">
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow p-4 md:p-6">
            <div className="text-sm md:text-base opacity-70">Level {level}</div>
            <h2 className="text-xl md:text-2xl font-bold">We have <span className="text-emerald-700">{have}</span> snacks on the plate.</h2>
            <p className="mb-3 md:mb-4">Feed <strong>{eat}</strong> to <strong>Munchy</strong> the monster. How many left?</p>

            {/* Equation strip */}
            <div className="mb-3 flex items-center gap-2 text-lg md:text-xl">
              <div className="px-3 py-1 rounded-xl bg-emerald-600 text-white">{have} − {Math.min(eatenCount, eat)} = {remaining}</div>
              {success && <div className="px-3 py-1 rounded-xl bg-amber-500 text-white">Great! Tap Next ▶</div>}
            </div>

            {/* Plate */}
            <div className="relative border-4 border-amber-200 rounded-full mx-auto my-3 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center" style={{background:'radial-gradient(circle at 50% 40%, #ffffff 0%, #fef9c3 70%)'}}>
              <div className="grid grid-cols-4 gap-3">
                {items.map((eaten, i)=> (
                  <Snack key={i} eaten={eaten} onTap={()=> eatOne(i)} emoji={snack} />
                ))}
              </div>

              {/* Flying overlay snack */}
              {flying && (
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500" style={{ transform: 'translate(140px, -120px) scale(0.4)' }}>
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow flex items-center justify-center text-4xl">{snack}</div>
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              <BigButton onClick={restart} variant="ghost">Restart</BigButton>
              {success && <BigButton onClick={nextRound}>Next ▶</BigButton>}
            </div>

            <div className="mt-4">
              <div className="text-sm mb-1">Snack type</div>
              <div className="flex gap-2">
                {['🍇','🍪','🫐','🍓','🥕'].map((e)=> (
                  <button key={e} onClick={()=> setSnackType(e)} className={`text-2xl md:text-3xl rounded-xl px-3 py-2 border ${snack===e? 'border-emerald-600 bg-emerald-50':'border-stone-300 bg-white'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Munchy with tummy meter */}
        <div className="md:col-span-2">
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow p-4 md:p-6 h-full flex flex-col items-center">
            <div className="text-lg md:text-xl font-bold mb-2">Feed Munchy!</div>
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              {/* Body */}
              <div className="absolute inset-0 rounded-[40%] bg-emerald-200 border-4 border-emerald-300" />
              {/* Eyes */}
              <div className="absolute left-10 top-10 w-10 h-10 bg-white rounded-full border" />
              <div className="absolute right-10 top-10 w-10 h-10 bg-white rounded-full border" />
              {/* Mouth */}
              <div className="absolute left-1/2 -translate-x-1/2 top-24 w-28 h-16 bg-rose-300 rounded-b-3xl border-4 border-rose-400 flex items-end justify-center pb-1">😋</div>
              {/* Tummy meter */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-40 h-4 bg-white/70 rounded-full border">
                <div className="h-4 rounded-full bg-emerald-500 transition-all" style={{ width: `${(eatenCount/eat)*100}%` }} />
              </div>
            </div>
            <div className="mt-3 text-sm opacity-70">Tummy: {Math.min(eatenCount, eat)} / {eat}</div>
            <div className="mt-3 p-3 rounded-xl bg-emerald-50 text-emerald-900 text-center">Exact snacks only — when the tummy is full, you’re done!</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto mt-4 text-center text-sm opacity-70">
        Try saying it out loud: “{have} minus {Math.min(eatenCount, eat)} equals {remaining}.” 💚
      </div>
    </div>
  );
}
