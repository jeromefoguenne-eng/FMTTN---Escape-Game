"use client";

import { useState } from "react";
import { Rocket, CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, KeyRound, Sparkles, Award, Layers, Compass, ArrowUp, ArrowDown, ArrowRight, Monitor, Code, Lock, Share2 } from "lucide-react";

type Props = {
  onSuccess: () => void;
  onError: () => void;
  openPdf: (page?: number) => void;
};

// ÉCHELON 1 : IDENTIFIER LA VRAIE SÉQUENCE D'APPRENTISSAGE DU NUMÉRIQUE
type SéquenceScenario = {
  id: number;
  title: string;
  context: string;
  isFMTTN: boolean;
  explanation: string;
};

const SEQUENCES_POOL: SéquenceScenario[] = [
  {
    id: 1,
    title: "Séquence A : Un quiz de grammaire sur tablette (Kahoot)",
    context: "Les élèves utilisent une tablette pour répondre à un questionnaire de grammaire et de conjugaison en français.",
    isFMTTN: false,
    explanation: "Ce n'est pas du cours de numérique (p. 24) : la tablette sert juste de support pour faire du français. Les élèves n'apprennent rien sur le fonctionnement du numérique en lui-même.",
  },
  {
    id: 2,
    title: "Séquence B : Recopier un texte imprimé dans un traitement de texte",
    context: "L'enseignant demande de recopier une poésie mot à mot dans un traitement de texte, sans expliquer la mise en page, les dossiers ni les raccourcis.",
    isFMTTN: false,
    explanation: "Simple frappe au clavier sans apprentissage (p. 44) : les élèves ne découvrent ni le vocabulaire du texte (saut de page, puces, marges) ni l'organisation des fichiers.",
  },
  {
    id: 3,
    title: "Séquence C : Regarder une vidéo sur l'histoire de l'ordinateur",
    context: "L'enseignant projette un documentaire vidéo pendant toute l'heure sans faire manipuler d'ordinateur ni programmer.",
    isFMTTN: false,
    explanation: "Cours passif sans pratique (p. 20) : le référentiel demande que les élèves manipulent, créent et expérimentent par eux-mêmes.",
  },
  {
    id: 4,
    title: "Séquence D : Créer une histoire interactive ou un mini-jeu sous Scratch",
    context: "Les élèves créent une animation : ils dessinent le schéma logique (logigramme), assemblent les blocs de code (boucles et conditions), utilisent des images libres de droits et apprennent à protéger leurs données personnelles.",
    isFMTTN: true,
    explanation: "✓ C'est le vrai cours de numérique FMTTN ! Il combine la programmation par blocs (Scratch), la recherche d'images libres de droits et la sécurité des données (p. 24-25).",
  },
];

// ÉCHELON 2 : LA PROGRESSION DES APPRENTISSAGES (DE P3 À S2)
type SpiraleAttendu = {
  id: string;
  orderNumber: number;
  themeTitle: string;
  attenduText: string;
  levelRevealed: string;
};

