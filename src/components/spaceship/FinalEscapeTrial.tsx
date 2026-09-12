"use client";

import { useState } from "react";
import { Rocket, CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, KeyRound, Sparkles, Award, Layers, Compass, ArrowUp, ArrowDown, ArrowRight, Monitor, Code, Lock, Share2 } from "lucide-react";

type Props = {
  onSuccess: () => void;
  onError: () => void;
  openPdf: (page?: number) => void;
};

// ÉCHELON 1 : DIAGNOSTIC DIDACTIQUE DE SÉQUENCES NUMÉRIQUES
type SéquenceScenario = {
  id: number;
  title: string;
  context: string;
  isFMTTN: boolean;
  diagnosticExplanation: string;
};

const SEQUENCES_POOL: SéquenceScenario[] = [
  {
    id: 1,
    title: "Séquence A : Le Quiz de révision grammaticale sur tablette tactile",
    context: "Les élèves de P5 utilisent individuellement des tablettes pour répondre à un questionnaire Kahoot minuté portant sur les règles de grammaire et d'orthographe en français.",
    isFMTTN: false,
    diagnosticExplanation: "Écueil didactique majeur (p. 24) : C'est une formation PAR le numérique (le numérique sert de vecteur instrumental pour une autre matière), mais ce n'est PAS une formation AU numérique (le numérique comme objet d'apprentissage autonome avec acquisition de savoirs et de compétences informatiques).",
  },
  {
    id: 2,
    title: "Séquence B : La frappe mécanique d'un texte imprimé au traitement de texte",
    context: "L'enseignant demande aux élèves de recopier au kilomètre une poésie depuis une feuille papier dans un traitement de texte, sans aborder les styles, l'arborescence, les raccourcis ni les commandes invariantes.",
    isFMTTN: false,
    diagnosticExplanation: "Écueil didactique (p. 44, 64) : Dactylographie passive sans apprentissage du vocabulaire invariant du traitement de texte (saut de page, puces, marges, alignement) ni de la gestion structurée des fichiers.",
  },
  {
    id: 3,
    title: "Séquence C : Le cours magistral magistratif sur l'histoire de l'ordinateur",
    context: "L'enseignant projette un diaporama sur les pionniers de l'informatique pendant 50 minutes sans aucune manipulation sur machine, ni débranchement algorithmique, ni pratique concrète.",
    isFMTTN: false,
    diagnosticExplanation: "Écueil didactique (p. 20, 24) : Contredit l'esprit du Tronc Commun où l'élève doit manipuler, expérimenter, créer et s'approprier les outils dans un processus actif de production.",
  },
  {
    id: 4,
    title: "Séquence D : La Création d'une Fiction Interactive & Jeu sous Scratch",
    context: "Les élèves conçoivent un récit interactif : ils modélisent le logigramme avec symboles normalisés (p. 50), écrivent les scripts Scratch avec boucles et conditions (p. 56), sélectionnent des images sous licence Creative Commons (p. 44, 63) et paramètrent la protection des données personnelles (p. 57).",
    isFMTTN: true,
    diagnosticExplanation: "✓ AUTHENTIQUE PROJET DU VOLET NUMÉRIQUE FMTTN ! Intégration exemplaire des 4 champs : Informations et données, Communication, Création de contenus (pensée algorithmique) et Sécurité (p. 24-25).",
  },
];

// ÉCHELON 2 : LA SPIRALE CURRICULAIRE DU VOLET NUMÉRIQUE (P3 ➔ S2)
type SpiraleAttendu = {
  id: string;
  orderNumber: number;
  levelBadge: string;
  attenduText: string;
  curriculumRef: string;
};

const INITIAL_SHUFFLED_ATTENDUS: SpiraleAttendu[] = [
  {
    id: "att-s2",
    orderNumber: 4,
    levelBadge: "Cycle S2 (2e Secondaire)",
    attenduText: "Expliquer le principe du codage binaire, coder un nombre (< 256) en binaire, utiliser les formules/fonctions d'un tableur et expliquer l'obsolescence programmée.",
    curriculumRef: "Référentiel p. 73-74",
  },
  {
    id: "att-p5",
    orderNumber: 2,
    levelBadge: "Cycle P5 (5e Primaire)",
    attenduText: "Représenter et associer les symboles conventionnels d'un logigramme séquentiel (Début/Fin ovale, Processus rectangle, Décision losange) et chercher son e-réputation.",
    curriculumRef: "Référentiel p. 50 & 57",
  },
  {
    id: "att-p3",
    orderNumber: 1,
    levelBadge: "Cycle P3 (3e Primaire)",
    attenduText: "Utiliser adéquatement en contexte les termes moteur de recherche, barre de recherche, navigateur, Internet, et sélectionner des mots-clés pertinents.",
    curriculumRef: "Référentiel p. 24 & 37",
  },
  {
    id: "att-p6",
    orderNumber: 3,
    levelBadge: "Cycle P6 (6e Primaire)",
    attenduText: "Différencier formellement Algorithme et Programme, identifier une suite d'opérations pouvant être remplacée par une boucle et utiliser un outil de présentation.",
    curriculumRef: "Référentiel p. 56",
  },
];

