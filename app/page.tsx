
import Header from "@/components/header";
import Catalog from "@/components/catalog";
import { demoGames } from "@/lib/demo-games";
import { createClient } from "@supabase/supabase-js";
import type { Game } from "@/lib/types";

async function getGames(): Promise<Game[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error(
      "Supabase configuration is missing: check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
    return demoGames;
  }

  try {
    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase games query failed:", error.message);
      return demoGames;
    }

    return (data ?? []) as Game[];
  } catch (error) {
    console.error("Unexpected error while loading games:", error);
    return demoGames;
  }
}

export default async function Home() {
  const games = await getGames();

  return (
    <main className="min-h-screen">
      <Header />

      <section className="site-grid relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -top-36 right-[-8%] h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute top-12 left-[-6%] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-16 md:px-8 md:pb-20 md:pt-24">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            مكتبة ألعاب PlayStation
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            عالم الألعاب،
            <br />
            <span className="bg-gradient-to-l from-violet-300 via-fuchsia-300 to-cyan-200 bg-clip-text text-transparent">
              بمكان واحد.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            اكتشف ألعاب PS4 وPS5 وتصفح المكتبة بسهولة. موقع AZ OFFICE — مكتب أحمد الزاملي.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#catalog"
              className="rounded-xl bg-violet-600 px-6 py-3 font-bold shadow-lg shadow-violet-900/30 transition hover:bg-violet-500"
            >
              تصفح الألعاب <span aria-hidden>←</span>
            </a>

            <a
              href="#about"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-bold transition hover:bg-white/10"
            >
              عن المكتب
            </a>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["PS4", "مكتبة متنوعة"],
              ["PS5", "ألعاب الجيل الجديد"],
              ["AZ", "مكتب أحمد الزاملي"],
            ].map(([big, small]) => (
              <div
                key={big}
                className="rounded-2xl border border-white/10 bg-slate-950/
