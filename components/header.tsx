import { Gamepad2, Search, ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-700 shadow-lg shadow-violet-950/40"><Gamepad2 size={24} /></div>
          <div><div className="font-black tracking-wide">AZ OFFICE</div><div className="mt-0.5 text-xs text-slate-400">مكتب أحمد الزاملي</div></div>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a className="transition hover:text-white" href="#catalog">الألعاب</a>
          <a className="transition hover:text-white" href="#about">عن المكتب</a>
        </nav>
        <a href="/admin" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm transition hover:border-violet-400/50 hover:bg-violet-400/10">
          <ShieldCheck size={16} /><span className="hidden sm:inline">لوحة الإدارة</span><span className="sm:hidden">الإدارة</span>
        </a>
      </div>
    </header>
  );
}
