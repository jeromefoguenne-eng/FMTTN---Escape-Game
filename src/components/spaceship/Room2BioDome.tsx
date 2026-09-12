"use client";

import { useState } from "react";
import { Search, CheckCircle, AlertTriangle, HelpCircle, ArrowRight, ArrowLeft, Cpu, Radio, Zap, Sparkles, Activity, Eye, Layers, GraduationCap, Globe, Check } from "lucide-react";

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
  phaseName: string;
  icon: string;
  quoteDidactique: string;
  didacticRationale: string;
};

const INITIAL_SHUFFLED_STEPS: SearchStepCard[] = [
  {
    id: "step-intention",
    orderNumber: 3,
    title: "Identification de l'Intention des Éléments de la Page Web",
    sub: "Distinguer contenus d'information, encarts promotionnels, cookies et annonces sponsorisées",
    phaseName: "Étape 3 : Détection d'intention",
    icon: "🎯",
    quoteDidactique: "« L'élève identifie l'intention de chaque élément figurant sur une page Web : informer, vendre, séduire, convaincre... » (p. 43, 73)",
    didacticRationale: "Apprentissage clé pour ne pas confondre un résultat de recherche éditorial avec un lien publicitaire rémunéré.",
  },
  {
    id: "step-requete",
    orderNumber: 2,
    title: "Requête Ciblée dans le Moteur de Recherche avec Opérateurs",
    sub: "Utiliser la barre de recherche avec des combinaisons de mots et des filtres précis",
    phaseName: "Étape 2 : Interrogation ciblée",
    icon: "🔍",
    quoteDidactique: "« L'élève utilise des outils de recherche dont des moteurs de recherche, en considérant leurs spécificités. » (p. 37, 43)",
    didacticRationale: "Proscrire les phrases complètes en langage naturel au profit de requêtes structurées et ciblées.",
  },
  {
    id: "step-orga",
    orderNumber: 5,
    title: "Organisation, Sauvegarde Structurée & Citation Éthique",
    sub: "Nommer le fichier avec méthode, classer dans l'arborescence et mentionner la source",
    phaseName: "Étape 5 : Structuration & Droits",
    icon: "📁",
    quoteDidactique: "« L'élève organise des fichiers numériques avec méthode et cite la source dans le respect des droits. » (p. 43, 63)",
    didacticRationale: "La recherche ne s'arrête pas à la lecture : elle implique la gestion documentaire et le respect de la paternité de l'œuvre.",
  },
  {
    id: "step-besoin",
    orderNumber: 1,
    title: "Formulation du Besoin d'Information & Mots-Clés Pertinents",
    sub: "Définir la question de recherche et extraire les concepts pivots sans bruit documentaire",
    phaseName: "Étape 1 : Cadrage du besoin",
    icon: "💡",
    quoteDidactique: "« Déterminer un ou plusieurs mot(s)-clé(s) pertinent(s) pour effectuer une recherche. » (p. 37, 43)",
    didacticRationale: "Sans questionnement préalable clair, l'élève se noie dans l'infobésité du Web sans objectif d'apprentissage.",
  },
  {
    id: "step-critique",
    orderNumber: 4,
    title: "Évaluation Critique de la Source (Auteur, Date & Croisement)",
    sub: "Vérifier la fiabilité du site (.be, .org), la date de mise à jour et croiser 2 sources",
    phaseName: "Étape 4 : Validation critique",
    icon: "⚖️",
    quoteDidactique: "« Identifier des éléments nécessaires au questionnement quant à la fiabilité de l'information. » (p. 24, 73)",
    didacticRationale: "Développement de l'esprit critique d'élève-citoyen face aux rumeurs, fake news et biais d'autorité.",
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
    description: "Mesure la teneur en eau du milieu et transmet un signal électrique numérique.",
    technicalRoleDesc: "CAPTEUR (Entrée) : Capte une grandeur physique du milieu pour la convertir en signal de mesure.",
  },
  {
    id: "temp_co2",
    name: "Capteur thermique & CO2",
    icon: "🌡️",
    expectedRole: "ENTREE",
    description: "Mesure la température et la concentration de gaz dans l'environnement spatial.",
    technicalRoleDesc: "CAPTEUR (Entrée) : Acquiert la température ambiante sous forme de données numériques.",
  },
  {
    id: "ldr_light",
    name: "Photorésistance LDR (Luminosité)",
    icon: "☀️",
    expectedRole: "ENTREE",
    description: "Détecte le flux lumineux pour déterminer l'état jour/nuit.",
    technicalRoleDesc: "CAPTEUR (Entrée) : Convertit le flux lumineux en données d'entrée pour l'algorithme.",
  },
  {
    id: "microbit",
    name: "Carte programmable scolaire Micro:bit",
    icon: "🧠",
    expectedRole: "TRAITEMENT",
    description: "Le microcontrôleur central : exécute le programme algorithmique et traite les conditions.",
    technicalRoleDesc: "TRAITEMENT (Unité centrale) : Compare les valeurs reçues aux seuils programmés et déclenche les ordres.",
  },
  {
    id: "electrovanne",
    name: "Électrovanne d'irrigation",
    icon: "🚰",
    expectedRole: "SORTIE",
    description: "Vanne motorisée qui s'ouvre pour arroser lorsque l'algorithme détecte un sol trop sec.",
    technicalRoleDesc: "ACTIONNEUR (Sortie) : Convertit un ordre électrique du programme en action mécanique physique.",
  },
  {
    id: "led_strip",
    name: "Rampe de LED horticoles",
    icon: "💡",
    expectedRole: "SORTIE",
    description: "Éclairage artificiel activé automatiquement par le microcontrôleur en cas d'obscurité.",
    technicalRoleDesc: "ACTIONNEUR (Sortie) : Émet de la lumière en réponse au signal de commande du traitement.",
  },
  {
    id: "ecran_lcd",
    name: "Afficheur numérique LCD I2C",
    icon: "📟",
    expectedRole: "SORTIE",
    description: "Écran d'affichage restituant les températures et alertes aux utilisateurs.",
    technicalRoleDesc: "SORTIE (Restitution) : Traduit les données internes traitées en texte lisible pour l'humain.",
  },
  {
    id: "buzzer",
    name: "Avertisseur sonore (Buzzer)",
    icon: "🔔",
    expectedRole: "SORTIE",
    description: "Émet un bip d'alerte en cas de dépassement d'un seuil critique de température.",
    technicalRoleDesc: "ACTIONNEUR (Sortie) : Convertit un signal électrique en alerte acoustique.",
  },
];

