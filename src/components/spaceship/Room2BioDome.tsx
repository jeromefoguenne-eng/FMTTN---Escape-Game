"use client";

import { useState } from "react";
import { Globe, CheckCircle, AlertTriangle, HelpCircle, ArrowRight, ArrowLeft, Cpu, Radio, Zap, Sparkles, Activity, Eye, Layers, GraduationCap, Check } from "lucide-react";

type Props = {
  onUnlock: () => void;
  onError: () => void;
  openPdf: (page?: number) => void;
};

type SearchStepCard = {
  id: string;
  orderNumber: number;
  title: string;
  sub: string;
  themeTag: string;
  icon: string;
};

const INITIAL_SHUFFLED_STEPS: SearchStepCard[] = [
  {
    id: "step-intention",
    orderNumber: 3,
    themeTag: "Repérer les publicités & l'intention",
    title: "Distinguer les résultats d'information et les liens publicitaires",
    sub: "Repérer les annonces payantes en haut de page et comprendre l'intention du site (vendre, informer ou convaincre).",
    icon: "🎯",
  },
  {
    id: "step-requete",
    orderNumber: 2,
    themeTag: "Lancer la recherche ciblée",
    title: "Taper les mots-clés choisis dans le moteur de recherche",
    sub: "Utiliser la barre de recherche avec des mots précis et des filtres simples sans taper de phrases entières.",
    icon: "🔍",
  },
  {
    id: "step-orga",
    orderNumber: 5,
    themeTag: "Enregistrer & citer l'auteur",
    title: "Enregistrer le document au bon endroit et citer la source",
    sub: "Donner un nom clair au fichier, le classer dans son dossier et indiquer le nom de l'auteur ou du site utilisé.",
    icon: "📁",
  },
  {
    id: "step-besoin",
    orderNumber: 1,
    themeTag: "Cadrer le sujet & choisir les mots-clés",
    title: "Définir ce que l'on cherche et choisir 2 ou 3 mots-clés",
    sub: "Clarifier la question de recherche et sélectionner des mots précis avant d'ouvrir le navigateur.",
    icon: "💡",
  },
  {
    id: "step-critique",
    orderNumber: 4,
    themeTag: "Vérifier la fiabilité du site",
    title: "Vérifier qui a écrit l'information et comparer avec un autre site",
    sub: "Vérifier l'auteur, la date de l'article, l'adresse du site (.be, .org, etc.) et croiser avec une 2e source.",
    icon: "⚖️",
  },
];

type DigitalComponentRole = "ENTREE" | "TRAITEMENT" | "SORTIE";

type IoTComponent = {
  id: string;
  name: string;
  icon: string;
  expectedRole: DigitalComponentRole;
  description: string;
  technicalRoleDesc: string;
};

const IOT_COMPONENTS: IoTComponent[] = [
  {
    id: "hum_soil",
    name: "Sonde d'humidité numérique",
    icon: "💧",
    expectedRole: "ENTREE",
    description: "Mesure la teneur en eau du sol et transmet un signal électrique mesurable.",
    technicalRoleDesc: "CAPTEUR (Entrée) : Mesure une grandeur physique du milieu.",
  },
  {
    id: "temp_co2",
    name: "Capteur de température & CO2",
    icon: "🌡️",
    expectedRole: "ENTREE",
    description: "Mesure la température et la qualité de l'air sous forme de données numériques.",
    technicalRoleDesc: "CAPTEUR (Entrée) : Mesure la température ambiante.",
  },
  {
    id: "ldr_light",
    name: "Capteur de lumière (LDR)",
    icon: "☀️",
    expectedRole: "ENTREE",
    description: "Détecte le niveau de lumière ambiante pour savoir s'il fait jour ou nuit.",
    technicalRoleDesc: "CAPTEUR (Entrée) : Mesure l'intensité lumineuse.",
  },
  {
    id: "microbit",
    name: "Carte programmable scolaire Micro:bit",
    icon: "🧠",
    expectedRole: "TRAITEMENT",
    description: "L'ordinateur central : exécute le programme, compare les mesures aux seuils et prend les décisions.",
    technicalRoleDesc: "TRAITEMENT : Analyse les données capteurs et déclenche les commandes.",
  },
  {
    id: "electrovanne",
    name: "Électrovanne d'arrosage",
    icon: "🚰",
    expectedRole: "SORTIE",
    description: "Vanne électrique qui s'ouvre pour arroser quand le programme détecte que la terre est trop sèche.",
    technicalRoleDesc: "ACTIONNEUR (Sortie) : Ouvre ou ferme l'eau sur ordre du programme.",
  },
  {
    id: "led_strip",
    name: "Lampe LED d'éclairage",
    icon: "💡",
    expectedRole: "SORTIE",
    description: "Éclairage qui s'allume automatiquement quand le capteur de lumière détecte l'obscurité.",
    technicalRoleDesc: "ACTIONNEUR (Sortie) : Produit de la lumière sur ordre du programme.",
  },
  {
    id: "ecran_lcd",
    name: "Écran d'affichage texte LCD",
    icon: "📟",
    expectedRole: "SORTIE",
    description: "Écran qui affiche la température et les messages d'état aux élèves.",
    technicalRoleDesc: "SORTIE : Affiche les informations traitées pour l'utilisateur.",
  },
  {
    id: "buzzer",
    name: "Buzzer sonore d'alarme",
    icon: "🔔",
    expectedRole: "SORTIE",
    description: "Émet un bip sonore quand la température dépasse un seuil d'alerte.",
    technicalRoleDesc: "ACTIONNEUR (Sortie) : Émet un signal sonore sur commande.",
  },
];

