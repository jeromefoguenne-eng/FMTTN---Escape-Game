import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { MouseBackground } from "@/components/layout/MouseBackground";
import { Terminal, BookOpen, Users, UserRound, Sparkles, ChevronRight, Award, CheckCircle2 } from "lucide-react";
import { ReferentielModal } from "@/components/layout/ReferentielModal";
import { AGENT_CONFIGS } from "@/lib/ai/personalities";

export default function LandingPage() {
  const agents = Object.entries(AGENT_CONFIGS);

  return (
    <>
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 overflow-hidden bg-gradient-to-b from-[#0a0f1d] via-[#0f172a] to-[#020617]">
        <MouseBackground />

        <div className="relative z-10 text-center max-w-4xl w-full animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>EXPÉDITION INTERGALACTIQUE STELLA • TRONC COMMUN FWB (P1 À S3)</span>
          </div>

          <h1 className="font-[family-name:var(--font-orbitron)] text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-4 text-slate-100">
            L'ARCHE <span className="text-emerald-400 underline decoration-emerald-500/40">FMTTN</span>
          </h1>

          <p className="text-base sm:text-xl text-amber-300 max-w-2xl mx-auto mb-3 font-bold">
            🚀 MISSION CRITIQUE : 30 MINUTES POUR SAUVER LES 1 450 PASSAGERS
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            À bord de l'Arche en route vers un nouveau système pour coloniser de nouvelles planètes, une défaillance générale met en péril les 1 450 passagers. Isolés dans l'espace lointain, aucun secours terrestre n'est possible : <strong>seules les compétences manuelles, techniques, technologiques et numériques (FMTTN)</strong> permettront de réparer manuellement les systèmes vitaux et d'amener l'équipage à bon port !
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10">
            <Link
              href="/game/BLOC3-FMTTN"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wide transition-all shadow-xl hover:shadow-emerald-500/30 hover:scale-105"
            >
              <span>🚀 LANCER LA MISSION DE SAUVETAGE (30 MIN)</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              href="/solo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-sm tracking-wide transition-all"
            >
              <UserRound className="w-4 h-4 text-emerald-400" />
              <span>CONFIGURATION DE L'ÉTUDIANT</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Direct PDF access banner */}
          <div className="inline-flex items-center gap-3 p-2.5 px-4 rounded-xl border border-slate-700/80 bg-slate-900/60 backdrop-blur-sm text-xs text-slate-300">
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Document de référence fourni : <strong>refFMTTN.pdf (103 pages)</strong></span>
            <ReferentielModal />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="relative z-10 mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl w-full px-4">
          {[
            { label: "Volets Curriculaires", value: "2" },
            { label: "Champs d'Apprentissage", value: "8" },
            { label: "Coéquipiers IA Didactiques", value: "4" },
            { label: "Niveaux Couverts", value: "P1 ➔ S3" },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 text-center">
              <div className="font-[family-name:var(--font-orbitron)] text-xl sm:text-2xl font-black text-emerald-400">
                {value}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Les 2 Volets du Référentiel ─────────────────── */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-3xl font-bold text-center mb-3 text-slate-100">
          DEUX VOLETS EN INTERACTION
        </h2>
        <p className="text-center text-sm text-slate-400 mb-12 max-w-xl mx-auto">
          « C'est le geste qui est technique, c'est l'objet qui est technologique. » — page 99 du référentiel.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-blue-500/30 bg-slate-900/50 hover:border-blue-500/60 transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xl mb-4">
              🛠️
            </div>
            <h3 className="font-bold text-lg text-blue-400 mb-2">Volet 1 : Formation Manuelle, Technique et Technologique</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Valorisation des gestes, découverte des matières et matériaux (bois, métal, textiles, électricité), alimentation, aménagement d'habitat et objets technologiques avec capteurs.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Alimentation & Habitat</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Techniques de culture (compost équilibré)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Matières et matériaux & sécurité du poste</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Objets technologiques (machines simples ➔ capteurs)</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl border border-purple-500/30 bg-slate-900/50 hover:border-purple-500/60 transition-all">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xl mb-4">
              💻
            </div>
            <h3 className="font-bold text-lg text-purple-400 mb-2">Volet 2 : Éducation au Numérique (DigComp)</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Dès la 3e primaire (P3) : formation AU numérique et non PAR le numérique. Recherche critique, collaboration synchrone/asynchrone, pensée algorithmique et sécurité citoyenne.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Informations & données (fiabilité des sources)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Communication & collaboration (nétiquette)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Création de contenus & logigrammes</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Sécurité (les 5 niveaux de l'identité numérique)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Coéquipiers IA Didactiques ───────────────────── */}
      <section className="py-16 px-4 max-w-5xl mx-auto border-t border-slate-800">
        <h2 className="font-[family-name:var(--font-orbitron)] text-2xl sm:text-3xl font-bold text-center mb-3 text-slate-100">
          VOS COÉQUIPIERS IA DIDACTIQUES
        </h2>
        <p className="text-center text-sm text-slate-400 mb-12 max-w-xl mx-auto">
          Jouez seul ou en équipe avec une IA qui ne donne pas la solution mais vous guide directement vers les bonnes pages du référentiel.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map(([key, agent]) => (
            <div
              key={key}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-2xl">{agent.emoji}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{agent.name}</h4>
                    <p className="text-[11px] text-emerald-400 font-medium">{agent.tagline}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {agent.description}
                </p>
              </div>
              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 italic">
                « {agent.exampleQuote} »
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
