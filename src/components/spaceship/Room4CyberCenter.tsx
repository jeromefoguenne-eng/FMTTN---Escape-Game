"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, ArrowLeft, Mail, Search, Eye, Lock, Globe, FileWarning, Sparkles, Link2, Unlink } from "lucide-react";

type Props = {
  onUnlock: () => void;
  onError: () => void;
  openPdf: (page?: number) => void;
};

type PairLeft = {
  id: string;
  situation: string;
  categoryHint: string;
  expectedRightId: string;
  icon: string;
};

type PairRight = {
  id: string;
  strateName: string;
  levelNumber: number;
  officialDefinition: string;
  badgeColor: string;
};

const PAIRS_LEFT: PairLeft[] = [
  {
    id: "case-identite",
    situation: "Nom de famille, date de naissance et photo de classe d'une élève de 11 ans",
    categoryHint: "Données civiles sous protection stricte du droit à l'image et du RGPD",
    expectedRightId: "strate-n5",
    icon: "🪪",
  },
  {
    id: "case-login",
    situation: "Identifiant matricule et mot de passe de connexion à l'ENT Smartschool",
    categoryHint: "Clés d'accès et jetons d'authentification pour déverrouiller la session",
    expectedRightId: "strate-n4",
    icon: "🔑",
  },
  {
    id: "case-activite",
    situation: "Historique des requêtes web, horodatages et cookies techniques de navigation",
    categoryHint: "Traces d'usage déposées automatiquement par le navigateur sans saisie",
    expectedRightId: "strate-n3",
    icon: "📊",
  },
  {
    id: "case-publication",
    situation: "Article rédigé et photo de maquette postés volontairement par l'élève sur le blog",
    categoryHint: "Contenu produit de manière intentionnelle et diffusé dans l'espace public",
    expectedRightId: "strate-n2",
    icon: "📝",
  },
  {
    id: "case-reputation",
    situation: "Commentaires postés par des tiers et classement algorithmique de profil",
    categoryHint: "Ce que des camarades, des inconnus ou des algorithmes disent sur l'individu",
    expectedRightId: "strate-n1",
    icon: "🌐",
  },
];

const PAIRS_RIGHT: PairRight[] = [
  {
    id: "strate-n1",
    strateName: "Niveau 1 : e-Réputation",
    levelNumber: 1,
    officialDefinition: "Traces subies ou calculées par des tiers (avis, rumeurs, profilage p. 100)",
    badgeColor: "border-pink-500/50 bg-pink-950/40 text-pink-300",
  },
  {
    id: "strate-n3",
    strateName: "Niveau 3 : Activités & Télémétrie",
    levelNumber: 3,
    officialDefinition: "Traces d'usage générées automatiquement lors des sessions (p. 100)",
    badgeColor: "border-cyan-500/50 bg-cyan-950/40 text-cyan-300",
  },
  {
    id: "strate-n5",
    strateName: "Niveau 5 : Identité Personnelle",
    levelNumber: 5,
    officialDefinition: "État civil, coordonnées et biométrie sous haute protection RGPD (p. 100)",
    badgeColor: "border-purple-500/50 bg-purple-950/40 text-purple-300",
  },
  {
    id: "strate-n2",
    strateName: "Niveau 2 : Publications Déclaratives",
    levelNumber: 2,
    officialDefinition: "Données et créations partagées sciemment par l'usager (p. 100)",
    badgeColor: "border-emerald-500/50 bg-emerald-950/40 text-emerald-300",
  },
  {
    id: "strate-n4",
    strateName: "Niveau 4 : Logs In & Accréditations",
    levelNumber: 4,
    officialDefinition: "Identifiants de compte et journaux de connexion sécurisée (p. 100)",
    badgeColor: "border-amber-500/50 bg-amber-950/40 text-amber-300",
  },
];