export function Room2BioDome({ onUnlock, onError, openPdf }: Props) {
  const [phase, setPhase] = useState<"SEARCH_CHAIN" | "IOT_SYSTEM" | "DIDACTIC_QUESTION">("SEARCH_CHAIN");

  // PHASE 1 STATE : 5 STEPS ORDERING
  const [stepsList, setStepsList] = useState<SearchStepCard[]>(INITIAL_SHUFFLED_STEPS);
  const [phase1Error, setPhase1Error] = useState("");
  const [phase1Success, setPhase1Success] = useState(false);

  // PHASE 2 STATE : IOT 3 BINS
  const [placedIoT, setPlacedIoT] = useState<Record<string, DigitalComponentRole>>({});
  const [selectedIoTId, setSelectedIoTId] = useState<string | null>(null);
  const [phase2Errors, setPhase2Errors] = useState<Record<string, boolean>>({});
  const [phase2Success, setPhase2Success] = useState(false);

  // PHASE 3 STATE : DIDACTIC QUESTION
  const [didacticChoice, setDidacticChoice] = useState<number | null>(null);
  const [didacticError, setDidacticError] = useState("");

  function handleMoveStep(index: number, direction: "UP" | "DOWN") {
    const targetIndex = direction === "UP" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stepsList.length) return;

    const updated = [...stepsList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setStepsList(updated);
    setPhase1Success(false);
    setPhase1Error("");
  }

  function handleVerifyStepsOrder() {
    const isOrdered = stepsList.every((step, idx) => step.orderNumber === idx + 1);

    if (isOrdered) {
      setPhase1Success(true);
      setPhase1Error("");
    } else {
      setPhase1Error("L'ordre des actions n'est pas correct. Réfléchissez à l'ordre logique d'une recherche sur Internet (du besoin initial jusqu'à la sauvegarde finale).");
      onError();
    }
  }

  function handleSelectIoT(id: string) {
    setSelectedIoTId(id === selectedIoTId ? null : id);
  }

  function handlePlaceIoT(role: DigitalComponentRole) {
    if (!selectedIoTId) return;
    setPlacedIoT((prev) => ({
      ...prev,
      [selectedIoTId]: role,
    }));
    setPhase2Errors((prev) => {
      const next = { ...prev };
      delete next[selectedIoTId];
      return next;
    });
    setSelectedIoTId(null);
  }

  function handleRemoveIoT(id: string) {
    setPlacedIoT((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setPhase2Errors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setPhase2Success(false);
  }

  function handleVerifyIoTChain() {
    let hasError = false;
    const errors: Record<string, boolean> = {};

    IOT_COMPONENTS.forEach((comp) => {
      const placedRole = placedIoT[comp.id];
      if (placedRole !== comp.expectedRole) {
        errors[comp.id] = true;
        hasError = true;
      }
    });

    setPhase2Errors(errors);

    if (hasError) {
      onError();
      setPhase2Success(false);
    } else {
      setPhase2Success(true);
    }
  }

  function handleVerifyDidactic() {
    if (didacticChoice === 1) {
      setDidacticError("");
      onUnlock();
    } else {
      setDidacticError("Régulation inadéquate : le référentiel demande d'apprendre aux élèves à repérer les publicités et à vérifier qui a écrit l'information.");
      onError();
    }
  }

  return (
    <div className="space-y-6 text-slate-100 max-w-5xl mx-auto pb-12">
      {/* HEADER WITH PDF LINK */}
      <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Secteur 02 · Niveau 2
                </span>
                <span className="text-xs text-slate-400 font-mono">Volet 2 : Numérique FMTTN</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                Recherche sur Internet & Systèmes Connectés
              </h2>
              <p className="text-sm text-slate-300">
                Guidez les élèves dans une recherche efficace et critique sur le Web (p. 37, 43, 73) et comprenez le fonctionnement d'un système connecté (p. 24, 76).
              </p>
            </div>
          </div>

          <button
            onClick={() => openPdf(43)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-medium transition self-start md:self-auto shadow-sm"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Consulter le Référentiel (p. 43, 73)</span>
          </button>
        </div>

        {/* PHASE SELECTOR */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
          <button
            onClick={() => setPhase("SEARCH_CHAIN")}
            className={`flex items-center gap-2 transition ${phase === "SEARCH_CHAIN" ? "text-emerald-400 font-bold" : phase1Success ? "text-emerald-500/70" : "text-slate-400"}`}
          >
            <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-current">1</span>
            <span>Étapes d'une Recherche sur le Web</span>
          </button>
          <div className="w-10 h-0.5 bg-slate-800" />
          <button
            onClick={() => phase1Success && setPhase("IOT_SYSTEM")}
            disabled={!phase1Success}
            className={`flex items-center gap-2 transition ${phase === "IOT_SYSTEM" ? "text-emerald-400 font-bold" : phase2Success ? "text-emerald-500/70" : phase1Success ? "text-slate-300" : "text-slate-600 cursor-not-allowed"}`}
          >
            <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-current">2</span>
            <span>Capteurs, Traitement & Sorties</span>
          </button>
          <div className="w-10 h-0.5 bg-slate-800" />
          <button
            onClick={() => phase2Success && setPhase("DIDACTIC_QUESTION")}
            disabled={!phase2Success}
            className={`flex items-center gap-2 transition ${phase === "DIDACTIC_QUESTION" ? "text-emerald-400 font-bold" : phase2Success ? "text-slate-300" : "text-slate-600 cursor-not-allowed"}`}
          >
            <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-current">3</span>
            <span>Situation de Classe</span>
          </button>
        </div>
      </div>

      {/* PHASE 1 : ORDERING THE 5 RESEARCH STEPS (NO STEP NUMBERS REVEALED!) */}
      {phase === "SEARCH_CHAIN" && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Remettez dans le bon ordre les 5 actions d'une recherche documentaire sur Internet</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Utilisez les flèches pour déplacer les cartes de la première action à la dernière.
              </p>
            </div>
            <button
              onClick={() => {
                setStepsList(INITIAL_SHUFFLED_STEPS);
                setPhase1Success(false);
                setPhase1Error("");
              }}
              className="text-xs text-slate-400 hover:text-white transition px-2.5 py-1 bg-slate-800 rounded-lg self-start sm:self-auto"
            >
              Mélanger à nouveau
            </button>
          </div>

          <div className="space-y-2.5">
            {stepsList.map((step, idx) => (
              <div
                key={step.id}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  phase1Success
                    ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-200"
                    : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center font-mono font-bold text-sm text-emerald-400 shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-2xl shrink-0">{step.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      {step.themeTag}
                    </div>
                    <div className="text-sm font-bold text-white truncate">{step.title}</div>
                    <div className="text-xs text-slate-300 mt-0.5">{step.sub}</div>
                  </div>
                </div>

                {!phase1Success && (
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => handleMoveStep(idx, "UP")}
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
                      onClick={() => handleMoveStep(idx, "DOWN")}
                      disabled={idx === stepsList.length - 1}
                      className={`p-1.5 rounded-md border text-xs font-bold transition ${
                        idx === stepsList.length - 1
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

          {phase1Error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{phase1Error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
            {!phase1Success ? (
              <button
                onClick={handleVerifyStepsOrder}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Valider l'Ordre des Actions</span>
              </button>
            ) : (
              <button
                onClick={() => setPhase("IOT_SYSTEM")}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition animate-pulse cursor-pointer"
              >
                <span>Ordre Validé ! Passer à la Chaîne d'Information</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 2 : IOT 3 BINS */}
      {phase === "IOT_SYSTEM" && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Classez chaque composant dans son rôle (p. 24, 76)
                </h3>
              </div>
              <span className="text-xs text-slate-400">Cliquez sur un composant puis sur son rôle</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {IOT_COMPONENTS.filter((c) => !placedIoT[c.id]).map((comp) => {
                const isSelected = selectedIoTId === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => handleSelectIoT(comp.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-emerald-600/30 border-emerald-400 ring-2 ring-emerald-400/50 shadow-lg scale-[1.02]"
                        : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{comp.icon}</span>
                      <span className="text-xs font-bold text-white truncate">{comp.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{comp.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3 ROLES : ENTREE / TRAITEMENT / SORTIE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                role: "ENTREE" as DigitalComponentRole,
                label: "1. Capteurs (Entrées)",
                sub: "Mesurent l'environnement (température, humidité, lumière)",
                icon: "📡",
                color: "border-blue-500/50 bg-blue-950/30 text-blue-300",
              },
              {
                role: "TRAITEMENT" as DigitalComponentRole,
                label: "2. Traitement (Microcontrôleur)",
                sub: "Exécute le programme et décide quoi faire",
                icon: "🧠",
                color: "border-purple-500/50 bg-purple-950/30 text-purple-300",
              },
              {
                role: "SORTIE" as DigitalComponentRole,
                label: "3. Actionneurs & Écrans (Sorties)",
                sub: "Agissent sur le réel ou affichent le résultat (moteurs, lampes, écran)",
                icon: "⚡",
                color: "border-amber-500/50 bg-amber-950/30 text-amber-300",
              },
            ].map((col) => {
              const compsInRole = IOT_COMPONENTS.filter((c) => placedIoT[c.id] === col.role);
              const isActive = selectedIoTId !== null;

              return (
                <div
                  key={col.role}
                  onClick={() => isActive && handlePlaceIoT(col.role)}
                  className={`border rounded-2xl p-4 flex flex-col justify-between min-h-[220px] transition-all ${col.color} ${
                    isActive ? "cursor-pointer hover:border-white/60 hover:scale-[1.01]" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{col.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-white leading-tight">{col.label}</h4>
                          <p className="text-[10px] text-slate-300 leading-tight mt-0.5">{col.sub}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-white/10 text-white">
                        {compsInRole.length}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {compsInRole.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400 italic">
                          {isActive ? "Cliquez ici pour ranger le composant" : "Aucun composant placé"}
                        </div>
                      ) : (
                        compsInRole.map((comp) => {
                          const hasErr = phase2Errors[comp.id];
                          return (
                            <div
                              key={comp.id}
                              className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                                hasErr
                                  ? "bg-red-950/80 border-red-500 text-red-200"
                                  : phase2Success
                                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                                  : "bg-slate-900/90 border-slate-700 text-slate-200"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span>{comp.icon}</span>
                                <span className="font-semibold truncate">{comp.name}</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveIoT(comp.id);
                                }}
                                className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white shrink-0"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {isActive && (
                    <div className="mt-2 text-center text-xs font-bold text-white animate-pulse">
                      Déposer dans cette catégorie
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setPlacedIoT({})}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              Réinitialiser
            </button>

            {!phase2Success ? (
              <button
                onClick={handleVerifyIoTChain}
                disabled={Object.keys(placedIoT).length !== IOT_COMPONENTS.length}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  Object.keys(placedIoT).length === IOT_COMPONENTS.length
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Valider le Classement ({Object.keys(placedIoT).length}/{IOT_COMPONENTS.length})</span>
              </button>
            ) : (
              <button
                onClick={() => setPhase("DIDACTIC_QUESTION")}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition animate-pulse cursor-pointer"
              >
                <span>Chaîne Validée ! Passer à la Situation de Classe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 3 : DIDACTIC QUESTION FOR BLOC 3 */}
      {phase === "DIDACTIC_QUESTION" && (
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Étape 3 sur 3 · Situation de Classe en Primaire</span>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-white">Situation concrète en classe de P5 (Liège)</h3>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              « Lors d'un travail sur l'énergie, des élèves tapent "énergie solaire" sur un moteur de recherche. Le tout premier résultat est une publicité intitulée : 
              <strong className="text-white font-semibold not-italic"> "Installez vos panneaux solaires gratuitement !"</strong>. 
              Les élèves recopient ce texte publicitaire dans leur exposé sans vérifier qui a écrit cette page. »
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              En tant que professeur de numérique, que faites-vous avec vos élèves (p. 43, 73) ?
            </div>

            {[
              {
                id: 1,
                label: "Option A : Apprendre à repérer la mention 'Annonce' et vérifier l'auteur sur un autre site",
                desc: "Montrer la balise publicitaire en haut des résultats, expliquer la différence entre un site commercial et un site d'information, et faire comparer avec un site officiel ou encyclopédique (.be, .org).",
              },
              {
                id: 2,
                label: "Option B : Accepter leur texte tant que le mot 'solaire' apparaît bien",
                desc: "Considérer qu'en primaire, le contenu scientifique importe peu et que seule la saisie du texte compte.",
              },
              {
                id: 3,
                label: "Option C : Interdire les ordinateurs et revenir au dictionnaire papier",
                desc: "Supprimer l'accès à Internet pour éviter tout risque de tomber sur des publicités.",
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDidacticChoice(opt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  didacticChoice === opt.id
                    ? "bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-400/40"
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
              onClick={() => setPhase("IOT_SYSTEM")}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← Revenir à la chaîne de composants
            </button>
            <button
              onClick={handleVerifyDidactic}
              disabled={didacticChoice === null}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                didacticChoice !== null
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-lg cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <span>Valider & Déverrouiller le Secteur 02</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
