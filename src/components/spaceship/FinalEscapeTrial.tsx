"use client";

import { useState } from "react";
import { Rocket, CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, KeyRound, Sparkles, Award } from "lucide-react";

type Props = {
  onSuccess: () => void;
  onError: () => void;
  openPdf: (page?: number) => void;
};

export function FinalEscapeTrial({ onSuccess, onError, openPdf }: Props) {
  const [volet1Choice, setVolet1Choice] = useState<number | null>(null);
  const [volet2Choice, setVolet2Choice] = useState<number | null>(null);
  const [synthesisWord, setSynthesisWord] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function verifyFinalTrial() {
    if (volet1Choice !== 1) {
      onError();
      setErrorMsg("❌ Clé Volet 1 incorrecte ! Quelle est la finalité officielle du Volet 1 FMTT selon le référentiel p. 22 ?");
      return;
    }

    if (volet2Choice !== 1) {
      onError();
      setErrorMsg("❌ Clé Volet 2 incorrecte ! Quelle est la finalité du Volet 2 Numérique selon le référentiel p. 24 ?");
      return;
    }

    const cleanWord = synthesisWord.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (cleanWord !== "TRONC COMMUN" && cleanWord !== "TRONCCOMMUN" && cleanWord !== "FMTTN") {
      onError();
      setErrorMsg("❌ Code d'armement final incorrect. Tapez « TRONC COMMUN » (le cadre officiel de la réforme p. 2-18).");
      return;
    }

    setErrorMsg("");
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      onSuccess();
    }, 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border border-red-800/50 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
            <Rocket className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-mono text-red-400">Sas de Propulsion Finale</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                ÉPREUVE FINALE DE SYNTHÈSE
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Armement des Hyper-Propulseurs vers la Nouvelle Planète
            </h2>
            <p className="text-sm text-slate-300">
              Les 5 secteurs de l'Arche sont réparés ! Pour allumer l'hyper-propulsion et sauver les 1 450 passagers, fusionnez les 2 volets du référentiel FMTTN et validez le code d'armement.
            </p>
          </div>
        </div>

        <button
          onClick={() => openPdf(18)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-bold transition shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-red-400" />
          <span>Consulter Référentiel p. 18-24</span>
        </button>
      </div>

      {/* Synthesis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volet 1 Key */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
            <KeyRound className="w-4 h-4" />
            1. Clé Maîtresse du Volet 1 : FMTT (p. 22)
          </div>
          <p className="text-xs text-slate-300">
            Quelle est la finalité centrale du volet manuel, technique et technologique ?
          </p>

          <div className="space-y-2">
            {[
              { id: 1, text: "Comprendre le monde technique, développer l'intelligence du geste et fabriquer des objets de façon raisonnée, sécurisée et éco-citoyenne", sub: "Formulation officielle du Tronc Commun FMTT (p. 22)" },
              { id: 2, text: "Se limiter exclusivement à l'acquisition de gestes artisanaux traditionnels sans questionner le besoin ni éco-concevoir", sub: "Posture corporatiste fermée sans démarche de conception globale" },
              { id: 3, text: "Théoriser la technologie sur écran sans jamais manipuler d'outils physiques d'atelier ni de matériaux", sub: "Supprime le plaisir d'apprendre par le faire et la formation manuelle" },
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  setVolet1Choice(opt.id);
                  setErrorMsg("");
                }}
                className={`p-3 rounded-xl border cursor-pointer transition text-xs ${
                  volet1Choice === opt.id
                    ? "bg-blue-950/60 border-blue-400 text-blue-100 ring-2 ring-blue-400/40"
                    : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                <div className="font-semibold text-white">{opt.text}</div>
                <div className="text-[11px] text-slate-400 mt-1">{opt.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Volet 2 Key */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
            <KeyRound className="w-4 h-4" />
            2. Clé Maîtresse du Volet 2 : Numérique (p. 24)
          </div>
          <p className="text-xs text-slate-300">
            Quelle est la finalité centrale de l'éducation au numérique dans le Tronc Commun ?
          </p>

          <div className="space-y-2">
            {[
              { id: 1, text: "« Formation AU numérique et non pas PAR le numérique » : développer conjointement la littératie numérique et médiatique (DIGCOMP & CSEM), la pensée informatique/algorithmique, la sécurité et l'esprit critique (p. 24)", sub: "Principe cardinal et formulation officielle du Volet 2 Numérique (p. 24-25)" },
              { id: 2, text: "Former des utilisateurs passifs de suites logicielles commerciales propriétaires sans aborder le code ni l'éthique", sub: "Approche consumériste sans compréhension des mécanismes sous-jacents" },
              { id: 3, text: "Restreindre le cours à des exercices de dactylographie sans esprit critique ni sensibilisation aux traces et au RGPD", sub: "Vision mécanique désuète déconnectée des enjeux sociétaux actuels" },
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  setVolet2Choice(opt.id);
                  setErrorMsg("");
                }}
                className={`p-3 rounded-xl border cursor-pointer transition text-xs ${
                  volet2Choice === opt.id
                    ? "bg-purple-950/60 border-purple-400 text-purple-100 ring-2 ring-purple-400/40"
                    : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                <div className="font-semibold text-white">{opt.text}</div>
                <div className="text-[11px] text-slate-400 mt-1">{opt.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Synthesis Input Section */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-xl mx-auto space-y-4 text-center">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
          Code d'Armement Final
        </span>
        <h3 className="text-lg font-black text-white">
          Quel est le cadre officiel de référence de la réforme FWB ?
        </h3>
        <p className="text-xs text-slate-300">
          Ce cursus commun et polytechnique garantit le même socle d'émancipation pour tous les élèves de la 1re primaire à la 3e secondaire (p. 2-18).
        </p>

        <input
          type="text"
          value={synthesisWord}
          onChange={(e) => {
            setSynthesisWord(e.target.value);
            setErrorMsg("");
          }}
          placeholder="Entrez les deux mots clés..."
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-center text-lg uppercase tracking-widest focus:outline-none focus:border-red-500"
        />

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 text-left animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <div>{errorMsg}</div>
          </div>
        )}

        <button
          onClick={verifyFinalTrial}
          disabled={isLaunching}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:via-rose-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl shadow-red-600/40 transition cursor-pointer hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Rocket className="w-5 h-5 animate-bounce" />
          <span>{isLaunching ? "Allumage des tuyères en cours..." : "ENCLENCHER LE SAUT HYPERSPATIAL FINAL ➔"}</span>
        </button>
      </div>
    </div>
  );
}
