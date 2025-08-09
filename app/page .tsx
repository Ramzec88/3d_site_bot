"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Environment, Edges } from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, Search, Send, Filter, Sparkles, ThumbsUp, MessageSquare, Moon, Sun, ArrowRight, Bot, ShieldCheck, Globe2 } from "lucide-react";

/**
 * Telegram Bot Reviews – single-file React page
 * - Modern, clean UI with Tailwind
 * - 3D hero animation (react-three-fiber + drei)
 * - Usability features: search, filters, keyboard shortcuts, a11y labels
 * - shadcn/ui components, lucide-react icons
 */

// ------------------ 3D SCENE ------------------
function Bubble({ position = [0,0,0], color = "#60a5fa", scale = 1, glow = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.25;
      ref.current.rotation.y += 0.003;
      ref.current.rotation.x += 0.0015;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={ref} position={position} scale={scale} castShadow receiveShadow>
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
        <Edges threshold={5} scale={1.01} color="#e5e7eb"/>
      </mesh>
    </Float>
  );
}

function PaperPlane({ position=[0,0,0] }) {
  // Minimal geometric paper plane reminiscent of Telegram icon
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.z = Math.sin(t * 0.5) * 0.15;
      ref.current.position.y = 0.2 + Math.sin(t * 1.2) * 0.15;
    }
  });
  return (
    <group ref={ref} position={position}>
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
  const bubbles = useMemo(() => (
    [
      { pos: [-2.5, 0.2, -1.5], col: "#38bdf8", s: 1.1 },
      { pos: [ 2.0, 0.0, -1.0], col: "#a78bfa", s: 0.9 },
      { pos: [ 0.0, -0.2, -1.8], col: "#34d399", s: 0.8 },
      { pos: [-1.2, -0.4, -1.2], col: "#f472b6", s: 0.7 },
    ]
  ), []);
  return (
    <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }} className="rounded-3xl">
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow />
      <Environment preset="city" />
      <PaperPlane position={[0,0,0]} />
      {bubbles.map((b, i) => (
        <Bubble key={i} position={b.pos} color={b.col} scale={b.s} glow={1} />
      ))}
    </Canvas>
  );
}

// ------------------ UI HELPERS ------------------
function Rating({ value }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Рейтинг ${value} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < value ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
      ))}
    </div>
  );
}

const MOCK_BOTS = [
  {
    id: 1,
    title: "Tarot Whisper | Шёпот карт",
    desc: "Карта дня, быстрые расклады, подписка с премиум-спредами.",
    tags: ["Lifestyle", "AI", "Tarot"],
    lang: ["RU", "EN"],
    rating: 4,
    votes: 128,
  },
  {
    id: 2,
    title: "SongGift",
    desc: "Персональные песни по заявке. Мини‑приложение и бот.",
    tags: ["Music", "Creator"],
    lang: ["RU"],
    rating: 5,
    votes: 312,
  },
  {
    id: 3,
    title: "TravelDeal Hunter",
    desc: "Мониторинг авиабилетов и отелей. Умные уведомления.",
    tags: ["Travel", "Deals"],
    lang: ["EN"],
    rating: 4,
    votes: 98,
  },
  {
    id: 4,
    title: "Kids StoryTime",
    desc: "Сказки на ночь по имени ребёнка. Мягкий голос и звуки.",
    tags: ["Kids", "Audio"],
    lang: ["RU", "EN"],
    rating: 3,
    votes: 47,
  },
];

