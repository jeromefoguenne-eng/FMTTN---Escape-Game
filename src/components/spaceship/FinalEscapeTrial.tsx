"use client";

import { useState } from "react";
import { Rocket, CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, KeyRound, Sparkles, Award, Layers, Compass, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";

type Props = {
  onSuccess: () => void;
  onError: () => void;
  openPdf: (page?: number) => void;
};

// ÉCHELON 1 : DIAGNOSTIC DIDACTIQUE DE SÉQUENCES
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
    title: "Séquence A : Le Quiz de grammaire sur tablette tactile",
    context: "Les élèves de P5 utilisent chacun un iPad pour répondre en direct à un questionnaire Kahoot révisant les accords du participe passé en français.",
    isFMTTN: false,
    diagnosticExplanation: "Écueil didactique majeur (p. 24) : C'est une formation PAR le numérique (le numérique est un support d'enseignement pour une autre matière), mais ABSOLUMENT PAS une formation AU numérique (le numérique comme objet d'apprentissage pour lui-même).",
  },
  {
    id: 2,
    title: "Séquence B : L'assemblage du kit pré-découpé en usine",
    context: "Pour fabriquer une mangeoire à oiseaux, l'enseignant distribue des planches déjà usinées et pré-percées. Les élèves suivent une notice de montage pas à pas sans concevoir.",
    isFMTTN: false,
    diagnosticExplanation: "Écueil didactique (p. 22-23) : Simple montage mécanique sans démarche technologique. Aucun besoin réel n'est analysé, aucun croquis d'intention n'est produit et aucun choix de matériau n'est exercé.",
  },
  {
    id: 3,
    title: "Séquence C : L'exposé magistral théorique sur la robotique",
    context: "Le professeur projette un documentaire vidéo sur les robots industriels et dicte un cours magistral sur l'histoire de l'informatique sans aucune manipulation pratique.",
    isFMTTN: false,
    diagnosticExplanation: "Écueil didactique (p. 20-21) : Contredit l'apprentissage par le faire, l'intelligence du geste et la manipulation d'outils et de composants qui fondent le Tronc Commun.",
  },
  {
    id: 4,
    title: "Séquence D : Le Projet Autonome d'Arrosage Automatisé de l'École",
    context: "Face au dessèchement des bacs potagers, les élèves analysent le besoin, dessinent des croquis côtés, conçoivent le logigramme (début, test de capteur, action), programment la carte Micro:bit pour ouvrir une vanne, façonnent un boîtier étanche en bois recyclé et évaluent le bilan hydrique.",
    isFMTTN: true,
    diagnosticExplanation: "✓ AUTHENTIQUE SÉQUENCE DU TRONC COMMUN FMTTN ! Articulation exemplaire de la démarche technologique (Volet 1), de la pensée computationnelle (Volet 2), de la réalisation manuelle et du développement durable (p. 20-26).",
  },
];

