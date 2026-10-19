"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Gamepad2, Star, ExternalLink } from "lucide-react";
import type { Game, Platform } from "@/lib/types";

export default function Catalog({ initialGames }: { initialGames: Game[] }) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<"الكل" | Platform>("الكل");
  const [genre, setGenre] = useState("الكل");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [selected, setSelected] = useState<Game | null>(null);
  const genres = useMemo(() => ["الكل", ...Array.from(new Set(initialGames.map(g => g.genre).filter(Boolean)))], [initialGames]);
  const games = useMemo(() => initialGames.filter(g =>
    (g.title.toLowerCase().includes(query.toLowerCase()) || g.genre.toLowerCase().includes(query.toLowerCase())) &&
    (platform === "الكل" || g.platform === platform) &&
    (genre === "الكل" || g.genre === genre) &&
    (!featuredOnly || g.featured)
  ), [initialGames, query, platform, genre, featuredOnly]);

  return (
    <section id="catalog" className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><div className="text-sm font-bold text-violet-300">استكشف المكتبة</div><h2 className="mt-2 text-3xl font-black md:text-4xl">كتالوج الألعاب</h2><p className="mt-2 text-slate-400">ابحث بالاسم أو اختر المنصة والتصنيف.</p></div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"><span className="font-bold text-white">{games.length}</span> لعبة معروضة</div>
      </div>
      <div className="mt-7 grid gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:grid-cols-[1fr_auto_auto_auto]">
        <label className="relative block">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث عن لعبة..." className="w-full rounded-xl border border-white/10 bg-slate-950 px-10 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-violet-400/60" />
        </label>
        <select value={platform} onChange={e => setPlatform(e.target.value as "الكل" | Platform)} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm outline-none focus:border-violet-400/60">
          <option value="الكل">كل المنصات</option><option value="PS4">PlayStation 4</option><option value="PS5">PlayStation 5</option>
        </select>
        <select value={genre} onChange={e => setGenre(e.target.value)} className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm outline-none focus:border-violet-400/60">
          {genres.map(g => <option key={g} value={g}>{g === "الكل" ? "كل التصنيفات" : g}</option>)}
        </select>
        <button onClick={() => setFeaturedOnly(!featuredOnly)} className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${featuredOnly ? "border-violet-400 bg-violet-500/20 text-violet-200" : "border-white/10 text-slate-300 hover:bg-white/5"}`}><Star size={16} /> المميزة</button>
      </div>
      {games.length ? <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {games.map(game => <button key={game.id} onClick={() => setSelected(game)} className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 text-right transition hover:-translate-y-1 hover:border-violet-400/50 hover:shadow-xl hover:shadow-violet-950/20">
          <div className="cover-placeholder relative aspect-[3/4] overflow-hidden">
            {game.cover_url ? <img src={game.cover_url} alt={`غلاف ${game.title}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center"><Gamepad2 size={42} className="text-violet-300/80" /><span className="text-lg font-black text-white/90">{game.title}</span><span className="text-xs text-slate-400">أضف صورة الغلاف</span></div>}
            <span className="absolute right-3 top-3 rounded-lg border border-white/10 bg-black/70 px-2 py-1 text-xs font-bold">{game.platform}</span>
            {game.featured && <span className="absolute left-3 top-3 rounded-lg bg-violet-600 px-2 py-1 text-xs font-bold">مميزة</span>}
          </div>
          <div className="p-4"><h3 className="line-clamp-2 min-h-12 font-bold leading-6">{game.title}</h3><div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-400"><span>{game.genre || "غير مصنف"}</span>{game.year && <span>{game.year}</span>}</div><div className="mt-4 flex items-center gap-1 text-xs font-bold text-violet-300">التفاصيل <ExternalLink size={13} /></div></div>
        </button>)}
      </div> : <div className="mt-7 rounded-2xl border border-dashed border-white/15 p-12 text-center"><SlidersHorizontal className="mx-auto text-slate-500" size={30}/><p className="mt-3 font-bold">لا توجد نتائج مطابقة</p><p className="mt-1 text-sm text-slate-500">جرّب تغيير البحث أو الفلاتر.</p></div>}
      {selected && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={() => setSelected(null)}>
        <div onClick={e => e.stopPropagation()} className="relative grid max-h-[90vh] w-full max-w-2xl gap-0 overflow-auto rounded-3xl border border-white/15 bg-slate-950 shadow-2xl sm:grid-cols-[220px_1fr]">
          <button onClick={() => setSelected(null)} aria-label="إغلاق" className="absolute left-3 top-3 z-10 rounded-full bg-black/70 px-3 py-2 text-white">✕</button>
          <div className="cover-placeholder min-h-64">{selected.cover_url ? <img src={selected.cover_url} alt={selected.title} className="h-full w-full object-cover" /> : <div className="flex h-full min-h-64 items-center justify-center"><Gamepad2 size={54} className="text-violet-300"/></div>}</div>
          <div className="p-6 sm:p-7"><span className="rounded-lg bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-200">{selected.platform}</span><h3 className="mt-4 text-2xl font-black">{selected.title}</h3><p className="mt-2 text-sm text-slate-400">{selected.genre}{selected.year ? ` • ${selected.year}` : ""}</p><p className="mt-5 whitespace-pre-wrap leading-8 text-slate-300">{selected.description || "لا يوجد وصف مضاف لهذه اللعبة بعد."}</p><button onClick={() => setSelected(null)} className="mt-6 rounded-xl bg-violet-600 px-5 py-3 font-bold hover:bg-violet-500">إغلاق التفاصيل</button></div>
        </div>
      </div>}
    </section>
  );
}
