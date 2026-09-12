"use client";

import { useState } from "react";
import { Wrench, CheckCircle, AlertTriangle, HelpCircle, ArrowRight, RotateCcw, Sparkles, Box, Check, ArrowDown, GraduationCap } from "lucide-react";

type Props = {
  onUnlock: () => void;
  onError: () => void;
  openPdf: (page?: number) => void;
};

type ItemCategory = "MATIERE_PREMIERE" | "MATERIAU" | "CONSOMMABLE" | "OUVRAGE";

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
    id: "tronc",
    name: "Tronc de chêne brut non débité",
    icon: "🪵",
    pupilContext: "Emma (S1) : Bille de bois abattue en forêt ardennaise",
    expectedCategory: "MATIERE_PREMIERE",
    description: "Substance végétale issue directement de la nature, sans transformation industrielle humaine.",
    didacticTrap: "Matière première (p. 100) : ressource naturelle à l'état brut n'ayant subi aucun façonnage.",
  },
  {
    id: "papier_recycle",
    name: "Ramette de papier recyclé 80g",
    icon: "📄",
    pupilContext: "Lucas (P6) : Feuilles calibrées pour le dossier technique",
    expectedCategory: "MATERIAU",
    description: "Pâte à papier issue de fibres récupérées, broyée, lavée, pressée et séchée en usine pour être réutilisable.",
    didacticTrap: "Piège fréquent ! Même recyclé, le papier n'est plus une matière brute : c'est un matériau élaboré (p. 100).",
  },
  {
    id: "colle",
    name: "Flacon de colle vinylique à bois",
    icon: "🧴",
    pupilContext: "Noah (P5) : Adhésif d'assemblage des montants",
    expectedCategory: "CONSOMMABLE",
    description: "Produit de liaison liquide qui s'infiltre dans les pores du bois, polymérise et s'intègre de façon irréversible.",
    didacticTrap: "Consommable (p. 99) : produit à usage unique ou limité qui se détruit ou s'incorpore dans l'ouvrage.",
  },
  {
    id: "vis",
    name: "Boîte de vis à bois inox 4x35mm",
    icon: "🔩",
    pupilContext: "Noah (P5) : Organes filetés de fixation mécanique",
    expectedCategory: "CONSOMMABLE",
    description: "Éléments d'assemblage mécanique scellés à demeure dans l'ouvrage fini et non réutilisables.",
    didacticTrap: "Piège d'élèves ! Les vis ne sont pas du « matériel » : elles s'intègrent définitivement dans l'objet fabriqué (p. 99).",
  },
  {
    id: "argile",
    name: "Pain d'argile naturelle de carrière",
    icon: "🧱",
    pupilContext: "Zoé (S1) : Terre glaise brute pour mouler un creuset",
    expectedCategory: "MATIERE_PREMIERE",
    description: "Roche sédimentaire meuble extraite du sol, n'ayant encore subi ni cuisson ni adjuvant.",
    didacticTrap: "Matière première (p. 100) : substance géologique naturelle prête à être transformée.",
  },
  {
    id: "tasseau",
    name: "Tasseau de pin raboté 20x20mm",
    icon: "📐",
    pupilContext: "Lucas (P6) : Baguette de bois délignée et calibrée",
    expectedCategory: "MATERIAU",
    description: "Bois scié, séché en étuve et usiné aux quatre faces pour être apte à la construction.",
    didacticTrap: "Matériau (p. 100) : matière mise en forme par l'humain pour servir à la réalisation d'un ouvrage.",
  },
  {
    id: "nichoir",
    name: "Nichoir à mésanges terminé et lasuré",
    icon: "🏠",
    pupilContext: "Zoé (S1) : Abri écologique fonctionnel et étanche",
    expectedCategory: "OUVRAGE",
    description: "Objet technique finalisé, répondant au cahier des charges et prêt pour son cadre d'utilisation.",
    didacticTrap: "Ouvrage (p. 100) : objet résultant d'un travail de fabrication technique complet.",
  },
  {
    id: "support_tablette",
    name: "Pupitre scolaire ergonomique assemblé",
    icon: "📱",
    pupilContext: "Lucas (P6) : Support incliné prêt pour la classe",
    expectedCategory: "OUVRAGE",
    description: "Produit fini issu du processus complet de conception, sciage, ponçage et vissage.",
    didacticTrap: "Ouvrage (p. 100) : réalisation technique concrète satisfaisant un besoin utilisateur.",
  },
];