export function Room2BioDome({ onUnlock, onError, openPdf }: Props) {
  const [phase, setPhase] = useState<"SEARCH_CHAIN" | "IOT_SYSTEM" | "DIDACTIC_QUESTION">("SEARCH_CHAIN");

  // PHASE 1 STATE : 5 STEPS ORDERING
  const [stepsList, setStepsList] = useState<SearchStepCard[]>(INITIAL_SHUFFLED_STEPS);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
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

  // Move step up / down in array
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
      setPhase1Error("L'ordonnancement de la recherche critique n'est pas correct. Relisez la progression officielle des pages 37, 43 et 73.");
      onError();
    }
  }

  // IoT Classification handlers
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
      setDidacticError("Régulation inadéquate : l'attendu de la page 73 exige d'apprendre aux élèves à questionner la fiabilité de l'information et à identifier l'intention de l'auteur.");
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
                Investigation Critique & Systèmes de Données
              </h2>
              <p className="text-sm text-slate-300">
                Maîtrisez la recherche d'information sur le Web (p. 37, 43, 73) et la chaîne de traitement cyber-physique (p. 24, 76-79).
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
            <span>Démarche de Recherche Critique</span>
          </button>
          <div className="w-10 h-0.5 bg-slate-800" />
          <button
            onClick={() => phase1Success && setPhase("IOT_SYSTEM")}
            disabled={!phase1Success}
            className={`flex items-center gap-2 transition ${phase === "IOT_SYSTEM" ? "text-emerald-400 font-bold" : phase2Success ? "text-emerald-500/70" : phase1Success ? "text-slate-300" : "text-slate-600 cursor-not-allowed"}`}
          >
            <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-current">2</span>
            <span>Chaîne Cyber-Physique IoT</span>
          </button>
          <div className="w-10 h-0.5 bg-slate-800" />
          <button
            onClick={() => phase2Success && setPhase("DIDACTIC_QUESTION")}
            disabled={!phase2Success}
            className={`flex items-center gap-2 transition ${phase === "DIDACTIC_QUESTION" ? "text-emerald-400 font-bold" : phase2Success ? "text-slate-300" : "text-slate-600 cursor-not-allowed"}`}
          >
            <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-current">3</span>
            <span>Régulation Didactique (Bloc 3)</span>
          </button>
        </div>
      </div>

      {/* PHASE 1 : ORDERING THE 5 RESEARCH STEPS */}
      {phase === "SEARCH_CHAIN" && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Ordonnancez les 5 étapes canoniques de la recherche documentaire numérique (p. 37, 43, 73)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Utilisez les flèches ↑ et ↓ pour ranger chronologiquement les étapes de l'apprentissage de l'élève.
              </p>
            </div>
            <button
              onClick={() => {
                setStepsList(INITIAL_SHUFFLED_STEPS);
                setPhase1Success(false);
                setPhase1Error("");
              }}
              className="text-xs text-slate-400 hover:text-white transition px-2 py-1 bg-slate-800 rounded-lg self-start sm:self-auto"
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
                      {step.phaseName}
                    </div>
                    <div className="text-sm font-bold text-white truncate">{step.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{step.sub}</div>
                    <div className="text-[11px] text-slate-500 italic mt-1 font-mono">{step.quoteDidactique}</div>
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
                <span>Valider la Chronologie de Recherche</span>
              </button>
            ) : (
              <button
                onClick={() => setPhase("IOT_SYSTEM")}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition animate-pulse cursor-pointer"
              >
                <span>Phase 1 Réussie · Passer à la Chaîne Cyber-Physique</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 2 : IOT 3 BINS (CAPTEUR, TRAITEMENT, ACTIONNEUR) */}
      {phase === "IOT_SYSTEM" && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Composants Connectés IoT à Classer dans la Chaîne d'Information (p. 24, 76-79)
                </h3>
              </div>
              <span className="text-xs text-slate-400">Cliquez sur un composant puis sur son rôle fonctionnel</span>
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
                label: "1. Acquérir / Entrées (Capteurs)",
                sub: "Convertissent une grandeur physique du milieu en données numériques",
                icon: "📡",
                color: "border-blue-500/50 bg-blue-950/30 text-blue-300",
              },
              {
                role: "TRAITEMENT" as DigitalComponentRole,
                label: "2. Traiter / Unité Centrale",
                sub: "Exécute l'algorithme, compare aux seuils et décide des actions",
                icon: "🧠",
                color: "border-purple-500/50 bg-purple-950/30 text-purple-300",
              },
              {
                role: "SORTIE" as DigitalComponentRole,
                label: "3. Agir / Sorties (Actionneurs)",
                sub: "Convertissent un ordre du microcontrôleur en action concrète ou affichage",
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
                      Déposer dans ce rôle
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
              Réinitialiser la chaîne
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
                <span>Valider la Chaîne ({Object.keys(placedIoT).length}/{IOT_COMPONENTS.length})</span>
              </button>
            ) : (
              <button
                onClick={() => setPhase("DIDACTIC_QUESTION")}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition animate-pulse cursor-pointer"
              >
                <span>Phase 2 Réussie · Passer à la Didactique (Étape 3)</span>
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
            <span>Étape 3 sur 3 · Didactique de l'Évaluation de l'Information Numérique</span>
          </div>

          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-white">Situation concrète en classe de P5 (Liège)</h3>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              « Lors d'un projet de recherche sur l'énergie, les élèves tapent "énergie solaire" sur un moteur de recherche. Le premier résultat est un encart publicitaire intitulé "Installez vos panneaux gratuitement !". Les élèves recopient textuellement le slogan commercial dans leur exposé sans vérifier la source. »
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              En tant que professeur de numérique, quelle consigne d'apprentissage conforme au référentiel (p. 43, 73) mettez-vous en place ?
            </div>

            {[
              {
                id: 1,
                label: "Option A : Mettre en œuvre la grille de questionnement critique officielle (intention, auteur, statut du site)",
                desc: "Faire identifier l'intention commerciale de la balise 'Annonce', apprendre à ignorer les liens sponsorisés payants et exiger le croisement de deux sites institutionnels ou encyclopédiques (.be, .org) avec identification de l'auteur (p. 43, 73).",
              },
              {
                id: 2,
                label: "Option B : Accepter le texte dès lors que les mots 'panneaux' et 'solaire' sont présents",
                desc: "Considérer que les élèves de primaire n'ont pas besoin de distinguer publicité et contenu scientifique, la manipulation du clavier étant la seule priorité.",
              },
              {
                id: 3,
                label: "Option C : Désinstaller le navigateur Internet et faire tout l'exposé à partir du dictionnaire papier",
                desc: "Renoncer à l'enseignement du numérique sous prétexte que le Web commercial est trop dangereux pour les élèves.",
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
              ← Revenir à la chaîne IoT
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