// ÉCHELON 2 : LA SPIRALE CURRICULAIRE (ORDONNANCER DU P3 AU S2)
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
    attenduText: "Expliquer le principe du codage binaire, coder un nombre (< 256) en binaire, utiliser des variables/opérateurs logiques et expliquer l'obsolescence programmée.",
    curriculumRef: "Référentiel p. 74",
  },
  {
    id: "att-p5",
    orderNumber: 2,
    levelBadge: "Cycle P5 (5e Primaire)",
    attenduText: "Représenter et associer les symboles conventionnels d'un logigramme séquentiel (Début/Fin ovale, Processus rectangle, Décision losange) et chercher son e-réputation.",
    curriculumRef: "Référentiel p. 50",
  },
  {
    id: "att-p3",
    orderNumber: 1,
    levelBadge: "Cycle P3 (3e Primaire)",
    attenduText: "Entrée officielle dans les attendus spécifiques du numérique obligatoire : recherche d'informations élémentaires et initiation à l'organisation des données.",
    curriculumRef: "Référentiel p. 24 & 45",
  },
  {
    id: "att-p6",
    orderNumber: 3,
    levelBadge: "Cycle P6 (6e Primaire)",
    attenduText: "Différencier formellement Algorithme et Programme, verbaliser et concevoir un logigramme intégrant une boucle et une condition.",
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

  // Échelon 3 : Les 4 Pôles et mot d'armement
  const [selectedPoles, setSelectedPoles] = useState<string[]>([]);
  const [synthesisWord, setSynthesisWord] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  // Move step card in spirale
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
          ? `❌ Diagnostic erroné : ${chosen.diagnosticExplanation}`
          : "❌ Veuillez sélectionner la séquence qui incarne pleinement la formation FMTTN selon le référentiel."
      );
      return;
    }

    setErrorMsg("");
    setStep1Validated(true);
    setActiveStep(2);
  }

  function verifyStep2() {
    const isCorrect = orderedAttendus.every((item, idx) => item.orderNumber === idx + 1);

    if (!isCorrect) {
      onError();
      setErrorMsg(
        "❌ Ordre spiralaire erroné ! Rappel de la progression (p. 20, 24, 50, 56, 74) : les attendus numériques démarrent en P3, les symboles de logigramme en P5, la distinction Algorithme/Programme avec boucles en P6, et le binaire/obsolescence en S2."
      );
      return;
    }

    setErrorMsg("");
    setStep2Validated(true);
    setActiveStep(3);
  }

  function togglePole(poleName: string) {
    setSelectedPoles((prev) =>
      prev.includes(poleName) ? prev.filter((p) => p !== poleName) : [...prev, poleName]
    );
    setErrorMsg("");
  }

  function verifyStep3() {
    // Expected 4 poles from page 18: Manuel, Technique, Technologique, Numérique
    const expectedPoles = ["Manuel", "Technique", "Technologique", "Numérique"];
    const has4CorrectPoles =
      selectedPoles.length === 4 && expectedPoles.every((p) => selectedPoles.includes(p));

    if (!has4CorrectPoles) {
      onError();
      setErrorMsg(
        "❌ Pôles incorrects ! Selon la page 18 du référentiel, quels sont les 4 pôles constitutifs de la culture commune polytechnique du Tronc Commun ?"
      );
      return;
    }

    const cleanWord = synthesisWord.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (cleanWord !== "TRONC COMMUN" && cleanWord !== "TRONCCOMMUN" && cleanWord !== "FMTTN") {
      onError();
      setErrorMsg("❌ Code d'armement final incorrect. Tapez « TRONC COMMUN » (le socle légal de la réforme p. 2-18).");
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
              <span className="text-xs uppercase tracking-widest font-mono text-red-400">Sas de Propulsion Finale • Niveau 6 (Excellence Didactique)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                ÉPREUVE FINALE DE SYNTHÈSE TRANSVERSALE
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Armement Hyperspatial : Le Grand Test Didactique FMTTN
            </h2>
            <p className="text-sm text-slate-300">
              Pour initier le saut hyperspatial et sauver les 1 450 passagers, vous devez franchir 3 échelons de haute exigence : <strong>Diagnostic de séquences</strong>, <strong>Spirale curriculaire</strong> et <strong>Pôles polytechniques</strong> (p. 18-74).
            </p>
          </div>
        </div>

        <button
          onClick={() => openPdf(18)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-bold transition shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-red-400" />
          <span>Consulter Référentiel p. 18-25</span>
        </button>
      </div>

      {/* 3 STEPS PROGRESS BAR */}
      <div className="grid grid-cols-3 gap-3">
        <div
          onClick={() => step1Validated && setActiveStep(1)}
          className={`p-3 rounded-xl border text-center transition cursor-pointer ${
            activeStep === 1
              ? "bg-red-950/60 border-red-500 text-red-200 ring-2 ring-red-500/30"
              : step1Validated
              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
              : "bg-slate-900/60 border-slate-800 text-slate-500"
          }`}
        >
          <div className="text-[10px] font-mono font-bold uppercase">Échelon 1</div>
          <div className="text-xs font-bold truncate">Diagnostic de Séquences</div>
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
          <div className="text-xs font-bold truncate">Les 4 Pôles & Code d'Armement</div>
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
              <strong> Cliquez sur la SEULE séquence qui répond rigoureusement aux attendus et principes du Tronc Commun FMTTN</strong> (p. 20-25).
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
           ÉCHELON 2 : LA SPIRALE CURRICULAIRE (ORDONNANCEMENT P3-S2)
        ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl animate-fade-in">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Échelon 2 : La Logique Spiralaire du Tronc Commun (p. 20, 24, 50, 56, 74)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Le référentiel proscrit les ruptures et les sauts conceptuels brutaux. Utilisez les flèches ▲ et ▼ pour <strong>ordonner ces 4 attendus officiels selon leur niveau exact d'apparition dans le cursus (du plus précoce au plus avancé)</strong> :
            </p>
          </div>

          <div className="space-y-3">
            {orderedAttendus.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center gap-4 transition hover:border-amber-500/50"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {item.levelBadge}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono italic">{item.curriculumRef}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{item.attenduText}</p>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveAttendu(idx, "up")}
                    disabled={idx === 0 || step2Validated}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600 disabled:opacity-20 text-white transition cursor-pointer"
                    title="Monter"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveAttendu(idx, "down")}
                    disabled={idx === orderedAttendus.length - 1 || step2Validated}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600 disabled:opacity-20 text-white transition cursor-pointer"
                    title="Descendre"
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
           ÉCHELON 3 : LES 4 PÔLES DU PROFIL DE SORTIE & CODE D'ARMEMENT
        ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl animate-fade-in">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>Échelon 3 : Les 4 Pôles Polytechniques & L'Armement Final (p. 18-21)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              La formation commune vise l'émancipation citoyenne par la complémentarité de 4 pôles.
              <strong> Cochez exactement les 4 pôles officiels constitutifs de la discipline (p. 18)</strong> :
            </p>
          </div>

          {/* 6 Choices (4 correct, 2 distractors) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: "Manuel", desc: "Intelligence du geste & façonnage de matières (p. 18)" },
              { name: "Bureautique Propriétaire", desc: "Apprentissage passif de logiciels commerciaux (Distracteur)" },
              { name: "Technique", desc: "Procédures et actions opératoires (p. 18)" },
              { name: "Technologique", desc: "Usage raisonné et conception d'objets (p. 18)" },
              { name: "Théorie Pure", desc: "Enseignement abstrait sans travaux pratiques (Distracteur)" },
              { name: "Numérique", desc: "Pensée informatique, médias et sécurité (p. 18)" },
            ].map((p) => {
              const isChecked = selectedPoles.includes(p.name);
              return (
                <div
                  key={p.name}
                  onClick={() => togglePole(p.name)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    isChecked
                      ? "bg-emerald-950/60 border-emerald-400 text-white ring-2 ring-emerald-400/40 shadow-lg"
                      : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white">{p.name}</span>
                      <span className="text-xs font-mono">{isChecked ? "☑" : "☐"}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{p.desc}</p>
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
              Quel est le cadre institutionnel officiel de cette réforme polytechnique garantissant l'égalité des chances de P1 à S3 (p. 2-18) ?
            </p>
            <input
              type="text"
              value={synthesisWord}
              onChange={(e) => {
                setSynthesisWord(e.target.value);
                setErrorMsg("");
              }}
              placeholder="Entrez les deux mots officiels..."
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
