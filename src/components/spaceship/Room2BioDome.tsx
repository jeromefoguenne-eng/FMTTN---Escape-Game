"use client";

import { useState } from "react";
import { Leaf, CheckCircle, AlertTriangle, HelpCircle, ArrowRight, ArrowLeft, Cpu, Radio, Zap, Sparkles, Activity, Eye, Layers } from "lucide-react";

type Props = {
  onUnlock: () => void;
  onError: () => void;
  openPdf: (page?: number) => void;
};

type DemarcheStepCard = {
  id: string;
  orderNumber: number;
  title: string;
  sub: string;
  phaseName: string;
  icon: string;
  quoteDidactique: string;
};

const INITIAL_SHUFFLED_STEPS: DemarcheStepCard[] = [
  {
    id: "step-fab",
    orderNumber: 4,
    title: "Fabrication, Façonnage & Assemblage en Atelier",
    sub: "Mesurage, traçage, découpe sécurisée à la scie et vissage supervisé des panneaux",
    phaseName: "Phase 4 : Réalisation concrète",
    icon: "🛠️",
    quoteDidactique: "« L'élève met en œuvre les gestes techniques en respectant les règles d'ergonomie et de sécurité. » (p. 23)",
  },
  {
    id: "step-croquis",
    orderNumber: 2,
    title: "Recherche d'Idées, Croquis d'Intention & Schématisation",
    sub: "Dessin technique, cotations, vues 2D/3D et prévision des aérations pour l'aérobie",
    phaseName: "Phase 2 : Conception créative",
    icon: "✏️",
    quoteDidactique: "« L'élève imagine plusieurs solutions, confronte ses croquis avec ses pairs et modélise. » (p. 22)",
  },
  {
    id: "step-materiaux",
    orderNumber: 3,
    title: "Choix des Matériaux, Outils & Gamme de Fabrication",
    sub: "Sélection de bois non traité (évite les toxines), vis inox et ordonnancement des opérations",
    phaseName: "Phase 3 : Planification technique",
    icon: "🪵",
    quoteDidactique: "« L'élève choisit les matériaux adéquats et élabore l'ordre logique d'usinage. » (p. 23)",
  },
  {
    id: "step-besoin",
    orderNumber: 1,
    title: "Expression du Besoin & Cahier des Charges Éco-citoyen",
    sub: "Identifier le problème : automatiser le climat et l'arrosage de la serre pour nourrir les passagers",
    phaseName: "Phase 1 : Émergence du besoin",
    icon: "📋",
    quoteDidactique: "« Tout projet technologique débute par l'identification d'un besoin sociétal ou écologique réel. » (p. 22)",
  },
  {
    id: "step-eval",
    orderNumber: 5,
    title: "Test Fonctionnel, Éco-évaluation & Analyse du Cycle de Vie",
    sub: "Contrôle des capteurs, bilan de consommation énergétique et durabilité de la serre",
    phaseName: "Phase 5 : Validation & Durabilité",
    icon: "🔍",
    quoteDidactique: "« L'élève teste l'efficacité de son ouvrage et analyse son empreinte écologique globale. » (p. 23)",
  },
];

