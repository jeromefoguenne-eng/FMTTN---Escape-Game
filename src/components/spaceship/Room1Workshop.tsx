"use client";

import { useState } from "react";
import { HardDrive, CheckCircle, AlertTriangle, HelpCircle, ArrowRight, RotateCcw, Sparkles, Box, Check, ArrowDown, GraduationCap, Cpu, Layers, FileCode, Cloud } from "lucide-react";

type Props = {
  onUnlock: () => void;
  onError: () => void;
  openPdf: (page?: number) => void;
};

type ItemCategory = "HARDWARE" | "SOFTWARE" | "FICHIERS" | "CLOUD";

type WorkshopItem = {
  id: string;
  name: string;
  icon: string;
  pupilContext: string;
  expectedCategory: ItemCategory;
  description: string;
  didacticTrap: string;
};

const ITEMS_POOL: WorkshopItem[] = [
  {
    id: "ram",
    name: "Barrette de mémoire vive RAM (8 Go)",
    icon: "⚡",
    pupilContext: "Lucas (P5) : Composant branché sur la carte mère",
    expectedCategory: "HARDWARE",
    description: "Mémoire de travail temporaire et rapide de l'ordinateur : elle s'efface complètement dès qu'on coupe le courant.",
    didacticTrap: "Matériel (p. 63) : bien distinguer la mémoire vive (temporaire) du stockage permanent (disque).",
  },
  {
    id: "ssd",
    name: "Disque SSD interne NVMe (512 Go)",
    icon: "💾",
    pupilContext: "Zoé (S1) : Support de stockage physique du poste",
    expectedCategory: "HARDWARE",
    description: "Composant interne qui enregistre durablement tous les fichiers et logiciels, même quand l'ordinateur est éteint.",
    didacticTrap: "Matériel (p. 43, 63) : stockage physique présent à l'intérieur de la machine.",
  },
  {
    id: "os",
    name: "Système d'exploitation (Linux / Windows)",
    icon: "🐧",
    pupilContext: "Emma (P6) : Le programme qui gère toute la machine",
    expectedCategory: "SOFTWARE",
    description: "Le logiciel principal qui fait fonctionner la machine et permet d'exécuter tous les autres programmes.",
    didacticTrap: "Logiciel (p. 43) : utiliser correctement les termes logiciel, application et système d'exploitation.",
  },
  {
    id: "navigateur",
    name: "Navigateur Web (Firefox / Chromium)",
    icon: "🌐",
    pupilContext: "Noah (P4) : L'outil pour afficher les pages Web",
    expectedCategory: "SOFTWARE",
    description: "Logiciel installé sur l'appareil qui permet d'afficher et visiter les sites Web sur Internet.",
    didacticTrap: "Logiciel (p. 37, 43) : bien distinguer le navigateur (le logiciel) du moteur de recherche (le site en ligne).",
  },
  {
    id: "docx",
    name: "Document textuel : rapport_projet.docx",
    icon: "📄",
    pupilContext: "Emma (P6) : Dossier de synthèse rédigé en classe",
    expectedCategory: "FICHIERS",
    description: "Fichier texte créé avec un logiciel de traitement de texte (Word, LibreOffice Writer, etc.).",
    didacticTrap: "Fichiers (p. 63) : associer un type de fichier à son logiciel grâce à son extension (.docx).",
  },
  {
    id: "mp3",
    name: "Balado audio : interview_temoin.mp3",
    icon: "🎵",
    pupilContext: "Lucas (P5) : Enregistrement sonore pour la webradio",
    expectedCategory: "FICHIERS",
    description: "Fichier audio compressé contenant un enregistrement de son ou de musique.",
    didacticTrap: "Fichiers (p. 50, 63) : reconnaître le type de média (son, image, vidéo) grâce à l'extension (.mp3).",
  },
  {
    id: "cloud_drive",
    name: "Espace partagé Cloud de la Fédération",
    icon: "☁️",
    pupilContext: "Zoé (S1) : Répertoire en ligne accessible partout",
    expectedCategory: "CLOUD",
    description: "Espace de stockage sur Internet permettant de retrouver ses fichiers depuis n'importe quel ordinateur.",
    didacticTrap: "Cloud (p. 43) : faire la différence entre un enregistrement local (disque) et un enregistrement en ligne (cloud).",
  },
  {
    id: "ent_server",
    name: "Serveur de messagerie et ENT scolaire",
    icon: "🏛️",
    pupilContext: "Noah (P4) : Plateforme en ligne pour recevoir les devoirs",
    expectedCategory: "CLOUD",
    description: "Plateforme en ligne de l'école permettant aux enseignants et élèves d'échanger devoirs et messages.",
    didacticTrap: "Cloud (p. 24, 63) : comprendre qu'un service en ligne fonctionne sur des serveurs distants connectés.",
  },
];

