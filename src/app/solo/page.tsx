"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { AGENT_CONFIGS } from "@/lib/ai/personalities";
import { ReferentielModal } from "@/components/layout/ReferentielModal";
import type { AgentPersonality } from "@/types";
import { ChevronRight, Rocket, Shield, Timer, Sparkles, BookOpen } from "lucide-react";

const AGENT_LIST = Object.entries(AGENT_CONFIGS) as [AgentPersonality, (typeof AGENT_CONFIGS)[AgentPersonality]][];

export default function SoloPage() {
  const router = useRouter();

  const [userName, setUserName] = useState<string>("Cadet Enseignant");
  const [selectedAgent, setSelectedAgent] = useState<AgentPersonality>("supportive");
  const [starting, setStarting] = useState(false);

  function startMission() {
    setStarting(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("fmttn_player_name", userName);
    }
    const code = "ARCHE-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    router.push(`/game/${code}?name=${encodeURIComponent(userName)}`);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto text-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4 animate-pulse">
            <Timer className="w-3.5 h-3.5" />
            <span>SAUVETAGE INTERGALACTIQUE STELLA — 30 MINUTES CHRONO</span>
          </div>
          <h1 className="font-[family-name:var(--font-orbitron)] text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">
            L'ARCHE FMTTN : SAUVEZ LA MISSION
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            À bord du vaisseau intergalactique en route pour découvrir et coloniser de nouvelles planètes habitables, une avarie majeure menace les 1 450 passagers colons. Seules les compétences et concepts du référentiel FMTTN permettront de réparer manuellement les 5 secteurs critiques et d'amener l'Arche à bon port !
          </p>
        </div>

        {/* Mission Briefing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Temps Imparti</div>
              <div className="text-sm font-black text-white">30:00 Chrono</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Épreuves Didactiques</div>
              <div className="text-sm font-black text-white">5 Situations de Classe</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Référentiel FWB</div>
              <div className="text-sm font-black text-white">103 Pages Embarquées</div>
            </div>
          </div>
        </div>

        {/* 1. Nom du Cadet */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 mb-6 space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
            Identifiant du Cadet (Votre Nom ou Pseudo)
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            placeholder="Ex : Jérôme, Hélène, Cadet M1..."
          />
          <p className="text-xs text-slate-400">
            Ce matricule apparaîtra sur les registres radio du vaisseau et sur votre certificat d'évacuation final.
          </p>
        </div>

        {/* 2. Choix de l'IA Coéquipière */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span>Coéquipier IA d'Assistance Radio</span>
            </h2>
            <ReferentielModal />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {AGENT_LIST.map(([key, agent]) => {
              const isSelected = selectedAgent === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedAgent(key)}
                  type="button"
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40"
                      : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{agent.emoji}</span>
                      <div>
                        <div className="text-sm font-bold text-slate-100">{agent.name}</div>
                        <div className="text-[10px] text-indigo-400">{agent.tagline}</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {agent.description}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-400 italic bg-slate-950/60 p-2 rounded border border-slate-800/60">
                    « {agent.exampleQuote} »
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Launch Button */}
        <div className="text-center pt-2">
          <button
            onClick={startMission}
            disabled={starting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-indigo-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-black text-sm tracking-widest uppercase transition-all shadow-xl hover:shadow-indigo-500/30 cursor-pointer disabled:opacity-50 hover:scale-105 active:scale-95"
          >
            <Rocket className="w-5 h-5 animate-bounce" />
            <span>{starting ? "Armement des sas..." : "LANCER L'ÉVACUATION DE L'ARCHE (30 MIN)"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </>
  );
}