const INITIAL_SHUFFLED_ATTENDUS: SpiraleAttendu[] = [
  {
    id: "att-s2",
    orderNumber: 4,
    themeTitle: "Système binaire & Tableur avancé",
    attenduText: "Comprendre le codage binaire, coder un nombre (< 256) en binaire, utiliser les formules d'un tableur et comprendre ce qu'est l'obsolescence programmée.",
    levelRevealed: "2e Secondaire (S2 - p. 73-74)",
  },
  {
    id: "att-p5",
    orderNumber: 2,
    themeTitle: "Schéma logique (Logigramme) & e-Réputation",
    attenduText: "Reconnaître et utiliser les symboles d'un logigramme (début/fin ovale, action rectangle, choix losange) et chercher ce qui existe sur son identité en ligne.",
    levelRevealed: "5e Primaire (P5 - p. 50 & 57)",
  },
  {
    id: "att-p3",
    orderNumber: 1,
    themeTitle: "Vocabulaire d'Internet & Recherche de base",
    attenduText: "Utiliser correctement les mots moteur de recherche, barre de recherche, navigateur et Internet, et choisir des mots-clés simples.",
    levelRevealed: "3e Primaire (P3 - p. 24 & 37)",
  },
  {
    id: "att-p6",
    orderNumber: 3,
    themeTitle: "Algorithme vs Programme & Répétitions (Boucles)",
    attenduText: "Faire la différence entre un algorithme (la méthode) et un programme (le code), et repérer une suite d'actions que l'on peut remplacer par une boucle.",
    levelRevealed: "6e Primaire (P6 - p. 56)",
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
          ? `❌ Réponse incorrecte : ${chosen.explanation}`
          : "❌ Veuillez sélectionner la séquence qui apprend réellement le numérique aux élèves."
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
        "❌ L'ordre n'est pas encore bon. Classez les apprentissages du plus facile (accessible dès le début du primaire) au plus avancé (en secondaire)."
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
        "❌ Choix des domaines incorrect. Le volet numérique repose sur exactement 4 grands domaines officiels (p. 24-25)."
      );
      return;
    }

    const cleanInput = synthesisWord
      .trim()
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\s\-_']/g, "");

    const validPasswords = [
      "TRONCCOMMUN",
      "LETRONCCOMMUN",
      "NUMERIQUE",
      "AUNUMERIQUE",
      "EDUCATIONAUNUMERIQUE",
      "FMTTN",
    ];

    if (!validPasswords.includes(cleanInput)) {
      onError();
      setErrorMsg(
        "❌ Mot de passe incorrect. Indice : le nom officiel de l'école commune pour tous de la 1ère primaire à la 3e secondaire (2 mots : TRONC COMMUN)."
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
              <span className="text-xs uppercase tracking-widest font-mono text-red-400 font-bold">Épreuve Finale • Niveau 6</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                VOLET NUMÉRIQUE FMTTN (P. 24-25)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-0.5">
              Sas d'Armement : Le Grand Test de l'Enseignant de Numérique
            </h2>
            <p className="text-xs text-slate-300">
              Repérez la vraie activité de cours de numérique, classez les apprentissages par difficulté et validez les 4 domaines officiels du référentiel.
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
          <div className="text-[10px] font-mono font-bold uppercase">Étape 1</div>
          <div className="text-xs font-bold truncate">Reconnaître le Vrai Projet Numérique</div>
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
          <div className="text-[10px] font-mono font-bold uppercase">Étape 2</div>
          <div className="text-xs font-bold truncate">Classer par Difficulté (P3 ➔ S2)</div>
        </div>

        <div
          onClick={() => step2Validated && setActiveStep(3)}
          className={`p-3 rounded-xl border text-center transition cursor-pointer ${
            activeStep === 3
              ? "bg-red-950/60 border-red-500 text-red-200 ring-2 ring-red-500/30"
              : "bg-slate-900/60 border-slate-800 text-slate-500"
          }`}
        >
          <div className="text-[10px] font-mono font-bold uppercase">Étape 3</div>
          <div className="text-xs font-bold truncate">Les 4 Domaines & Code Final</div>
        </div>
      </div>

      {/* STEP CONTENT */}
      {activeStep === 1 ? (
        /* ─────────────────────────────────────────────────────────────
           ÉCHELON 1 : IDENTIFIER LA VRAIE SÉQUENCE
        ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl animate-fade-in">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-red-400" />
              <span>Étape 1 : Repérer la vraie activité d'apprentissage du numérique</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Vous observez 4 cours dans une école. 
              <strong> Cliquez sur la SEULE activité qui enseigne véritablement le numérique comme objet d'apprentissage</strong> (p. 24-25).
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
                      {isSelected ? "Activité Sélectionnée ➔" : "Cliquer pour choisir"}
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
              <span>Valider le Choix & Passer à l'Étape 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : activeStep === 2 ? (
        /* ─────────────────────────────────────────────────────────────
           ÉCHELON 2 : ORDONNANCEMENT (AUCUNE RÉPONSE NI CYCLE DONNÉ !)
        ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl animate-fade-in">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Étape 2 : Classer les apprentissages du plus simple au plus avancé</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Utilisez les flèches ▲ et ▼ pour <strong>ranger ces 4 compétences dans l'ordre d'apprentissage des élèves (de la 3e primaire jusqu'au début du secondaire)</strong> :
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
                    <div className="text-xs font-mono font-bold text-cyan-400 uppercase mb-1">
                      {item.themeTitle}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{item.attenduText}</p>
                    {step2Validated && (
                      <div className="mt-1 text-[11px] font-bold text-emerald-400">
                        Niveau officiel : {item.levelRevealed}
                      </div>
                    )}
                  </div>
                </div>

                {!step2Validated && (
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
                )}
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
              ← Revoir l'étape 1
            </button>

            <button
              onClick={verifyStep2}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer hover:scale-105"
            >
              <span>Valider l'Ordre & Passer à l'Étape 3</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
           ÉCHELON 3 : LES 4 DOMAINES DU NUMÉRIQUE & CODE
        ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl animate-fade-in">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>Étape 3 : Les 4 Domaines Officiels du Numérique (p. 24-25)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Le volet numérique organise les apprentissages autour de 4 grands axes.
              <strong> Cochez exactement les 4 domaines officiels du référentiel</strong> :
            </p>
          </div>

          {/* 6 Choices (4 correct, 2 distractors) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                name: "Informations et données",
                icon: "📊",
                desc: "Recherche sur le Web, fiabilité des sources, matériel, logiciels, fichiers et stockage (p. 24)",
              },
              {
                name: "Bureautique commerciale payante",
                icon: "💼",
                desc: "Apprentissage obligatoire d'une marque de logiciel privé (Piège : non demandé par l'école)",
              },
              {
                name: "Communication et collaboration",
                icon: "💬",
                desc: "Messagerie, e-mails, travail en équipe, réseaux et politesse en ligne (nétiquette) (p. 24)",
              },
              {
                name: "Création de contenus",
                icon: "💻",
                desc: "Traitement de texte, tableur, multimédia, logigrammes et programmation par blocs (p. 25)",
              },
              {
                name: "Formation purement PAR le numérique",
                icon: "📺",
                desc: "Utiliser l'ordinateur seulement comme une télévision pour d'autres matières (Piège p. 24)",
              },
              {
                name: "Sécurité",
                icon: "🛡️",
                desc: "Protection de sa vie privée et de ses données, mot de passe, pièges du Web et respect d'autrui (p. 25)",
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
              Code de Déverrouillage Final
            </span>
            <p className="text-xs text-slate-300">
              Quel est le nom officiel de cette réforme scolaire qui offre la même formation de la 1ère primaire à la 3e secondaire (p. 2-18) ?
            </p>
            <input
              type="text"
              value={synthesisWord}
              onChange={(e) => {
                setSynthesisWord(e.target.value);
                setErrorMsg("");
              }}
              placeholder="Entrez le mot de passe (ex: TRONC COMMUN)..."
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
              ← Revoir l'étape 2
            </button>

            <button
              onClick={verifyStep3}
              disabled={isLaunching}
              className="py-4 px-8 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:via-rose-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl shadow-red-600/40 transition cursor-pointer hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Rocket className="w-5 h-5 animate-bounce" />
              <span>{isLaunching ? "Lancement en cours..." : "ENCLENCHER LE SAUT HYPERSPATIAL FINAL ➔"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