// ------------------ MAIN PAGE ------------------
export default function TelegramBotReviews3D() {
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [langFilter, setLangFilter] = useState("ALL");
  const [compact, setCompact] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const filtered = useMemo(() => {
    return MOCK_BOTS.filter((b) =>
      (b.title.toLowerCase().includes(query.toLowerCase()) || b.desc.toLowerCase().includes(query.toLowerCase())) &&
      (minRating === 0 || b.rating >= minRating) &&
      (langFilter === "ALL" || b.lang.includes(langFilter))
    );
  }, [query, minRating, langFilter]);

  // Keyboard: / to focus search, d to toggle dark
  const searchRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key.toLowerCase() === "d") setDark((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 dark:from-[#0b1220] dark:to-[#0b1220] text-foreground">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="font-semibold tracking-tight">BotScope</span>
            <Badge variant="secondary" className="ml-2">Beta</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <Globe2 className="h-4 w-4"/> Public directory
              <ShieldCheck className="h-4 w-4"/> Curated
            </div>
            <Switch id="darkmode" checked={dark} onCheckedChange={setDark} />
            <label htmlFor="darkmode" className="sr-only">Тёмная тема</label>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="mx-auto max-w-7xl px-4 pt-10 pb-8 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border bg-background shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span>Обзоры и рейтинги ботов Telegram</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Найди идеального бота для любых задач
          </h1>
          <p className="text-muted-foreground max-w-prose">
            Честные обзоры, живая лента отзывов и удобные фильтры. Мы заботимся о юзабилити, чтобы вы тратили меньше времени на поиск и больше — на результат.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск бота по названию или описанию… (нажмите /)"
                className="pl-10 h-11"
                aria-label="Поиск"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-2xl gap-2">
                  <Send className="h-4 w-4"/> Добавить обзор
                </Button>
              </DialogTrigger>
              <SubmitReviewDialog />
            </Dialog>
          </div>
          <div className="text-xs text-muted-foreground">Подсказки: / — фокус на поиск, D — переключить тему</div>
        </div>
        <div className="rounded-3xl border shadow-inner overflow-hidden h-[320px]">
          <HeroScene />
        </div>
      </header>

      {/* CONTROLS */}
      <section className="mx-auto max-w-7xl px-4 pb-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Filter className="h-4 w-4"/>Минимальный рейтинг</CardTitle></CardHeader>
            <CardContent>
              <div className="px-1">
                <Slider value={[minRating]} onValueChange={(v) => setMinRating(v[0])} min={0} max={5} step={1} />
                <div className="mt-2 text-sm text-muted-foreground">{minRating}+</div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-base">Язык</CardTitle></CardHeader>
            <CardContent className="flex gap-2">
              {['ALL','RU','EN'].map((l) => (
                <Toggle key={l} pressed={langFilter===l} onPressedChange={() => setLangFilter(l)} className="rounded-xl">
                  {l}
                </Toggle>
              ))}
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-base">Отображение</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Компактные карточки</div>
              <Switch checked={compact} onCheckedChange={setCompact} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* LIST */}
      <main className="mx-auto max-w-7xl px-4 pb-16">
        <Tabs defaultValue="popular">
          <TabsList className="rounded-2xl">
            <TabsTrigger value="popular">Популярные</TabsTrigger>
            <TabsTrigger value="new">Новые</TabsTrigger>
            <TabsTrigger value="ai">AI‑боты</TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="mt-6">
            <BotGrid bots={filtered} compact={compact} />
          </TabsContent>
          <TabsContent value="new" className="mt-6">
            <BotGrid bots={filtered.slice().reverse()} compact={compact} />
          </TabsContent>
          <TabsContent value="ai" className="mt-6">
            <BotGrid bots={filtered.filter(b => b.tags.includes('AI'))} compact={compact} />
          </TabsContent>
        </Tabs>
      </main>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} BotScope. Независимые обзоры ботов Telegram.</div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="rounded-xl" size="sm">
              <ArrowRight className="h-4 w-4 mr-1"/> Отправить бота на ревью
            </Button>
            <Button variant="ghost" size="sm" className="rounded-xl">
              Политика
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BotGrid({ bots, compact }) {
  if (!bots.length) return (
    <div className="text-center text-muted-foreground py-12">Ничего не найдено. Попробуйте изменить запрос или фильтры.</div>
  );
  return (
    <div className={`grid gap-4 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
      {bots.map((b) => (
        <Card key={b.id} className="rounded-2xl group hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-primary"/>
                </div>
                {b.title}
              </CardTitle>
              <Rating value={b.rating} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground min-h-10">{b.desc}</p>
            <div className="flex flex-wrap gap-2">
              {b.tags.map((t) => (
                <Badge key={t} variant="secondary" className="rounded-xl">{t}</Badge>
              ))}
              <div className="ml-auto text-xs text-muted-foreground">{b.votes} голосов</div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="rounded-xl">Читать обзор</Button>
              <Button size="sm" variant="outline" className="rounded-xl">
                <ThumbsUp className="h-4 w-4 mr-1"/> Полезно
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SubmitReviewDialog() {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(4);
  const [agree, setAgree] = useState(true);

  return (
    <DialogContent className="sm:max-w-lg rounded-3xl">
      <DialogHeader>
        <DialogTitle>Добавить обзор</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="botTitle">Название бота</label>
          <Input id="botTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например, @my_favorite_bot" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="botLink">Ссылка</label>
          <Input id="botLink" type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://t.me/..." />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="botText">Ваш опыт</label>
          <Textarea id="botText" value={text} onChange={(e) => setText(e.target.value)} placeholder="Что понравилось, что улучшить, сценарии использования…" rows={5} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Оценка</label>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Button key={i} variant={i < rating ? 'default' : 'outline'} size="icon" className="rounded-full" onClick={() => setRating(i+1)} aria-label={`Установить оценку ${i+1}`}>
                <Star className={`h-4 w-4 ${i < rating ? 'fill-current' : ''}`} />
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch id="rules" checked={agree} onCheckedChange={setAgree} />
            <label htmlFor="rules" className="text-sm">Согласен с правилами модерации</label>
          </div>
          <Button disabled={!title || !link || !text || !agree} className="rounded-xl">Отправить</Button>
        </div>
      </div>
    </DialogContent>
  );
}