// DIGITAL COMPETENCY: INFORMATION CHAIN (CAPTEUR / TRAITEMENT / ACTIONNEUR)
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
    name: "Sonde d'humidité du sol",
    icon: "💧",
    expectedRole: "ENTREE",
    description: "Mesure la teneur en eau de la terre et transmet un signal électrique continu.",
    technicalRoleDesc: "CAPTEUR (Entrée) : Capte une grandeur physique du monde réel pour la transformer en données.",
  },
  {
    id: "temp_co2",
    name: "Sonde thermique & CO2",
    icon: "🌡️",
    expectedRole: "ENTREE",
    description: "Mesure la température de l'air et la concentration de gaz sous la coupole.",
    technicalRoleDesc: "CAPTEUR (Entrée) : Acquiert la température et le CO2 ambiant.",
  },
  {
    id: "ldr_light",
    name: "Capteur de luminosité (Photorésistance LDR)",
    icon: "☀️",
    expectedRole: "ENTREE",
    description: "Détecte la tombée de la nuit ou l'insuffisance de lumière solaire.",
    technicalRoleDesc: "CAPTEUR (Entrée) : Mesure le flux lumineux pour déclencher l'éclairage.",
  },
  {
    id: "microbit",
    name: "Carte programmable Micro:bit de l'école",
    icon: "🧠",
    expectedRole: "TRAITEMENT",
    description: "Le microcontrôleur central : exécute le code algorithmique et prend les décisions.",
    technicalRoleDesc: "TRAITEMENT (Unité centrale) : Analyse les données des capteurs et commande les actionneurs.",
  },
  {
    id: "valve",
    name: "Électrovanne d'arrosage automatique",
    icon: "🚿",
    expectedRole: "SORTIE",
    description: "Ouvre le circuit d'eau hydroponique sur consigne du microcontrôleur.",
    technicalRoleDesc: "ACTIONNEUR (Sortie) : Agit physiquement sur le système en libérant l'eau.",
  },
  {
    id: "fan",
    name: "Ventilateur d'extraction d'air chaud",
    icon: "💨",
    expectedRole: "SORTIE",
    description: "Évacue la chaleur excessive dès que la température dépasse 28°C.",
    technicalRoleDesc: "ACTIONNEUR (Sortie) : Agit mécaniquement en brassant l'air.",
  },
  {
    id: "led_uv",
    name: "Lampe horticole LED à spectre végétal",
    icon: "💡",
    expectedRole: "SORTIE",
    description: "Fournit aux plantes les longueurs d'ondes nécessaires à la photosynthèse.",
    technicalRoleDesc: "ACTIONNEUR (Sortie) : Transforme l'énergie électrique en lumière utile.",
  },
  {
    id: "lcd_screen",
    name: "Écran LCD d'affichage des paramètres",
    icon: "📟",
    expectedRole: "SORTIE",
    description: "Affiche en direct l'état de la serre et les alertes aux passagers.",
    technicalRoleDesc: "COMMUNIQUER (Sortie) : Transmet l'information traitée aux humains.",
  },
];