export function FinalEscapeTrial({ onSuccess, onError, openPdf }: Props) {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Échelon 1 : Choix de séquence
  const [selectedSequenceId, setSelectedSequenceId] = useState<number | null>(null);
  const [step1Validated, setStep1Validated] = useState(false);

  // Échelon 2 : Spirale curriculaire
  const [orderedAttendus, setOrderedAttendus] = useState<SpiraleAttendu[]>(INITIAL_SHUFFLED_ATTENDUS);
  const [step2Validated, setStep2Validated] = useState(false);

  // Échelon 3 : Les 4 Champs du Volet Numérique et code d'armement
  const [selectedChamps, setSelectedChamps] = useState<string[]>([]);
  const [synthesisWord, setSynthesisWord] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  function moveAttendu(index: number, direction: "up" | "down") {
    if (step2Validated) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedAttendus.length) return;

    const copy = [...orderedAttendus];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setOrderedAttendus(copy);
    setErrorMsg("");
  }

  function verifyStep1() {
    if (selectedSequenceId !== 4) {
      onError();
      const chosen = SEQUENCES_POOL.find((s) => s.id === selectedSequenceId);
      setErrorMsg(
        chosen
          ? `❌ Diagnostic didactique erroné : ${chosen.diagnosticExplanation}`
          : "❌ Veuillez sélectionner la séquence qui répond aux attendus du Volet Numérique de la FMTTN."
      );
      return;
    }

    setErrorMsg("");
    setStep1Validated(true);
    setActiveStep(2);
  }

  function verifyStep2() {
    const isSuccess = orderedAttendus.every((item, idx) => item.orderNumber === idx + 1);

    if (!isSuccess) {
      onError();
      setErrorMsg(
        "❌ L'ordonnancement de la spirale curriculaire est incorrect ! Vérifiez la progression officielle des apprentissages (P3 ➔ P5 ➔ P6 ➔ S2)."
      );
      return;
    }

    setErrorMsg("");
    setStep2Validated(true);
    setActiveStep(3);
  }

  function toggleChamp(champName: string) {
    setErrorMsg("");
    setSelectedChamps((prev) =>
      prev.includes(champName) ? prev.filter((p) => p !== champName) : [...prev, champName]
    );
  }

  function verifyStep3() {
    const requiredChamps = [
      "Informations et données",
      "Communication et collaboration",
      "Création de contenus",
      "Sécurité",
    ];

    const hasAllChamps =
      requiredChamps.every((p) => selectedChamps.includes(p)) &&
      selectedChamps.length === requiredChamps.length;

    if (!hasAllChamps) {
      onError();
      setErrorMsg(
        "❌ Sélection des champs incorrecte ! Le Volet Numérique repose sur exactement 4 champs officiels (p. 24-25 du référentiel)."
      );
      return;
    }

    const cleanInput = synthesisWord.trim().toUpperCase().replace(/[\s\-_]/g, "");
    // Accepter TRONCCOMMUN ou NUMERIQUE
    if (cleanInput !== "TRONCCOMMUN" && cleanInput !== "NUMERIQUE" && cleanInput !== "AU_NUMERIQUE") {
      onError();
      setErrorMsg(
        "❌ Code d'armement incorrect. Indice : le cadre institutionnel officiel de cette réforme polytechnique commune de P1 à S3 (2 mots : T____ C_____)."
      );
      return;
    }

    setErrorMsg("");
    setIsLaunching(true);

    setTimeout(() => {
      onSuccess();
    }, 1200);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* HEADER WITH PDF LINK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border border-red-500/40 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
            <Rocket className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-mono text-red-400 font-bold">Épreuve Finale • Niveau 6 (Haute Exigence Didactique)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                VOLET NUMÉRIQUE FMTTN (P. 24-25, 102)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-0.5">
              Sas d'Armement : Synthèse Didactique de l'Enseignant de Numérique
            </h2>
            <p className="text-xs text-slate-300">
              Déjouez les faux-semblants pédagogiques (p. 24), validez la spirale curriculaire (P3 ➔ S2) et identifiez les 4 champs fondateurs du Volet Numérique.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openPdf(24)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-bold transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-red-400" />
            <span>Volet Numérique p. 24</span>
          </button>
        </div>
      </div>

      {/* STEP INDICATOR */}
      <div className="grid grid-cols-3 gap-3">
        <div
          onClick={() => setActiveStep(1)}
          className={`p-3 rounded-xl border text-center transition cursor-pointer ${
            activeStep === 1
              ? "bg-red-950/60 border-red-500 text-red-200 ring-2 ring-red-500/30"
              : step1Validated
              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
              : "bg-slate-900/60 border-slate-800 text-slate-500"
          }`}
        >
          <div className="text-[10px] font-mono font-bold uppercase">Échelon 1</div>
          <div className="text-xs font-bold truncate">Discrimination Didactique (AU vs PAR)</div>
        </div>

        <div
          onClick={() => step1Validated && setActiveStep(2)}
          className={`p-3 rounded-xl border text-center transition cursor-pointer ${
            activeStep === 2
              ? "bg-red-950/60 border-red-500 text-red-200 ring-2 ring-red-500/30"
              : step2Validated
              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
              : "bg-slate-900/60 border-slate-800 text-slate-500"
          }`}
        >
          <div className="text-[10px] font-mono font-bold uppercase">Échelon 2</div>
          <div className="text-xs font-bold truncate">Spirale Curriculaire (P3 ➔ S2)</div>
        </div>

        <div
          onClick={() => step2Validated && setActiveStep(3)}
          className={`p-3 rounded-xl border text-center transition cursor-pointer ${
            activeStep === 3
              ? "bg-red-950/60 border-red-500 text-red-200 ring-2 ring-red-500/30"
              : "bg-slate-900/60 border-slate-800 text-slate-500"
          }`}
        >
          <div className="text-[10px] font-mono font-bold uppercase">Échelon 3</div>
          <div className="text-xs font-bold truncate">Les 4 Champs & Code d'Armement</div>
        </div>
      </div>

      {/* STEP CONTENT */}
      {activeStep === 1 ? (
        /* ─────────────────────────────────────────────────────────────
           ÉCHELON 1 : DIAGNOSTIC DIDACTIQUE DE SÉQUENCES
        ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl animate-fade-in">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-red-400" />
              <span>Échelon 1 : Discrimination Didactique — Déjouer les Faux-Semblants</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              En tant que maître de stage ou évaluateur de Bloc 3, vous observez 4 séquences d'apprentissage menées dans des écoles de la FWB.
              <strong> Cliquez sur la SEULE séquence qui répond rigoureusement aux attendus d'une formation AU numérique de la FMTTN</strong> (p. 24-25).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SEQUENCES_POOL.map((seq) => {
              const isSelected = selectedSequenceId === seq.id;
              return (
                <div
                  key={seq.id}
                  onClick={() => {
                    setSelectedSequenceId(seq.id);
                    setErrorMsg("");
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-red-950/60 border-red-500 text-white ring-2 ring-red-500/40 shadow-xl scale-[1.01]"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:scale-[1.01]"
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-white mb-1.5">{seq.title}</div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{seq.context}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-right">
                    <span className={isSelected ? "text-amber-300 font-bold" : "text-slate-500"}>
                      {isSelected ? "Séquence Sélectionnée ➔" : "Cliquer pour sélectionner"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <div>{errorMsg}</div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={verifyStep1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer hover:scale-105"
            >
              <span>Valider le Diagnostic & Passer à l'Échelon 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : activeStep === 2 ? (
        /* ─────────────────────────────────────────────────────────────
           ÉCHELON 2 : LA SPIRALE CURRICULAIRE DU NUMÉRIQUE (ORDONNANCEMENT P3-S2)
        ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl animate-fade-in">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Échelon 2 : La Logique Spiralaire du Volet Numérique (p. 24, 37, 50, 56, 74)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Le référentiel proscrit les ruptures conceptuelles. Utilisez les flèches ▲ et ▼ pour <strong>ordonner ces 4 attendus officiels selon leur niveau exact d'apparition dans le cursus (du plus précoce au plus avancé)</strong> :
            </p>
          </div>

          <div className="space-y-3">
            {orderedAttendus.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4 transition hover:border-slate-700"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-amber-400 shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                        {item.levelBadge}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">({item.curriculumRef})</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{item.attenduText}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveAttendu(idx, "up")}
                    disabled={idx === 0}
                    className={`p-1.5 rounded-md border text-xs font-bold transition ${
                      idx === 0
                        ? "bg-slate-950 text-slate-700 border-slate-800 cursor-not-allowed"
                        : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
                    }`}
                    title="Monter d'un rang"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveAttendu(idx, "down")}
                    disabled={idx === orderedAttendus.length - 1}
                    className={`p-1.5 rounded-md border text-xs font-bold transition ${
                      idx === orderedAttendus.length - 1
                        ? "bg-slate-950 text-slate-700 border-slate-800 cursor-not-allowed"
                        : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
                    }`}
                    title="Descendre d'un rang"
                  >
                    ▼
                  </button>
                </div>
              </div>
            ))}
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <div>{errorMsg}</div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep(1)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ← Revoir le Diagnostic
            </button>

            <button
              onClick={verifyStep2}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer hover:scale-105"
            >
              <span>Valider la Spirale & Passer à l'Échelon 3</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
           ÉCHELON 3 : LES 4 CHAMPS DU VOLET NUMÉRIQUE & CODE D'ARMEMENT
        ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl animate-fade-in">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>Échelon 3 : Les 4 Champs Officiels du Volet Numérique (p. 24-25)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Le Volet 2 (Numérique) structure l'ensemble des apprentissages de P3 à S3 selon 4 champs canoniques.
              <strong> Cochez exactement les 4 champs officiels du référentiel (p. 24-25)</strong> :
            </p>
          </div>

          {/* 6 Choices (4 correct champs, 2 distractors) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                name: "Informations et données",
                icon: "📊",
                desc: "Recherche, sélection critique, fiabilité des sources, hardware/software, fichiers et stockage (p. 24)",
              },
              {
                name: "Bureautique Propriétaire Commerciale",
                icon: "💼",
                desc: "Apprentissage passif de licences privées d'entreprise (Distracteur non prescrit)",
              },
              {
                name: "Communication et collaboration",
                icon: "💬",
                desc: "Partage de contenus, messagerie, outils synchrones/asynchrones, réseaux et nétiquette (p. 24)",
              },
              {
                name: "Création de contenus",
                icon: "💻",
                desc: "Traitement de texte, tableur, multimédia, logigrammes, pensée informatique et programmation (p. 25)",
              },
              {
                name: "Formation purement PAR le numérique",
                icon: "📺",
                desc: "Considérer le numérique seulement comme une aide d'enseignement d'autres disciplines (Distracteur p. 24)",
              },
              {
                name: "Sécurité",
                icon: "🛡️",
                desc: "Protection des personnes et des données, identité numérique, prévention des risques et éthique (p. 25)",
              },
            ].map((c) => {
              const isChecked = selectedChamps.includes(c.name);
              return (
                <div
                  key={c.name}
                  onClick={() => toggleChamp(c.name)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    isChecked
                      ? "bg-emerald-950/60 border-emerald-400 text-white ring-2 ring-emerald-400/40 shadow-lg"
                      : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white flex items-center gap-1.5">
                        <span>{c.icon}</span>
                        <span>{c.name}</span>
                      </span>
                      <span className="text-xs font-mono">{isChecked ? "☑" : "☐"}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{c.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final Code Entry */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40 uppercase tracking-widest">
              Mot de Passe d'Armement Hyperspatial
            </span>
            <p className="text-xs text-slate-300">
              Quel est le cadre institutionnel officiel de cette réforme polytechnique garantissant la formation au numérique commune de P1 à S3 (p. 2-18) ?
            </p>
            <input
              type="text"
              value={synthesisWord}
              onChange={(e) => {
                setSynthesisWord(e.target.value);
                setErrorMsg("");
              }}
              placeholder="Entrez le code officiel (ex: TRONC COMMUN)..."
              className="w-full max-w-md px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center text-lg uppercase tracking-widest focus:outline-none focus:border-red-500"
            />
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <div>{errorMsg}</div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep(2)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ← Revoir la Spirale
            </button>

            <button
              onClick={verifyStep3}
              disabled={isLaunching}
              className="py-4 px-8 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:via-rose-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl shadow-red-600/40 transition cursor-pointer hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Rocket className="w-5 h-5 animate-bounce" />
              <span>{isLaunching ? "Allumage des tuyères en cours..." : "ENCLENCHER LE SAUT HYPERSPATIAL FINAL ➔"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
