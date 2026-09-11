"use client";

import { useState } from "react";
import { Wrench, CheckCircle, AlertTriangle, HelpCircle, ArrowRight, RotateCcw, Sparkles, Box, Check, ArrowDown } from "lucide-react";

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
  correctExplanation: string;
};

const ITEMS_POOL: WorkshopItem[] = [
  {
    id: "tronc",
    name: "Tronc de chêne ardennais brut",
    icon: "🪵",
    pupilContext: "Emma (S1) : Arbre abattu non débité dans la réserve",
    expectedCategory: "MATIERE_PREMIERE",
    description: "Substance végétale issue directement de la nature, sans transformation par l'humain.",
    correctExplanation: "Matière Première : substance présente dans la nature à l'état brut (p. 99).",
  },
  {
    id: "planche",
    name: "Planche de contreplaqué poncée",
    icon: "📐",
    pupilContext: "Lucas (P6) : Planche découpée pour le toit du nichoir",
    expectedCategory: "MATERIAU",
    description: "Bois tranché en plis croisés, encollé et calibré pour être apte à la fabrication.",
    correctExplanation: "Matériau : matière première traitée et façonnée pour fabriquer des objets (p. 99).",
  },
  {
    id: "colle",
    name: "Colle à bois vinylique D3",
    icon: "🧴",
    pupilContext: "Noah (P5) : Adhésif d'assemblage des cloisons",
    expectedCategory: "CONSOMMABLE",
    description: "Produit de liaison qui durcit, s'use et s'intègre définitivement dans l'assemblage.",
    correctExplanation: "Consommable : élément qui se détruit ou s'intègre au fur et à mesure de l'usinage (p. 99).",
  },
  {
    id: "vis",
    name: "Boîte de vis à bois inox 4x35mm",
    icon: "🔩",
    pupilContext: "Noah (P5) : Organes de fixation mécanique",
    expectedCategory: "CONSOMMABLE",
    description: "Organes d'assemblage filetés intégrés de manière permanente dans l'ouvrage.",
    correctExplanation: "Consommable : s'intègre définitivement dans l'objet fini (p. 99).",
  },
  {
    id: "nichoir",
    name: "Nichoir d'observation terminé",
    icon: "🏠",
    pupilContext: "Zoé (S1) : Abri à oiseaux assemblé, lasuré et étanche",
    expectedCategory: "OUVRAGE",
    description: "Objet technique achevé, fonctionnel et répondant au cahier des charges initial.",
    correctExplanation: "Ouvrage : produit fini et opérationnel issu du processus de fabrication (p. 99).",
  },
  {
    id: "minerai",
    name: "Roche de minerai de fer brut",
    icon: "🪨",
    pupilContext: "Atelier métallurgie : Roche extraite du sol",
    expectedCategory: "MATIERE_PREMIERE",
    description: "Roche naturelle contenant le métal avant tout raffinage ou fusion.",
    correctExplanation: "Matière Première : ressource minérale non raffinée (p. 99).",
  },
  {
    id: "tole",
    name: "Feuille de tôle d'aluminium laminée",
    icon: "📑",
    pupilContext: "Atelier coque : Plaque métallique de 1 mm",
    expectedCategory: "MATERIAU",
    description: "Métal affiné et laminé en usine, prêt pour la découpe et le pliage.",
    correctExplanation: "Matériau : substance métallique mise en forme pour l'usinage (p. 99).",
  },
  {
    id: "support_tablette",
    name: "Support de tablette scolaire fini",
    icon: "📱",
    pupilContext: "Lucas (P6) : Pupitre inclinable pour la classe",
    expectedCategory: "OUVRAGE",
    description: "Objet technique finalisé et prêt à l'emploi par les élèves.",
    correctExplanation: "Ouvrage : réalisation technique complète répondant à un besoin (p. 99).",
  },
];