const COMPARTMENTS = [
  {
    role: "ENTREE" as DigitalComponentRole,
    title: "1. ACQUÉRIR • Les Capteurs (Entrées)",
    sub: "Mesurent les grandeurs du monde réel (eau, lumière, température)",
    icon: "📡",
    color: "border-blue-500/50 bg-blue-950/30 text-blue-300",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  },
  {
    role: "TRAITEMENT" as DigitalComponentRole,
    title: "2. TRAITER • Le Cerveau Algorithmique",
    sub: "Microcontrôleur qui analyse les données et décide selon le code",
    icon: "🧠",
    color: "border-amber-500/50 bg-amber-950/30 text-amber-300",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  {
    role: "SORTIE" as DigitalComponentRole,
    title: "3. AGIR • Les Actionneurs (Sorties)",
    sub: "Exécutent les ordres physiques (arrosage, aération, éclairage, écran)",
    icon: "⚙️",
    color: "border-emerald-500/50 bg-emerald-950/30 text-emerald-300",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
];

export function Room2BioDome({ onUnlock, onError, openPdf }: Props) {
  // Mode: "timeline" (Order the 5 steps) then "iot_chain" (Digital competency: Sensors / Processing / Actuators)
  const [activeTab, setActiveTab] = useState<"timeline" | "iot_chain">("timeline");

  // Timeline state: ordered list of steps
  const [orderedSteps, setOrderedSteps] = useState<DemarcheStepCard[]>(INITIAL_SHUFFLED_STEPS);
  const [timelineValidated, setTimelineValidated] = useState(false);

  // IoT Information Chain State
  const [assignedComponents, setAssignedComponents] = useState<Record<string, DigitalComponentRole>>({});
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isChainSimulating, setIsChainSimulating] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const unassignedComponents = IOT_COMPONENTS.filter((c) => !assignedComponents[c.id]);

  // Move step card up/down in timeline
  function moveStep(index: number, direction: "up" | "down") {
    if (timelineValidated) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedSteps.length) return;

    const copy = [...orderedSteps];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setOrderedSteps(copy);
    setErrorMsg("");
  }

  function verifyTimeline() {
    const isCorrect = orderedSteps.every((step, idx) => step.orderNumber === idx + 1);

    if (!isCorrect) {
      onError();
      setErrorMsg(
        "❌ Ordre chronologique erroné ! La démarche technologique (p. 22-23) débute par le Besoin, passe par les Croquis et les Matériaux, puis la Fabrication, et se clôture par l'Éco-évaluation."
      );
      return;
    }

    setErrorMsg("");
    setTimelineValidated(true);
    setActiveTab("iot_chain");
  }

  // IoT Component placement handlers
  function handleSelectComponent(id: string) {
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    } else {
      setSelectedComponentId(id);
      setErrorMsg("");
    }
  }

  function handleAssignRole(role: DigitalComponentRole) {
    if (!selectedComponentId) return;

    setAssignedComponents((prev) => ({
      ...prev,
      [selectedComponentId]: role,
    }));
    setSelectedComponentId(null);
    setErrorMsg("");
  }

  function handleRemoveComponent(id: string) {
    setAssignedComponents((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setErrorMsg("");
  }

  function verifyIoTChain() {
    if (Object.keys(assignedComponents).length < IOT_COMPONENTS.length) {
      setErrorMsg(`⚠️ Il reste ${IOT_COMPONENTS.length - Object.keys(assignedComponents).length} composant(s) à insérer dans la chaîne d'information.`);
      return;
    }

    const errors: string[] = [];
    IOT_COMPONENTS.forEach((comp) => {
      if (assignedComponents[comp.id] !== comp.expectedRole) {
        errors.push(comp.name);
      }
    });

    if (errors.length > 0) {
      onError();
      setErrorMsg(
        `❌ Erreur dans la chaîne numérique : ${errors.slice(0, 2).join(", ")} n'est pas au bon maillon ! Rappel : le Capteur mesure (Entrée), le Microcontrôleur décide (Traitement), et l'Actionneur agit physiquement (Sortie).`
      );
      return;
    }

    setErrorMsg("");
    setIsChainSimulating(true);

    setTimeout(() => {
      setIsChainSimulating(false);
      setUnlocked(true);
      onUnlock();
    }, 1800);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-800/40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Leaf className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-mono text-emerald-400">Secteur 02</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                BIO-DÔME & SYSTÈMES NUMÉRIQUES CONNECTÉS (P. 22-25)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Démarche Technologique & Chaîne d'Information de la Serre IoT
            </h2>
            <p className="text-xs text-slate-300">
              Compétences FMTTN : ordonnancez la démarche de projet, puis structurez la chaîne d'information d'un objet connecté (<strong>Capteurs ➔ Traitement ➔ Actionneurs</strong>).
            </p>
          </div>
        </div>

        <button
          onClick={() => openPdf(24)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>Consulter Référentiel Numérique</span>
        </button>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <button
          onClick={() => setActiveTab("timeline")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "timeline"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>1. Frise de la Démarche Technologique (5 phases)</span>
          {timelineValidated && <CheckCircle className="w-4 h-4 text-emerald-300" />}
        </button>

        <button
          onClick={() => setActiveTab("iot_chain")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "iot_chain"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>2. La Chaîne d'Information Numérique (Capteur / Traitement / Actionneur)</span>
          {unlocked && <CheckCircle className="w-4 h-4 text-emerald-300" />}
        </button>
      </div>

      {/* UNLOCKED SUCCESS CARD */}
      {unlocked ? (
        <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-emerald-300">
            DÉMARCHE DE PROJET & CHAÎNE NUMÉRIQUE SERRE VALIDÉES !
          </h3>
          <p className="text-sm text-emerald-200/90 max-w-xl mx-auto">
            Excellente maîtrise ! Vous avez structuré la démarche de projet (p. 22-23) et connecté les 3 maillons fondamentaux de la chaîne d'information : <strong>Acquérir (Capteurs) ➔ Traiter (Microcontrôleur) ➔ Agir (Actionneurs)</strong>. Les cultures hydroponiques de l'Arche sont sauvées !
          </p>
        </div>
      ) : activeTab === "timeline" ? (
        /* ─────────────────────────────────────────────────────────────
           TAB 1 : TIMELINE ORDERING (5 PHASES DE LA DÉMARCHE TECH)
        ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📋</span>
                <span>Réordonnez les 5 phases chronologiques de la Démarche Technologique (p. 22-23)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Utilisez les flèches ▲ et ▼ pour placer les cartes dans le bon ordre séquentiel, de l'émergence du projet jusqu'au bilan final.
              </p>
            </div>
            {timelineValidated && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ✓ Frise Validée
              </span>
            )}
          </div>

          {/* Cards List */}
          <div className="space-y-2.5">
            {orderedSteps.map((step, idx) => {
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                    timelineValidated
                      ? "bg-emerald-950/20 border-emerald-500/40"
                      : "bg-slate-950/90 border-slate-700/80 hover:border-emerald-500/50"
                  }`}
                >
                  {/* Position Badge */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 font-mono font-bold text-sm text-emerald-300 shrink-0 border border-slate-700">
                    {idx + 1}
                  </div>

                  {/* Icon */}
                  <span className="text-2xl shrink-0">{step.icon}</span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">{step.phaseName}</span>
                    </div>
                    <div className="font-bold text-sm text-white truncate">{step.title}</div>
                    <div className="text-xs text-slate-300 line-clamp-1">{step.sub}</div>
                  </div>

                  {/* Reordering Controls */}
                  {!timelineValidated && (
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => moveStep(idx, "up")}
                        disabled={idx === 0}
                        aria-label="Monter"
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs text-slate-200 transition cursor-pointer"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveStep(idx, "down")}
                        disabled={idx === orderedSteps.length - 1}
                        aria-label="Descendre"
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs text-slate-200 transition cursor-pointer"
                      >
                        ▼
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Action button */}
          <div className="flex items-center justify-between pt-3">
            <span className="text-xs text-slate-400 italic">
              « Le processus d'apprentissage et le droit à l'erreur priment sur le résultat immédiat » (p. 22)
            </span>
            <button
              onClick={timelineValidated ? () => setActiveTab("iot_chain") : verifyTimeline}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer hover:scale-105"
            >
              <span>{timelineValidated ? "Passer à la Serre Numérique" : "Valider l'Ordre Chronologique"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
           TAB 2 : DIGITAL COMPETENCY: INFORMATION CHAIN (IoT SERRE CONNECTÉE)
        ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400" />
                <span>La Chaîne d'Information d'un Système Automatisé (Volet Numérique FMTTN)</span>
              </h3>
              <p className="text-xs text-slate-300">
                Tout objet connecté ou système automatisé s'articule en 3 maillons : <strong>Acquérir (Capteurs) ➔ Traiter (Microcontrôleur) ➔ Agir (Actionneurs)</strong>. Rangez chaque composant de la serre dans son maillon fonctionnel.
              </p>
            </div>
            <div className="font-mono text-cyan-400 text-xs font-bold shrink-0">
              Composants placés : {Object.keys(assignedComponents).length} / {IOT_COMPONENTS.length}
            </div>
          </div>

          {/* 3 CHAIN COMPARTMENTS (ENTRÉE ➔ TRAITEMENT ➔ SORTIE) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {COMPARTMENTS.map((comp) => {
              const itemsInComp = IOT_COMPONENTS.filter((c) => assignedComponents[c.id] === comp.role);
              const isTargetActive = selectedComponentId !== null;

              return (
                <div
                  key={comp.role}
                  onClick={() => handleAssignRole(comp.role)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[260px] cursor-pointer ${comp.color} ${
                    isTargetActive ? "hover:scale-[1.02] ring-2 ring-white hover:border-white shadow-xl animate-pulse" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                        <span>{comp.icon}</span>
                        <span>{comp.title}</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/80 font-bold">
                        {itemsInComp.length}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300/80 leading-tight mb-3">{comp.sub}</p>

                    {/* Assigned components stack */}
                    <div className="space-y-1.5 min-h-[120px]">
                      {itemsInComp.map((item) => (
                        <div
                          key={item.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveComponent(item.id);
                          }}
                          title="Cliquez pour retirer"
                          className="flex items-center justify-between gap-1.5 p-2 rounded-xl bg-slate-950/90 border border-slate-700/80 hover:border-rose-500 text-slate-200 text-xs shadow-md transition group"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-base">{item.icon}</span>
                            <span className="truncate font-medium">{item.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 group-hover:text-rose-400 shrink-0">✕</span>
                        </div>
                      ))}

                      {itemsInComp.length === 0 && (
                        <div className="h-full flex items-center justify-center p-4 border border-dashed border-slate-700/50 rounded-xl text-[11px] text-slate-500 italic text-center">
                          {isTargetActive ? "Cliquez ici pour insérer le composant sélectionné" : "Aucun composant"}
                        </div>
                      )}
                    </div>
                  </div>

                  {isTargetActive && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 text-center">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-white/10 px-3 py-1 rounded-lg">
                        Insérer ici ➔
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* UNASSIGNED COMPONENTS POOL */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Composants de la Serre Automatisée à Ranger ({unassignedComponents.length} restants) :</span>
              </span>
              {selectedComponentId && (
                <span className="text-xs font-bold text-amber-300 animate-bounce">
                  Sélectionné ! Cliquez sur Entrée (Capteurs), Traitement (Cerveau) ou Sortie (Actionneurs).
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {unassignedComponents.map((comp) => {
                const isSelected = selectedComponentId === comp.id;
                return (
                  <div
                    key={comp.id}
                    onClick={() => handleSelectComponent(comp.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-cyan-600 border-white text-white shadow-xl scale-105 ring-2 ring-white"
                        : "bg-slate-900 border-slate-700 hover:border-cyan-400 text-slate-300 hover:scale-[1.02]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{comp.icon}</span>
                        <div className="font-bold text-xs leading-snug">{comp.name}</div>
                      </div>
                      <p className="text-[10px] opacity-80 leading-tight mb-2">{comp.description}</p>
                    </div>
                    <div className="text-[9px] font-mono opacity-60 border-t border-slate-800 pt-1">
                      FMTTN Volet Numérique
                    </div>
                  </div>
                );
              })}

              {unassignedComponents.length === 0 && (
                <div className="col-span-full p-4 text-center text-emerald-400 font-bold text-sm bg-emerald-950/30 border border-emerald-500/40 rounded-xl">
                  🎉 Tous les composants sont insérés dans la chaîne d'information ! Cliquez ci-dessous pour tester le circuit.
                </div>
              )}
            </div>
          </div>

          {/* Simulation Active Banner */}
          {isChainSimulating && (
            <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-500 text-cyan-200 text-xs flex items-center justify-center gap-3 animate-pulse">
              <Zap className="w-5 h-5 text-cyan-400 animate-bounce" />
              <span>Simulation en cours : Les capteurs transmettent les mesures ➔ Le microcontrôleur active les électrovannes et la ventilation !</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Validate Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={verifyIoTChain}
              disabled={isChainSimulating}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition cursor-pointer hover:scale-105 disabled:opacity-50"
            >
              <Cpu className="w-4 h-4" />
              <span>Activer la Serre Connectée & Rétablir le Secteur</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
