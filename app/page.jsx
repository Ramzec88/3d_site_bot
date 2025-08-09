"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Edges } from "@react-three/drei";
import { Search, Bot, Sparkles, ThumbsUp } from "lucide-react";

function Bubble({ position = [0,0,0], color = "#60a5fa", scale = 1, glow = 1 }) {
  const ref = useRef<any>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = (position as any)[1] + Math.sin(t + (position as any)[0]) * 0.25;
      ref.current.rotation.y += 0.003;
      ref.current.rotation.x += 0.0015;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={ref} position={position as any} scale={scale} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          roughness={0.2}
          metalness={0.3}
          transmission={0.8}
          thickness={0.6}
          color={color}
          emissive={color}
          emissiveIntensity={0.15 * glow}
          transparent
        />
        <Edges threshold={5} scale={1.01} color="#e5e7eb" />
      </mesh>
    </Float>
  );
}

function PaperPlane({ position = [0,0,0] }) {
  const ref = useRef<any>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.z = Math.sin(t * 0.5) * 0.15;
      ref.current.position.y = 0.2 + Math.sin(t * 1.2) * 0.15;
    }
  });
  return (
    <group ref={ref} position={position as any}>
      <mesh castShadow receiveShadow>
        <coneGeometry args={[0.5, 1.6, 3]} />
        <meshStandardMaterial roughness={0.25} metalness={0.2} color="#e2e8f0" />
      </mesh>
      <mesh position={[0,0.1,-0.4]} rotation={[0,0,Math.PI]}>
        <planeGeometry args={[1.2, 0.8]} />
        <meshStandardMaterial roughness={0.25} metalness={0.1} color="#38bdf8" />
      </mesh>
    </group>
  );
}

function HeroScene() {
  const bubbles = useMemo(() => ([
    { pos: [-2.5, 0.2, -1.5], col: "#38bdf8", s: 1.1 },
    { pos: [ 2.0, 0.0, -1.0], col: "#a78bfa", s: 0.9 },
    { pos: [ 0.0, -0.2, -1.8], col: "#34d399", s: 0.8 },
    { pos: [-1.2, -0.4, -1.2], col: "#f472b6", s: 0.7 },
  ]), []);
  return (
    <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }} className="rounded-3xl">
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow />
      <Environment preset="city" />
      <PaperPlane position={[0,0,0]} />
      {bubbles.map((b, i) => (
        <Bubble key={i} position={b.pos as any} color={b.col as any} scale={b.s as any} glow={1} />
      ))}
    </Canvas>
  );
}

export default function Page() {
  const [q, setQ] = useState("");
  const [dark, setDark] = useState(true);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  const bots = [
    { id:1, title:"Tarot Whisper | Шёпот карт", desc:"Карта дня и расклады.", rating:4, votes:128, tags:["AI","Lifestyle"] },
    { id:2, title:"SongGift", desc:"Персональные песни по заявке.", rating:5, votes:312, tags:["Music"] },
    { id:3, title:"TravelDeal Hunter", desc:"Авиабилеты и отели.", rating:4, votes:98, tags:["Travel"] },
  ].filter(b => (b.title+b.desc).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#0b1220] text-white">
      <nav className="sticky top-0 z-40 backdrop-blur bg-black/20 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="font-semibold tracking-tight">BotScope</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-xl bg-white/10">Beta</span>
          </div>
          <button
            onClick={() => setDark(v=>!v)}
            className="text-xs px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/10"
          >
            Тема: {dark ? "Dark" : "Light"}
          </button>
        </div>
      </nav>

      <header className="mx-auto max-w-7xl px-4 pt-10 pb-8 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border border-white/15 bg-white/5 shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span>Обзоры и рейтинги ботов Telegram</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Найди идеального бота для любых задач
          </h1>
          <p className="text-white/70 max-w-prose">
            Честные обзоры, живая лента отзывов и удобные фильтры.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="Поиск бота…"
                className="pl-10 h-11 w-full rounded-2xl bg-white/10 border border-white/20 outline-none"
              />
            </div>
            <a
              className="inline-flex items-center justify-center h-11 px-5 rounded-2xl bg-cyan-500 text-black font-medium"
              href="#list"
            >
              Добавить обзор
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 shadow-inner overflow-hidden h-[320px]">
          <HeroScene/>
        </div>
      </header>

      <main id="list" className="mx-auto max-w-7xl px-4 pb-16 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {bots.map(b => (
          <div key={b.id} className="rounded-2xl p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition">
            <div className="text-lg font-semibold mb-1">{b.title}</div>
            <div className="text-sm text-white/70 mb-3">{b.desc}</div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-sm">Читать обзор</button>
              <button className="px-3 py-1.5 rounded-xl bg-transparent border border-white/20 text-sm inline-flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" /> Полезно
              </button>
              <div className="ml-auto text-xs text-white/60">{b.votes} голосов</div>
            </div>
          </div>
        ))}
        {!bots.length && (
          <div className="col-span-full text-center text-white/60 py-12">Ничего не найдено.</div>
        )}
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 text-white/60 text-sm">
          © {new Date().getFullYear()} BotScope
        </div>
      </footer>
    </div>
  );
}