const BINS = [
  {
    id: "MATIERE_PREMIERE" as ItemCategory,
    label: "1. Matières Premières",
    sub: "Ressources à l'état brut dans la nature (sans façonnage industriel)",
    icon: "🌿",
    bgColor: "bg-amber-950/30 border-amber-500/50 text-amber-300",
    activeColor: "ring-2 ring-amber-400 bg-amber-950/60",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  {
    id: "MATERIAU" as ItemCategory,
    label: "2. Matériaux",
    sub: "Matières traitées et usinées par l'humain pour fabriquer des ouvrages",
    icon: "🪵",
    bgColor: "bg-blue-950/30 border-blue-500/50 text-blue-300",
    activeColor: "ring-2 ring-blue-400 bg-blue-950/60",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  },
  {
    id: "CONSOMMABLE" as ItemCategory,
    label: "3. Consommables",
    sub: "Éléments à usage unique ou limité qui se détruisent ou s'intègrent",
    icon: "🔩",
    bgColor: "bg-rose-950/30 border-rose-500/50 text-rose-300",
    activeColor: "ring-2 ring-rose-400 bg-rose-950/60",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  },
  {
    id: "OUVRAGE" as ItemCategory,
    label: "4. Ouvrages",
    sub: "Objets techniques finalisés résultant du travail et répondant au besoin",
    icon: "📦",
    bgColor: "bg-emerald-950/30 border-emerald-500/50 text-emerald-300",
    activeColor: "ring-2 ring-emerald-400 bg-emerald-950/60",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
];

export function Room1Workshop({ onUnlock, onError, openPdf }: Props) {
  const [assignedBins, setAssignedBins] = useState<Record<string, ItemCategory>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [sortingCompleted, setSortingCompleted] = useState(false);

  // Didactic question for Bloc 3 student teacher
  const [didacticChoice, setDidacticChoice] = useState<number | null>(null);
  const [axiomWord, setAxiomWord] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const selectedItem = ITEMS_POOL.find((i) => i.id === selectedItemId);
  const unassignedItems = ITEMS_POOL.filter((item) => !assignedBins[item.id]);

  function handleSelectCard(itemId: string) {
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    } else {
      setSelectedItemId(itemId);
      setErrorMsg("");
    }
  }

  function handleDropInBin(category: ItemCategory) {
    if (!selectedItemId) return;

    setAssignedBins((prev) => ({
      ...prev,
      [selectedItemId]: category,
    }));
    setSelectedItemId(null);
    setErrorMsg("");
  }

  function handleRemoveFromBin(itemId: string) {
    setAssignedBins((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
    setErrorMsg("");
  }

  function verifySorting() {
    if (Object.keys(assignedBins).length < ITEMS_POOL.length) {
      setErrorMsg(`⚠️ Il vous reste ${ITEMS_POOL.length - Object.keys(assignedBins).length} carte(s) à classer dans les 4 bacs d'atelier !`);
      return;
    }

    const errors: string[] = [];
    ITEMS_POOL.forEach((item) => {
      if (assignedBins[item.id] !== item.expectedCategory) {
        errors.push(item.name);
      }
    });

    if (errors.length > 0) {
      onError();
      setErrorMsg(
        `❌ Vigilance didactique : ${errors.length} objet(s) sont mal classés (${errors.slice(0, 2).join(", ")}...). Attention aux pièges : le papier recyclé n'est pas brut (c'est un matériau), et les vis ne sont pas du matériel (ce sont des consommables) ! Consultez p. 99-100.`
      );
      return;
    }

    setErrorMsg("");
    setSortingCompleted(true);
  }

  function verifyAxiomAndDidactics() {
    if (didacticChoice !== 1) {
      onError();
      setErrorMsg("❌ Diagnostic didactique incorrect ! Comment le référentiel p. 99-100 distingue-t-il rigoureusement un consommable d'un matériel/outil pour un élève de P5 ?");
      return;
    }

    const clean = axiomWord.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (clean !== "TECHNOLOGIQUE") {
      onError();
      setErrorMsg("❌ Mot manquant incorrect ! Relisez la page 99 : « C'est le geste qui est technique, c'est l'objet qui est... »");
      return;
    }

    setErrorMsg("");
    setUnlocked(true);
    onUnlock();
  }

  function resetGame() {
    setAssignedBins({});
    setSelectedItemId(null);
    setSortingCompleted(false);
    setDidacticChoice(null);
    setAxiomWord("");
    setErrorMsg("");
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-800/40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400">
            <Wrench className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-mono text-blue-400">Secteur 01 • Niveau 1 (Fondations)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                TERMINOLOGIE OFFICIELLE & DIDACTIQUE TECHNIQUE (P. 99-100)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Atelier FMTTN : Tri Didactique & Vigilance Épistémologique
            </h2>
            <p className="text-xs text-slate-300">
              Déjouez les pièges conceptuels d'élèves en classant les 8 ressources de fabrication (<strong>Matière première, Matériau, Consommable, Ouvrage</strong>), puis régulez la situation didactique de classe.
            </p>
          </div>
        </div>

        <button
          onClick={() => openPdf(99)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-200 text-xs font-bold transition shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <span>Consulter Glossaire p. 99-100</span>
        </button>
      </div>

      {/* UNLOCKED SUCCESS CARD */}
      {unlocked ? (
        <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-emerald-300">
            SECTEUR 01 SÉCURISÉ & TERMINOLOGIE MAÎTRISÉE !
          </h3>
          <p className="text-sm text-emerald-200/90 max-w-xl mx-auto">
            Remarquable ! Vous avez déjoué les confusions d'élèves sur le papier recyclé et les consommables, explicité la distinction avec le matériel et rétabli l'axiome fondateur : <em>« C'est le geste qui est technique, c'est l'objet qui est technologique »</em> (p. 99).
          </p>
        </div>
      ) : !sortingCompleted ? (
        /* ─────────────────────────────────────────────────────────────
           STEP 1 : THE LEARNINGAPPS CATEGORY SORTING GAME
        ───────────────────────────────────────────────────────────── */
        <div className="space-y-6">
          {/* Card Selection Pool */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-300">
                <Box className="w-4 h-4 text-blue-400" />
                <span>1. Ressources d'élèves en attente de classement ({unassignedItems.length} restantes) :</span>
              </div>
              <span className="text-[11px] text-blue-400 font-mono">
                {selectedItemId ? "👉 Cliquez sur un des 4 bacs ci-dessous pour déposer" : "Cliquez sur une ressource pour la sélectionner"}
              </span>
            </div>

            {unassignedItems.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold">
                ✓ Toutes les ressources sont placées dans les bacs ! Cliquez sur « Valider le Tri d'Atelier » ci-dessous pour tester votre rigueur didactique.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {unassignedItems.map((item) => {
                  const isSelected = selectedItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectCard(item.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-blue-600 border-white text-white scale-105 shadow-xl ring-2 ring-white"
                          : "bg-slate-950/90 border-slate-700/80 hover:border-blue-400 text-slate-200 hover:scale-[1.02]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="font-bold text-xs leading-tight">{item.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 italic mb-1.5">{item.pupilContext}</p>
                        <p className="text-[11px] opacity-80 leading-snug">{item.description}</p>
                      </div>
                      <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                        <span className={isSelected ? "text-amber-300 font-bold" : "text-blue-400"}>
                          {isSelected ? "Sélectionné ➔" : "Sélectionner"}
                        </span>
                        <ArrowDown className="w-3 h-3 opacity-50" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4 Interactive Drop Bins */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {BINS.map((bin) => {
              const itemsInBin = ITEMS_POOL.filter((i) => assignedBins[i.id] === bin.id);
              const isTargetActive = selectedItemId !== null;

              return (
                <div
                  key={bin.id}
                  onClick={() => isTargetActive && handleDropInBin(bin.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between min-h-[220px] ${bin.bgColor} ${
                    isTargetActive
                      ? "cursor-pointer hover:border-white hover:scale-[1.02] ring-2 ring-blue-500/40"
                      : "cursor-default"
                  }`}
                >
                  {/* Bin Header */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{bin.icon}</span>
                        <span className="font-bold text-xs sm:text-sm text-white">{bin.label}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900/80 text-slate-300 border border-slate-700">
                        {itemsInBin.length}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-75 leading-relaxed mb-3">{bin.sub}</p>
                  </div>

                  {/* Items currently in this bin */}
                  <div className="space-y-1.5 my-2 flex-1">
                    {itemsInBin.map((it) => (
                      <div
                        key={it.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromBin(it.id);
                        }}
                        title="Cliquez pour retirer du bac"
                        className="p-2 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-rose-500 flex items-center justify-between text-xs text-slate-200 transition cursor-pointer group"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span>{it.icon}</span>
                          <span className="truncate font-semibold">{it.name}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 group-hover:text-rose-400 font-mono shrink-0 ml-1">✕</span>
                      </div>
                    ))}

                    {itemsInBin.length === 0 && (
                      <div className="h-16 rounded-xl border border-dashed border-slate-700/60 flex items-center justify-center text-[11px] text-slate-500 italic text-center px-2">
                        {isTargetActive ? "👉 Cliquez ici pour déposer la carte" : "Bac vide"}
                      </div>
                    )}
                  </div>

                  {/* Drop Indicator */}
                  {isTargetActive && (
                    <button
                      onClick={() => handleDropInBin(bin.id)}
                      className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer mt-1"
                    >
                      Déposer dans ce bac ⇩
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Control Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={resetGame}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser les bacs</span>
            </button>

            <button
              onClick={verifySorting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition cursor-pointer hover:scale-105"
            >
              <Check className="w-4 h-4" />
              <span>Valider le Tri d'Atelier</span>
            </button>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
           STEP 2 : DIDACTIC REGULATION & FOUNDATIONAL AXIOM (P. 99-100)
        ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-blue-500/40 space-y-6 shadow-2xl animate-fade-in">
          {/* Sub-challenge A: Classroom Situation Analysis */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Étape 2A : Analyse Didactique d'une Conception d'Élève (P5-P6)</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 space-y-2">
              <p className="font-semibold text-white">
                💬 Situation en classe : Lors de l'inventaire de l'atelier, Noah (P5) range les vis et le pot de colle sur l'étagère de la perceuse et des scies en déclarant :
              </p>
              <blockquote className="pl-3 border-l-2 border-amber-400 text-amber-200/90 italic">
                « Tout ça, c'est du matériel pour bricoler ! La colle, la vis, le serre-joint et la perceuse, c'est exactement la même catégorie ! »
              </blockquote>
              <p className="text-slate-300 text-xs">
                En tant que futur enseignant de Bloc 3, quelle explication didactique basée sur le glossaire (p. 99-100) devez-vous apporter pour réguler cette conception erronée ?
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 1,
                  title: "Explication Didactique Normée (Glossaire p. 99-100)",
                  text: "La vis et la colle sont des consommables : des éléments à usage unique ou limité qui s'intègrent définitivement dans l'ouvrage ou se détruisent lors de la fabrication. La perceuse et le serre-joint sont du matériel/outils : des instruments durables réutilisables qui agissent sur la matière sans s'y incorporer.",
                  correct: true,
                },
                {
                  id: 2,
                  title: "Conception Vulgaire de Magasin",
                  text: "Noah a raison selon le sens commun car tout ce qui est vendu au rayon bricolage d'un magasin fait partie du matériel indifférencié.",
                  correct: false,
                },
                {
                  id: 3,
                  title: "Confusion Matière / Produit Fini",
                  text: "La vis est un matériau métallique, la colle est une matière chimique brute, et la perceuse est un ouvrage finalisé.",
                  correct: false,
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setDidacticChoice(opt.id);
                    setErrorMsg("");
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                    didacticChoice === opt.id
                      ? "bg-blue-950/60 border-blue-400 text-blue-100 ring-2 ring-blue-400/40"
                      : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div className="font-bold text-white mb-0.5">{opt.title}</div>
                  <p className="text-slate-300 leading-relaxed">{opt.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-challenge B: Foundational Axiom Cloze Test */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Étape 2B : L'Axiome Didactique Fondateur (Référentiel p. 99)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Le référentiel FMTTN affirme que le travail manuel et le travail intellectuel ne s'opposent en rien. Complétez la maxime officielle (p. 99) :
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs sm:text-sm text-slate-200 space-y-3">
              <div className="text-slate-300">
                « C'est le geste qui est technique, c'est l'objet qui est... »
              </div>
              <div className="flex justify-center items-center gap-2">
                <input
                  type="text"
                  value={axiomWord}
                  onChange={(e) => setAxiomWord(e.target.value)}
                  placeholder="MOT MANQUANT..."
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-blue-500/50 text-white font-bold text-center uppercase tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
                />
              </div>
              <p className="text-[11px] text-slate-400 italic">
                (Indice : 13 lettres, adjectif dérivé de technologie, voir p. 99)
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setSortingCompleted(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ← Revoir le tri des bacs
            </button>

            <button
              onClick={verifyAxiomAndDidactics}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition cursor-pointer hover:scale-105"
            >
              <Check className="w-4 h-4" />
              <span>Valider le Secteur 01 & Débloquer la Suite</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