const BINS = [
  {
    id: "HARDWARE" as ItemCategory,
    label: "1. Hardware (Matériel)",
    sub: "Composants physiques de la machine (RAM, SSD, processeur - p. 63)",
    icon: "💻",
    bgColor: "bg-blue-950/30 border-blue-500/50 text-blue-300",
    activeColor: "ring-2 ring-blue-400 bg-blue-950/60",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  },
  {
    id: "SOFTWARE" as ItemCategory,
    label: "2. Software (Logiciels & OS)",
    sub: "Programmes, système d'exploitation & applications (p. 43)",
    icon: "⚙️",
    bgColor: "bg-purple-950/30 border-purple-500/50 text-purple-300",
    activeColor: "ring-2 ring-purple-400 bg-purple-950/60",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  },
  {
    id: "FICHIERS" as ItemCategory,
    label: "3. Formats & Fichiers",
    sub: "Données encodées et extensions (.docx, .mp3, .svg - p. 63)",
    icon: "📁",
    bgColor: "bg-amber-950/30 border-amber-500/50 text-amber-300",
    activeColor: "ring-2 ring-amber-400 bg-amber-950/60",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  {
    id: "CLOUD" as ItemCategory,
    label: "4. Cloud & Réseau Distant",
    sub: "Stockage dématérialisé et serveurs distants en ligne (p. 43)",
    icon: "☁️",
    bgColor: "bg-emerald-950/30 border-emerald-500/50 text-emerald-300",
    activeColor: "ring-2 ring-emerald-400 bg-emerald-950/60",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
];

export function Room1Workshop({ onUnlock, onError, openPdf }: Props) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, ItemCategory>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [allCorrect, setAllCorrect] = useState(false);
  const [step, setStep] = useState<"SORT" | "DIDACTIC_QUESTION" | "AXIOM">("SORT");

  // Step 2 : Didactic analysis of pupil misconception
  const [didacticChoice, setDidacticChoice] = useState<number | null>(null);
  const [didacticError, setDidacticError] = useState("");

  // Step 3 : Axiom completion (p. 24)
  const [axiomWord, setAxiomWord] = useState("");
  const [axiomError, setAxiomError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const unplacedItems = ITEMS_POOL.filter((item) => !placements[item.id]);

  function handleSelectItem(itemId: string) {
    setSelectedItemId(itemId === selectedItemId ? null : itemId);
  }

  function handlePlaceItem(binId: ItemCategory) {
    if (!selectedItemId) return;
    setPlacements((prev) => ({
      ...prev,
      [selectedItemId]: binId,
    }));
    // Clear error for this item if any
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[selectedItemId];
      return next;
    });
    setSelectedItemId(null);
  }

  function handleRemoveItem(itemId: string) {
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setAllCorrect(false);
  }

  function handleReset() {
    setPlacements({});
    setValidationErrors({});
    setSelectedItemId(null);
    setAllCorrect(false);
  }

  function handleVerifySorting() {
    let hasError = false;
    const errors: Record<string, boolean> = {};

    ITEMS_POOL.forEach((item) => {
      const placedBin = placements[item.id];
      if (placedBin !== item.expectedCategory) {
        errors[item.id] = true;
        hasError = true;
      }
    });

    setValidationErrors(errors);

    if (hasError) {
      onError();
      setAllCorrect(false);
    } else {
      setAllCorrect(true);
    }
  }

  function handleProceedToDidactic() {
    if (allCorrect) {
      setStep("DIDACTIC_QUESTION");
    }
  }

  function handleVerifyDidactic() {
    // Correct choice is 1
    if (didacticChoice === 1) {
      setDidacticError("");
      setStep("AXIOM");
    } else {
      setDidacticError("Analyse incomplète : relisez les savoirs officiels de la page 63 (distinction mémoire vive / mémoire de stockage).");
      onError();
    }
  }

  function handleVerifyAxiom() {
    const cleaned = axiomWord
      .trim()
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Z]/g, "");

    if (cleaned === "PAR" || cleaned === "PARLE" || cleaned === "PARLENUMERIQUE") {
      setAxiomError("");
      setUnlocked(true);
      onUnlock();
    } else {
      setAxiomError("Mot incorrect ! Indice : Le référentiel (p. 24) indique qu'il s'agit d'une formation AU numérique et non pas [ PAR ] le numérique.");
      onError();
    }
  }

  return (
    <div className="space-y-6 text-slate-100 max-w-5xl mx-auto pb-12">
      {/* HEADER WITH PDF HELPER */}
      <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-400">
              <Cpu className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Secteur 01 · Niveau 1
                </span>
                <span className="text-xs text-slate-400 font-mono">Volet 2 : Numérique FMTTN</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                Architecture Numérique & Système Informatique
              </h2>
              <p className="text-sm text-slate-300">
                Maîtrisez les fondements de l'environnement numérique prescrits par le référentiel pour les classes de P3 à S3.
              </p>
            </div>
          </div>

          <button
            onClick={() => openPdf(43)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-medium transition self-start md:self-auto shadow-sm"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Consulter le Référentiel (p. 43, 63)</span>
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step === "SORT" ? "text-blue-400 font-bold" : allCorrect ? "text-emerald-400" : "text-slate-400"}`}>
            <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-current">1</span>
            <span>Tri d'Environnement Numérique</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-800" />
          <div className={`flex items-center gap-2 ${step === "DIDACTIC_QUESTION" ? "text-blue-400 font-bold" : step === "AXIOM" ? "text-emerald-400" : "text-slate-500"}`}>
            <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-current">2</span>
            <span>Diagnostic Didactique de l'Élève</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-800" />
          <div className={`flex items-center gap-2 ${step === "AXIOM" ? "text-blue-400 font-bold" : "text-slate-500"}`}>
            <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-current">3</span>
            <span>Axiome Fondateur (p. 24)</span>
          </div>
        </div>
      </div>

      {/* STEP 1: INTERACTIVE SORTING BINS */}
      {step === "SORT" && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Composants & Données à Classifier ({unplacedItems.length} restant{unplacedItems.length > 1 ? "s" : ""})
                </h3>
              </div>
              <span className="text-xs text-slate-400">Cliquez sur un élément puis sur le bac correspondant</span>
            </div>

            {unplacedItems.length === 0 ? (
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-center text-xs text-slate-400">
                Tous les éléments ont été rangés dans les 4 bacs numériques. Cliquez sur « Valider la Classification » ci-dessous.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {unplacedItems.map((item) => {
                  const isSelected = selectedItemId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-blue-600/30 border-blue-400 ring-2 ring-blue-400/50 shadow-lg scale-[1.02]"
                          : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-xs font-bold text-white truncate">{item.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">{item.description}</p>
                      <div className="mt-2 text-[10px] font-mono text-cyan-400/80">{item.pupilContext}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4 BINS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BINS.map((bin) => {
              const itemsInBin = ITEMS_POOL.filter((i) => placements[i.id] === bin.id);
              const isTargetActive = selectedItemId !== null;

              return (
                <div
                  key={bin.id}
                  onClick={() => isTargetActive && handlePlaceItem(bin.id)}
                  className={`border rounded-2xl p-4 transition-all flex flex-col justify-between min-h-[220px] ${bin.bgColor} ${
                    isTargetActive ? "cursor-pointer hover:border-white/60 hover:scale-[1.01]" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{bin.icon}</span>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-tight">{bin.label}</h4>
                          <p className="text-[11px] text-slate-300 leading-tight">{bin.sub}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-white/10 text-white">
                        {itemsInBin.length}
                      </span>
                    </div>

                    {/* ITEMS PLACED IN THIS BIN */}
                    <div className="mt-3 space-y-2">
                      {itemsInBin.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400 italic">
                          {isTargetActive ? "Cliquez ici pour placer l'élément sélectionné" : "Aucun élément dans ce bac"}
                        </div>
                      ) : (
                        itemsInBin.map((item) => {
                          const hasError = validationErrors[item.id];
                          return (
                            <div
                              key={item.id}
                              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                                hasError
                                  ? "bg-red-950/80 border-red-500 text-red-200"
                                  : allCorrect
                                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                                  : "bg-slate-900/90 border-slate-700 text-slate-200"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-lg shrink-0">{item.icon}</span>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold truncate">{item.name}</div>
                                  {hasError && (
                                    <div className="text-[10px] text-red-400 font-semibold mt-0.5">
                                      {item.didacticTrap}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveItem(item.id);
                                }}
                                className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition shrink-0"
                                title="Retirer de ce bac"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {isTargetActive && (
                    <div className="mt-3 pt-2 border-t border-white/10 text-center">
                      <span className="text-xs font-bold text-white flex items-center justify-center gap-1">
                        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                        Déposer ici
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CONTROLS */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-sm">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Réinitialiser les bacs</span>
            </button>

            <div className="flex items-center gap-3">
              {!allCorrect ? (
                <button
                  onClick={handleVerifySorting}
                  disabled={Object.keys(placements).length !== ITEMS_POOL.length}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    Object.keys(placements).length === ITEMS_POOL.length
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg cursor-pointer"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Valider la Classification ({Object.keys(placements).length}/{ITEMS_POOL.length})</span>
                </button>
              ) : (
                <button
                  onClick={handleProceedToDidactic}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition animate-pulse cursor-pointer"
                >
                  <span>Passer à l'Étape 2 : Diagnostic de l'Élève</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 : DIDACTIC QUESTION */}
      {step === "DIDACTIC_QUESTION" && (
        <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Étape 2 sur 3 · Analyse Didactique de Conception Erronée d'Élève</span>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Situation authentique en classe de P4 (Namur)</span>
            </h3>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              « Lucas (P4) panique devant son poste : l'ordinateur s'est éteint brusquement suite à un faux contact. Il s'exclame : 
              <strong className="text-white font-semibold not-italic"> "Tout mon devoir est effacé pour toujours parce que la mémoire de l'ordinateur se vide dès qu'on coupe l'électricité !"</strong>. 
              Or, Lucas avait cliqué sur le bouton 'Enregistrer' 5 minutes avant la coupure. »
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              En tant que professeur de numérique, quelle remédiation didactique conforme au référentiel (p. 63) apportez-vous ?
            </div>

            {[
              {
                id: 1,
                label: "Option A : Expliciter la distinction entre mémoire vive (RAM) et mémoire de stockage permanente (SSD/Disque)",
                desc: "Lucas confond la RAM (mémoire de travail volatile effacée à l'extinction) et le stockage de masse non volatile. Le fait d'avoir cliqué sur 'Enregistrer' a transféré le document de la RAM vers le disque permanent : son travail est préservé.",
              },
              {
                id: 2,
                label: "Option B : Confirmer la crainte de Lucas en lui apprenant à imprimer immédiatement chaque page rédigée",
                desc: "Valider l'idée qu'un ordinateur perd inévitablement ses données et imposer l'impression papier systématique comme seule sauvegarde fiable.",
              },
              {
                id: 3,
                label: "Option C : Lui expliquer que le document a été aspiré automatiquement sur le Cloud sans passer par le disque",
                desc: "Affirmer que tous les ordinateurs envoient automatiquement les fichiers sur les serveurs distants du Web même sans connexion réseau.",
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDidacticChoice(opt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  didacticChoice === opt.id
                    ? "bg-blue-950/60 border-blue-400 ring-2 ring-blue-400/40"
                    : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="text-xs font-bold text-white">{opt.label}</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{opt.desc}</div>
              </button>
            ))}
          </div>

          {didacticError && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{didacticError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep("SORT")}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← Revenir au tri
            </button>
            <button
              onClick={handleVerifyDidactic}
              disabled={didacticChoice === null}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                didacticChoice !== null
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <span>Valider la réponse didactique</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 : AXIOM OF VOLET NUMERIQUE (p. 24) */}
      {step === "AXIOM" && (
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Étape 3 sur 3 · La Définition Clé du Volet Numérique (p. 24)</span>
          </div>

          <div className="p-5 bg-slate-950/80 border border-emerald-500/30 rounded-xl space-y-3">
            <p className="text-sm text-slate-200 leading-relaxed">
              « Dès lors, le numérique ne doit pas être considéré, dans le cadre de ce référentiel, comme une aide à l’enseignement, mais comme un objet d’apprentissage pour lui-même. Il s’agit donc bien, ici, d’une formation <strong className="text-cyan-300 font-bold">AU</strong> numérique et non pas, <span className="underline decoration-emerald-400 decoration-2 font-black text-emerald-300">[ ??? ]</span> le numérique. »
            </p>
            <div className="text-[11px] font-mono text-slate-400">
              — Référentiel FMTTN, Volet 2 : Numérique, Enjeux et objectifs généraux, Page 24.
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Saisissez la préposition officielle manquante (en majuscules ou minuscules) :
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={axiomWord}
                onChange={(e) => setAxiomWord(e.target.value)}
                placeholder="Exemple : PAR"
                maxLength={10}
                className="px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 uppercase tracking-widest w-48"
              />
              <button
                onClick={handleVerifyAxiom}
                disabled={!axiomWord.trim()}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  axiomWord.trim()
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 shadow-lg cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                Valider & Déverrouiller le Secteur 01
              </button>
            </div>
          </div>

          {axiomError && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{axiomError}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <button
              onClick={() => setStep("DIDACTIC_QUESTION")}
              className="hover:text-white transition"
            >
              ← Revenir à l'étape 2
            </button>
            <button
              onClick={() => openPdf(24)}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Voir la page 24 du référentiel</span>
            </button>
          </div>
        </div>
      )}

      {unlocked && (
        <div className="p-6 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-center space-y-3 animate-fade-in shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-emerald-300">
            SECTEUR 01 SÉCURISÉ & STABILISÉ !
          </h3>
          <p className="text-xs text-emerald-200 max-w-lg mx-auto leading-relaxed">
            Félicitations ! Vous avez structuré l'architecture système (p. 43, 63), remédié à la confusion didactique de Lucas entre mémoire vive et mémoire permanente, et validé la définition clé de la formation <strong>AU</strong> numérique (p. 24).
          </p>
        </div>
      )}
    </div>
  );
}
