"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Terminal, LogOut, User2, BarChart2, BookOpen } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/db/supabase";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ReferentielModal } from "@/components/layout/ReferentielModal";
import type { User, Session, AuthChangeEvent, UserResponse } from "@supabase/supabase-js";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const sb = getSupabaseBrowser();
        sb.auth.getUser().then(({ data: { user } }: UserResponse) => setUser(user)).catch(() => {});
        const { data: { subscription } } = sb.auth.onAuthStateChange(
          (_e: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
          }
        );
        return () => subscription?.unsubscribe();
      } catch (e) {
        // Supabase offline or unconfigured
      }
    }
  }, []);

  const avatarColor = (user?.user_metadata?.avatar_color as string | undefined) ?? "#05b9b6";
  const displayName = (user?.user_metadata?.display_name as string | undefined) ?? "Étudiant";
  const initial = (displayName || "E")[0].toUpperCase();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-slate-800 bg-[#0a0f1d]/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-emerald-400 group-hover:animate-pulse" strokeWidth={2.5} />
          </div>
          <span className="font-[family-name:var(--font-orbitron)] text-sm font-bold tracking-widest text-emerald-400">
            FMTTN<span className="text-slate-100"> ESCAPE</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="flex items-center gap-4 text-sm text-slate-300">
          {/* Quick PDF Modal button */}
          <ReferentielModal />

          <Link
            href="/game/BLOC3-FMTTN"
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <span>🚀 Jouer</span>
          </Link>

          <ThemeToggle />

          {mounted && user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(v => !v)}
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-black transition-transform hover:scale-105"
                style={{ background: avatarColor }}
              >
                {initial}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