const BINS = [
  {
    id: "MATIERE_PREMIERE" as ItemCategory,
    label: "1. Matières Premières",
    sub: "Ressources brutes dans la nature (non façonnées)",
    icon: "🌿",
    bgColor: "bg-amber-950/30 border-amber-500/50 text-amber-300",
    activeColor: "ring-2 ring-amber-400 bg-amber-950/60",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  {
    id: "MATERIAU" as ItemCategory,
    label: "2. Matériaux",
    sub: "Matières traitées par l'humain pour fabriquer",
    icon: "🪵",
    bgColor: "bg-blue-950/30 border-blue-500/50 text-blue-300",
    activeColor: "ring-2 ring-blue-400 bg-blue-950/60",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  },
  {
    id: "CONSOMMABLE" as ItemCategory,
    label: "3. Consommables",
    sub: "Éléments qui s'usent, se fixent ou se détruisent",
    icon: "🔩",
    bgColor: "bg-rose-950/30 border-rose-500/50 text-rose-300",
    activeColor: "ring-2 ring-rose-400 bg-rose-950/60",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  },
  {
    id: "OUVRAGE" as ItemCategory,
    label: "4. Ouvrages",
    sub: "Objets techniques finis répondant à un besoin",
    icon: "📦",
    bgColor: "bg-emerald-950/30 border-emerald-500/50 text-emerald-300",
    activeColor: "ring-2 ring-emerald-400 bg-emerald-950/60",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
];

export function Room1Workshop({ onUnlock, onError, openPdf }: Props) {
  // Mapping: itemId -> assigned Category
  const [assignedBins, setAssignedBins] = useState<Record<string, ItemCategory>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Axiom phase
  const [sortingCompleted, setSortingCompleted] = useState(false);
  const [axiomWord, setAxiomWord] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [unlocked, setUnlocked] = useState(false);

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
      setErrorMsg(`⚠️ Il vous reste ${ITEMS_POOL.length - Object.keys(assignedBins).length} carte(s) à ranger dans les bacs d'atelier !`);
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
        `❌ ${errors.length} objet(s) sont mal classés : ${errors.slice(0, 2).join(", ")}... Consultez le glossaire du référentiel p. 99 pour vérifier la distinction.`
      );
      return;
    }

    setErrorMsg("");
    setSortingCompleted(true);
  }

  function verifyAxiom() {
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
              <span className="text-xs uppercase tracking-widest font-mono text-blue-400">Secteur 01</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                ATELIER DE FABRICATION SPATIALE (P. 99)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Jeu de Regroupement : Le Tri d'Atelier FMTTN
            </h2>
            <p className="text-xs text-slate-300">
              Comme sur LearningApps, rangez chaque objet d'atelier dans son bac officiel : <strong>Matière première, Matériau, Consommable ou Ouvrage</strong> (p. 99).
            </p>
          </div>
        </div>

        <button
          onClick={() => openPdf(99)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-200 text-xs font-bold transition shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <span>Consulter Référentiel p. 99</span>
        </button>
      </div>

      {/* UNLOCKED SUCCESS CARD */}
      {unlocked ? (
        <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-emerald-300">
            ATELIER DE FABRICATION PARFAITEMENT RÉGULÉ !
          </h3>
          <p className="text-sm text-emerald-200/90 max-w-xl mx-auto">
            Bravo ! Les 8 objets sont correctement classés selon les 4 statuts officiels du référentiel FMTTN (p. 99) et l'axiome didactique de l'objet technologique est déverrouillé.
          </p>
        </div>
      ) : !sortingCompleted ? (
        /* STEP 1: LEARNING APPS STYLE BIN SORTING GAME */
        <div className="space-y-6">
          {/* Instructions Bar */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-base">👉</span>
              <span>
                <strong>Comment jouer :</strong> Cliquez sur une carte ci-dessous, puis cliquez sur le bac correspondant pour la déposer.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-cyan-300 font-bold">
                Objets rangés : {Object.keys(assignedBins).length} / {ITEMS_POOL.length}
              </span>
              <button
                onClick={resetGame}
                className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Recommencer</span>
              </button>
            </div>
          </div>

          {/* 4 WORKSHOP BINS (ZONES DE DÉPÔT) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BINS.map((bin) => {
              const itemsInThisBin = ITEMS_POOL.filter((it) => assignedBins[it.id] === bin.id);
              const isTargetActive = selectedItemId !== null;

              return (
                <div
                  key={bin.id}
                  onClick={() => handleDropInBin(bin.id)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[220px] cursor-pointer ${bin.bgColor} ${
                    isTargetActive
                      ? "hover:ring-2 hover:ring-white hover:scale-[1.02] shadow-lg animate-pulse"
                      : ""
                  }`}
                >
                  <div>
                    {/* Bin Title Header */}
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-black text-sm text-white flex items-center gap-1.5">
                        <span>{bin.icon}</span>
                        <span>{bin.label}</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/80 font-bold">
                        {itemsInThisBin.length}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300/80 leading-tight mb-3">{bin.sub}</p>

                    {/* Dropped items list in this bin */}
                    <div className="space-y-1.5 min-h-[90px]">
                      {itemsInThisBin.map((item) => (
                        <div
                          key={item.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromBin(item.id);
                          }}
                          title="Cliquez pour retirer du bac"
                          className="flex items-center justify-between gap-1.5 p-2 rounded-xl bg-slate-950/90 border border-slate-700/80 hover:border-rose-500 text-slate-200 text-xs shadow-md transition group"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-base">{item.icon}</span>
                            <span className="truncate font-medium">{item.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 group-hover:text-rose-400 shrink-0">✕</span>
                        </div>
                      ))}

                      {itemsInThisBin.length === 0 && (
                        <div className="h-full flex items-center justify-center p-4 border border-dashed border-slate-700/50 rounded-xl text-[11px] text-slate-500 italic text-center">
                          {isTargetActive ? "Cliquez ici pour déposer la carte sélectionnée" : "Bac vide"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bin Drop hint button */}
                  {isTargetActive && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 text-center">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-white/10 px-3 py-1 rounded-lg">
                        Déposer ici ➔
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* UNASSIGNED ITEMS POOL (RÉSERVE DE CARTES À TRIER) */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <Box className="w-4 h-4" />
                <span>Cartes d'Objets d'Atelier à Classer ({unassignedItems.length} restantes) :</span>
              </span>
              {selectedItemId && (
                <span className="text-xs font-bold text-amber-300 animate-bounce">
                  Sélectionné ! Cliquez sur l'un des 4 bacs ci-dessus pour ranger cet objet.
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {unassignedItems.map((item) => {
                const isSelected = selectedItemId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectCard(item.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-blue-600 border-white text-white shadow-xl shadow-blue-500/50 scale-105 ring-2 ring-white"
                        : "bg-slate-950/90 border-slate-700 hover:border-blue-400 text-slate-300 hover:scale-[1.02]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{item.icon}</span>
                        <div className="font-bold text-xs leading-snug">{item.name}</div>
                      </div>
                      <p className="text-[10px] opacity-80 leading-tight mb-2">{item.description}</p>
                    </div>

                    <div className="text-[9px] font-mono opacity-70 border-t border-slate-800/80 pt-1">
                      {item.pupilContext}
                    </div>
                  </div>
                );
              })}

              {unassignedItems.length === 0 && (
                <div className="col-span-full p-6 text-center text-emerald-400 font-bold text-sm bg-emerald-950/30 border border-emerald-500/40 rounded-xl">
                  🎉 Tous les objets sont placés dans les bacs ! Cliquez sur « Vérifier le Tri » pour valider.
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Validation Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={verifySorting}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition cursor-pointer hover:scale-105"
            >
              <span>Vérifier le Tri des Bacs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: CLOZE / AXIOM VALIDATION (LearningApps "Texte à Trous") */
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl text-center max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
            Étape 2 • Texte à Trous Didactique
          </span>
          <h3 className="text-xl md:text-2xl font-black text-white">
            L'Axiome Fondateur du Tronc Commun FMTTN (p. 99)
          </h3>
          <p className="text-xs text-slate-300">
            Le tri des 4 catégories est parfait ! Pour sceller la conformité de l'atelier, complétez l'axiome officiel :
          </p>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-700 text-lg sm:text-xl font-bold text-slate-100 leading-relaxed">
            « C'est le geste qui est <span className="text-blue-400">technique</span>,
            <br />
            c'est l'objet qui est{" "}
            <span className="text-emerald-400 underline decoration-dashed">
              {axiomWord.trim() ? axiomWord.toUpperCase() : "_________"}
            </span>
            . »
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            <input
              type="text"
              value={axiomWord}
              onChange={(e) => {
                setAxiomWord(e.target.value);
                setErrorMsg("");
              }}
              placeholder="Tapez le mot manquant..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-center text-lg uppercase tracking-widest focus:outline-none focus:border-blue-500"
            />

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <div>{errorMsg}</div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSortingCompleted(false)}
                className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Retour aux Bacs
              </button>
              <button
                onClick={verifyAxiom}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer hover:scale-105"
              >
                Valider l'Épreuve d'Atelier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
