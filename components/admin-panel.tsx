"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Game, Platform } from "@/lib/types";
import { ArrowRight, ImagePlus, LogIn, LogOut, Plus, Save, Trash2 } from "lucide-react";

const emptyForm = { title: "", platform: "PS4" as Platform, genre: "أكشن", year: "", cover_url: "", description: "", featured: false };

export default function AdminPanel() {
  const [configured, setConfigured] = useState(true);
  const [session, setSession] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data }) => {
        setSession(Boolean(data.session));
        if (data.session) loadGames();
      });
      const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(Boolean(newSession));
        if (newSession) loadGames();
      });
      return () => listener.subscription.unsubscribe();
    } catch { setConfigured(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadGames() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("games").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setGames((data || []) as Game[]);
    } catch (e) { setNotice(e instanceof Error ? e.message : "تعذر تحميل الألعاب."); }
  }

  async function signIn(e: FormEvent) {
    e.preventDefault(); setBusy(true); setNotice("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setNotice("تم تسجيل الدخول.");
    } catch (e) { setNotice(e instanceof Error ? e.message : "تعذر تسجيل الدخول."); }
    finally { setBusy(false); }
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut(); setSession(false); setGames([]); setNotice("تم تسجيل الخروج.");
  }

  async function saveGame(e: FormEvent) {
    e.preventDefault(); setBusy(true); setNotice("");
    try {
      const supabase = createClient();
      const payload = {
        title: form.title.trim(), platform: form.platform, genre: form.genre.trim(),
        year: form.year ? Number(form.year) : null, cover_url: form.cover_url.trim(),
        description: form.description.trim(), featured: form.featured
      };
      if (!payload.title) throw new Error("اكتب اسم اللعبة.");
      const result = editingId
        ? await supabase.from("games").update(payload).eq("id", editingId)
        : await supabase.from("games").insert(payload);
      if (result.error) throw result.error;
      setForm(emptyForm); setEditingId(null); setNotice("تم حفظ اللعبة."); await loadGames();
    } catch (e) { setNotice(e instanceof Error ? e.message : "تعذر حفظ اللعبة."); }
    finally { setBusy(false); }
  }

  function editGame(game: Game) {
    setEditingId(game.id);
    setForm({ title: game.title, platform: game.platform, genre: game.genre || "", year: game.year ? String(game.year) : "", cover_url: game.cover_url || "", description: game.description || "", featured: game.featured });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteGame(id: string) {
    if (!window.confirm("هل تريد حذف هذه اللعبة نهائياً؟")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("games").delete().eq("id", id);
      if (error) throw error;
      setNotice("تم حذف اللعبة."); await loadGames();
    } catch (e) { setNotice(e instanceof Error ? e.message : "تعذر حذف اللعبة."); }
  }

  return <main className="min-h-screen bg-[#090b12] px-4 py-8 text-white md:px-8">
    <div className="mx-auto max-w-5xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowRight size={16}/> العودة للموقع</Link>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-bold text-violet-300">AZ OFFICE</p><h1 className="mt-1 text-3xl font-black">لوحة إدارة الألعاب</h1><p className="mt-2 text-sm text-slate-400">أضف الألعاب وعدّل بياناتها وصور أغلفتها.</p></div>{session && <button onClick={signOut} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm"><LogOut size={16}/> تسجيل الخروج</button>}</div>
      {notice && <div role="status" className="mt-5 rounded-xl border border-violet-400/20 bg-violet-500/10 p-3 text-sm text-violet-100">{notice}</div>}
      {!configured ? <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6"><h2 className="font-bold">أكمل إعداد قاعدة البيانات</h2><p className="mt-2 text-sm leading-7 text-slate-300">انسخ ملف .env.example إلى .env.local وأدخل رابط ومفتاح Supabase، ثم أعد تشغيل الموقع. راجع README_AR.md للتعليمات.</p></div>
      : !session ? <form onSubmit={signIn} className="mt-8 max-w-lg space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6"><div><h2 className="text-xl font-bold">تسجيل دخول المسؤول</h2><p className="mt-2 text-sm leading-7 text-slate-400">أنشئ مستخدم المسؤول من لوحة Supabase أولاً. لا يوجد حساب افتراضي.</p></div><label className="block text-sm">البريد الإلكتروني<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-violet-400" /></label><label className="block text-sm">كلمة المرور<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-violet-400" /></label><button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-bold disabled:opacity-50"><LogIn size={17}/>{busy ? "جارٍ الدخول..." : "تسجيل الدخول"}</button></form>
      : <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form onSubmit={saveGame} className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 md:p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold">{editingId ? <Save size={20}/> : <Plus size={20}/>} {editingId ? "تعديل لعبة" : "إضافة لعبة جديدة"}</h2>
          <label className="block text-sm">اسم اللعبة<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-violet-400"/></label>
          <div className="grid grid-cols-2 gap-3"><label className="block text-sm">المنصة<select value={form.platform} onChange={e=>setForm({...form,platform:e.target.value as Platform})} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3"><option>PS4</option><option>PS5</option></select></label><label className="block text-sm">سنة الإصدار<input type="number" min="1970" max="2100" value={form.year} onChange={e=>setForm({...form,year:e.target.value})} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none"/></label></div>
          <label className="block text-sm">التصنيف<input value={form.genre} onChange={e=>setForm({...form,genre:e.target.value})} placeholder="أكشن، رياضة، سباقات..." className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none"/></label>
          <label className="block text-sm"><span className="inline-flex items-center gap-2"><ImagePlus size={16}/> رابط صورة الغلاف</span><input value={form.cover_url} onChange={e=>setForm({...form,cover_url:e.target.value})} placeholder="https://..." className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-violet-400"/><span className="mt-1 block text-xs text-slate-500">ارفع الصورة إلى استضافة صور أو Supabase Storage ثم الصق الرابط العام هنا.</span></label>
          <label className="block text-sm">الوصف<textarea rows={4} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-violet-400"/></label>
          <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} className="h-4 w-4 accent-violet-500"/> إظهارها ضمن الألعاب المميزة</label>
          <div className="flex flex-wrap gap-3"><button disabled={busy} className="rounded-xl bg-violet-600 px-5 py-3 font-bold disabled:opacity-50">{busy ? "جارٍ الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة اللعبة"}</button>{editingId && <button type="button" onClick={()=>{setEditingId(null);setForm(emptyForm)}} className="rounded-xl border border-white/15 px-5 py-3">إلغاء</button>}</div>
        </form>
        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 md:p-6"><h2 className="text-xl font-bold">الألعاب الموجودة ({games.length})</h2><div className="mt-4 space-y-3">{games.map(g=><div key={g.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/70 p-3"><div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-800">{g.cover_url && <img src={g.cover_url} alt="" className="h-full w-full object-cover"/>}</div><div className="min-w-0 flex-1"><div className="truncate font-bold">{g.title}</div><div className="mt-1 text-xs text-slate-400">{g.platform} • {g.genre}</div></div><button aria-label={`تعديل ${g.title}`} onClick={()=>editGame(g)} className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5">تعديل</button><button aria-label={`حذف ${g.title}`} onClick={()=>deleteGame(g.id)} className="rounded-lg border border-red-400/20 px-3 py-2 text-red-300 hover:bg-red-500/10"><Trash2 size={15}/></button></div>)}{games.length===0 && <p className="py-10 text-center text-sm text-slate-500">لم تضف أي لعبة بعد.</p>}</div></section>
      </div>}
    </div>
  </main>;
}