export function Room4CyberCenter({ onUnlock, onError, openPdf }: Props) {
  // Mode: "pairs" (Jeu d'appariement LearningApps) -> "phishing" (Viseur d'inspection)
  const [activeTab, setActiveTab] = useState<"pairs" | "phishing">("pairs");

  // --- TAB 1 : MATCHING PAIRS STATE ---
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({}); // leftId -> rightId
  const [pairsCompleted, setPairsCompleted] = useState(false);

  // --- TAB 2 : PHISHING DETECTOR STATE ---
  const [detectedClues, setDetectedClues] = useState<string[]>([]);
  const [phishingCompleted, setPhishingCompleted] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  // Matching pair click logic
  function handleSelectLeft(id: string) {
    if (matchedPairs[id]) {
      // Unpair if already paired
      setMatchedPairs((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setSelectedLeftId(null);
      return;
    }
    setSelectedLeftId(id);
    setErrorMsg("");
  }

  function handleSelectRight(rightId: string) {
    if (!selectedLeftId) {
      setErrorMsg("👉 Cliquez d'abord sur une situation scolaire à gauche, puis associez-la à sa strate à droite.");
      return;
    }

    const expected = PAIRS_LEFT.find((p) => p.id === selectedLeftId)?.expectedRightId;

    if (expected !== rightId) {
      onError();
      setErrorMsg("❌ Mauvaise association ! Consultez la pyramide des 5 strates du référentiel p. 100.");
      setSelectedLeftId(null);
      return;
    }

    // Success pair match!
    const newMatched = { ...matchedPairs, [selectedLeftId]: rightId };
    setMatchedPairs(newMatched);
    setSelectedLeftId(null);
    setErrorMsg("");

    if (Object.keys(newMatched).length === PAIRS_LEFT.length) {
      setPairsCompleted(true);
      setActiveTab("phishing");
    }
  }

  // Phishing toggle
  function toggleClue(clueId: string) {
    setDetectedClues((prev) => {
      const next = prev.includes(clueId) ? prev.filter((c) => c !== clueId) : [...prev, clueId];
      if (next.length === 3) {
        setPhishingCompleted(true);
        setUnlocked(true);
        onUnlock();
      }
      return next;
    });
    setErrorMsg("");
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-800/40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-mono text-purple-400">Secteur 04</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                CYBER-CENTRE & ÉDUCATION AUX MÉDIAS (P. 100)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Jeu d'Appariement RGPD & Viseur Anti-Hameçonnage
            </h2>
            <p className="text-xs text-slate-300">
              Comme sur LearningApps, reliez les 5 situations scolaires aux strates de traces numériques (p. 100), puis utilisez le viseur d'inspection pour isoler l'attaque de phishing.
            </p>
          </div>
        </div>

        <button
          onClick={() => openPdf(100)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-bold transition shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-purple-400" />
          <span>Consulter Référentiel p. 100</span>
        </button>
      </div>

      {/* TABS HEADER */}
      <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <button
          onClick={() => setActiveTab("pairs")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "pairs"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>1. Jeu des Paires : Les 5 Strates RGPD (p. 100)</span>
          {pairsCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
        </button>

        <button
          onClick={() => setActiveTab("phishing")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "phishing"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Search className="w-4 h-4" />
          <span>2. Viseur Détective Anti-Hameçonnage</span>
          {phishingCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
        </button>
      </div>

      {/* UNLOCKED SUCCESS */}
      {unlocked ? (
        <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-emerald-300">
            STRATES RGPD ASSOCIÉES & SÉCURITÉ CYBER RÉTABLIE !
          </h3>
          <p className="text-sm text-emerald-200/90 max-w-xl mx-auto">
            Félicitations ! Les 5 paires didactiques sont parfaitement verrouillées et le filtre anti-hameçonnage a neutralisé les 3 vecteurs d'attaque sur le réseau scolaire de l'Arche.
          </p>
        </div>
      ) : activeTab === "pairs" ? (
        /* ─────────────────────────────────────────────────────────────
           TAB 1 : MATCHING PAIRS (JEU DES PAIRES LEARNINGAPPS)
        ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
            <div className="text-slate-300">
              👉 <strong>Consigne :</strong> Cliquez sur une situation à gauche, puis cliquez sur la strate correspondante à droite pour les relier.
            </div>
            <div className="font-mono text-purple-300 font-bold">
              Paires formées : {Object.keys(matchedPairs).length} / {PAIRS_LEFT.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Column: Situations */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 block">
                Colonne A : Situations Scolaires en FWB
              </span>
              {PAIRS_LEFT.map((card) => {
                const isMatched = matchedPairs[card.id] !== undefined;
                const isSelected = selectedLeftId === card.id;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelectLeft(card.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isMatched
                        ? "bg-emerald-950/40 border-emerald-500 text-emerald-200 opacity-90 shadow-md"
                        : isSelected
                        ? "bg-purple-600 border-white text-white scale-105 shadow-xl ring-2 ring-white"
                        : "bg-slate-950/90 border-slate-700/80 hover:border-purple-400 text-slate-300 hover:scale-[1.01]"
                    }`}
                  >
                    <span className="text-2xl shrink-0">{card.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs sm:text-sm leading-snug">{card.situation}</div>
                      <p className="text-[10px] opacity-75 mt-1 line-clamp-1">{card.categoryHint}</p>
                    </div>
                    {isMatched ? (
                      <span className="text-emerald-400 font-mono text-xs font-bold shrink-0">✓ Relié</span>
                    ) : isSelected ? (
                      <span className="text-xs font-bold text-amber-300 animate-pulse shrink-0">Choisi ➔</span>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Right Column: 5 Strates RGPD */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                Colonne B : Les 5 Strates Officielles (p. 100)
              </span>
              {PAIRS_RIGHT.map((strate) => {
                const isUsed = Object.values(matchedPairs).includes(strate.id);
                const isTargetReady = selectedLeftId !== null;

                return (
                  <div
                    key={strate.id}
                    onClick={() => handleSelectRight(strate.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isUsed
                        ? "bg-emerald-950/40 border-emerald-500 text-emerald-200 opacity-90 shadow-md"
                        : isTargetReady
                        ? `${strate.badgeColor} hover:scale-[1.02] ring-1 ring-white hover:border-white shadow-lg`
                        : "bg-slate-950/90 border-slate-700 text-slate-400"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-800 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700">
                      N{strate.levelNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-white">{strate.strateName}</div>
                      <p className="text-[10px] opacity-80 mt-0.5">{strate.officialDefinition}</p>
                    </div>
                    {isUsed && (
                      <span className="text-emerald-400 font-mono text-xs font-bold shrink-0">✓ Verrouillé</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Bottom Action */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setMatchedPairs({})}
              className="text-xs text-slate-400 hover:text-white cursor-pointer flex items-center gap-1"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>Délier toutes les paires</span>
            </button>

            {pairsCompleted && (
              <button
                onClick={() => setActiveTab("phishing")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer hover:scale-105"
              >
                <span>Passer au Viseur Anti-Phishing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
           TAB 2 : VISEUR D'INSPECTION ANTI-HAMEÇONNAGE (POINT ON IMAGE)
        ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-400" />
                <span>Viseur Détective : Neutraliser les 3 Failles de Phishing</span>
              </h3>
              <p className="text-xs text-slate-300">
                Passez votre viseur et <strong>cliquez directement sur les 3 zones suspectes</strong> de ce faux courriel Smartschool pour bloquer l'intrusion.
              </p>
            </div>
            <div className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 shrink-0">
              Failles neutralisées : {detectedClues.length} / 3
            </div>
          </div>

          {/* Realistic Mail Interface with Interactive Target Crosshairs */}
          <div className="rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden shadow-2xl font-sans text-xs sm:text-sm">
            {/* Header with Clue 1 */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-mono text-slate-400">Expéditeur :</span>
                <button
                  onClick={() => toggleClue("sender")}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition text-left cursor-pointer flex items-center gap-2 ${
                    detectedClues.includes("sender")
                      ? "bg-rose-950 border-rose-500 text-rose-300 ring-2 ring-rose-500 font-bold"
                      : "bg-slate-800/90 border-slate-700 text-slate-200 hover:border-amber-400 hover:ring-2 hover:ring-amber-400/50"
                  }`}
                >
                  <span>🎯</span>
                  <span>Portail Scolaire FWB &lt;securite@fwb-portail-verification.xyz&gt;</span>
                  {detectedClues.includes("sender") && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Objet :</span>
                <span className="font-bold text-rose-400">
                  🚨 URGENT : Suspension immédiate de votre compte Smartschool
                </span>
              </div>
            </div>

            {/* Body with Clue 2 & 3 */}
            <div className="p-6 space-y-4 text-slate-200 leading-relaxed">
              <p>Bonjour,</p>
              <p>
                Une anomalie critique a été détectée sur votre session scolaire. Pour éviter le blocage définitif de votre dossier et la perte de vos travaux, vous devez renouveler votre mot de passe dans les 60 minutes :
              </p>

              {/* Clue 2: Fake URL */}
              <div className="py-2 text-center">
                <button
                  onClick={() => toggleClue("url")}
                  className={`px-6 py-3.5 rounded-xl border text-xs sm:text-sm font-bold transition shadow-lg cursor-pointer inline-flex items-center gap-2 ${
                    detectedClues.includes("url")
                      ? "bg-rose-950 border-rose-500 text-rose-300 ring-2 ring-rose-500"
                      : "bg-blue-600 hover:bg-blue-500 border-blue-400 text-white hover:border-amber-400 hover:ring-2 hover:ring-amber-400/50"
                  }`}
                >
                  <span>🎯</span>
                  <span>Mettre à jour mes identifiants (http://auth-fwb-update-credentials.top/login)</span>
                  {detectedClues.includes("url") && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1" />}
                </button>
              </div>

              {/* Clue 3: Malicious Attachment */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-xs font-mono text-slate-400 block mb-1">Pièce jointe sécurisée :</span>
                <button
                  onClick={() => toggleClue("attachment")}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs transition cursor-pointer ${
                    detectedClues.includes("attachment")
                      ? "bg-rose-950 border-rose-500 text-rose-300 ring-2 ring-rose-500 font-bold"
                      : "bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-400 hover:ring-2 hover:ring-amber-400/50"
                  }`}
                >
                  <span>🎯</span>
                  <FileWarning className="w-4 h-4 text-rose-400" />
                  <span>Certificat_Validation_FWB.exe (1.2 Mo)</span>
                  {detectedClues.includes("attachment") && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1" />}
                </button>
              </div>
            </div>
          </div>

          {/* Feedback & Back Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveTab("pairs")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour au Jeu des Paires</span>
            </button>

            <span className="text-xs text-slate-400 font-mono">
              {phishingCompleted
                ? "✓ 3 / 3 failles isolées avec succès !"
                : "Cliquez sur les 3 cibles 🎯 pour neutraliser les virus."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
