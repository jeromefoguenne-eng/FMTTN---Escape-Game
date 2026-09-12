"use client";

import { useState } from "react";
import { Leaf, CheckCircle, AlertTriangle, HelpCircle, ArrowRight, ArrowLeft, Cpu, Radio, Zap, Sparkles, Activity, Eye, Layers, GraduationCap } from "lucide-react";

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
  didacticRationale: string;
};

const INITIAL_SHUFFLED_STEPS: DemarcheStepCard[] = [
  {
    id: "step-fab",
    orderNumber: 4,
    title: "Fabrication, Façonnage & Assemblage en Atelier",
    sub: "Mesurage, traçage, sciage sécurisé et vissage des panneaux de la serre",
    phaseName: "Phase 4 : Réalisation concrète",
    icon: "🛠️",
    quoteDidactique: "« L'élève met en œuvre les gestes techniques en respectant les règles d'ergonomie et de sécurité. » (p. 23)",
    didacticRationale: "L'usinage ne commence que lorsque le plan et la gamme d'usinage sont validés pour éviter le gâchis.",
  },
  {
    id: "step-croquis",
    orderNumber: 2,
    title: "Recherche d'Idées, Croquis d'Intention & Schématisation",
    sub: "Dessin technique, cotations, vues 2D/3D et prévision des aérations pour le climat",
    phaseName: "Phase 2 : Conception créative",
    icon: "✏️",
    quoteDidactique: "« L'élève imagine plusieurs solutions, confronte ses croquis avec ses pairs et modélise. » (p. 22)",
    didacticRationale: "La schématisation permet de matérialiser la pensée avant de figer le choix de matière.",
  },
  {
    id: "step-materiaux",
    orderNumber: 3,
    title: "Choix des Matériaux, Outils & Gamme de Fabrication",
    sub: "Sélection de bois non traité (évite les toxines), visserie inox et ordonnancement logique",
    phaseName: "Phase 3 : Planification technique",
    icon: "🪵",
    quoteDidactique: "« L'élève choisit les matériaux adéquats et élabore l'ordre logique d'usinage. » (p. 23)",
    didacticRationale: "L'intention et la fonction technique dictent le matériau, jamais l'inverse.",
  },
  {
    id: "step-besoin",
    orderNumber: 1,
    title: "Expression du Besoin Authentique & Cahier des Charges",
    sub: "Identifier le problème réel : réguler l'humidité et nourrir les colons en circuit fermé",
    phaseName: "Phase 1 : Émergence du besoin",
    icon: "📋",
    quoteDidactique: "« Tout projet technologique débute par l'identification d'un besoin sociétal ou écologique réel. » (p. 22)",
    didacticRationale: "Proscrire le bricolage gratuit : l'apprentissage part d'un enjeu sociétal ou d'usage signifiant.",
  },
  {
    id: "step-eval",
    orderNumber: 5,
    title: "Test Fonctionnel, Éco-évaluation & Analyse du Cycle de Vie",
    sub: "Contrôle des capteurs, bilan de consommation énergétique et réparabilité de la serre",
    phaseName: "Phase 5 : Validation & Durabilité",
    icon: "🔍",
    quoteDidactique: "« L'élève teste l'efficacité de son ouvrage et analyse son empreinte écologique globale. » (p. 23)",
    didacticRationale: "Clôture critique : mesurer l'impact écologique (vivable), économique et social (p. 26).",
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
    name: "Sonde d'humidité du sol",
    icon: "💧",
    expectedRole: "ENTREE",
    description: "Mesure la teneur en eau de la terre et transmet un signal électrique continu.",
    technicalRoleDesc: "CAPTEUR (Entrée) : Capte une grandeur physique du milieu pour la convertir en signal de mesure.",
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
    description: "Détecte la tombée de la nuit ou l'insuffisance de flux lumineux.",
    technicalRoleDesc: "CAPTEUR (Entrée) : Convertit le flux lumineux en tension pour déclencher la consigne d'éclairage.",
  },
  {
    id: "microbit",
    name: "Carte programmable scolaire Micro:bit",
    icon: "🧠",
    expectedRole: "TRAITEMENT",
    description: "Le microcontrôleur central : exécute le programme algorithmique et décide selon les seuils.",
    technicalRoleDesc: "TRAITEMENT (Unité centrale) : Compare les valeurs capteurs aux seuils programmés et ordonne les sorties.",
  },
  {
    id: "valve",
    name: "Électrovanne d'arrosage hydroponique",
    icon: "🚿",
    expectedRole: "SORTIE",
    description: "Ouvre le circuit d'eau nutritive sur impulsion du microcontrôleur.",
    technicalRoleDesc: "ACTIONNEUR (Sortie) : Convertit l'ordre électrique en action mécanique sur le débit d'eau.",
  },
  {
    id: "fan",
    name: "Extracteur d'air / Ventilateur",
    icon: "💨",
    expectedRole: "SORTIE",
    description: "Évacue la surchauffe dès que la température mesurée dépasse 28°C.",
    technicalRoleDesc: "ACTIONNEUR (Sortie) : Brasse l'air pour évacuer l'excès thermique.",
  },
  {
    id: "led_uv",
    name: "Rampe LED horticole à spectre photosynthétique",
    icon: "💡",
    expectedRole: "SORTIE",
    description: "Fournit aux végétaux les longueurs d'ondes nécessaires à la croissance.",
    technicalRoleDesc: "ACTIONNEUR (Sortie) : Convertit l'énergie électrique en énergie lumineuse ciblée.",
  },
  {
    id: "lcd_screen",
    name: "Écran LCD d'affichage des paramètres",
    icon: "📟",
    expectedRole: "SORTIE",
    description: "Affiche en temps réel les données de température et l'état de la serre aux colons.",
    technicalRoleDesc: "RESTITUTION / SORTIE : Transmet l'information traitée aux humains sous forme lisible.",
  },
];

const COMPARTMENTS = [
  {
    role: "ENTREE" as DigitalComponentRole,
    title: "1. ACQUÉRIR • Les Capteurs (Entrées)",
    sub: "Transforment une grandeur physique du milieu (eau, lumière, chaleur) en signal électrique exploitable",
    icon: "📡",
    color: "border-blue-500/50 bg-blue-950/30 text-blue-300",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  },
  {
    role: "TRAITEMENT" as DigitalComponentRole,
    title: "2. TRAITER • L'Unité Algorithmique",
    sub: "Microcontrôleur qui analyse les données reçues, compare aux seuils et prend les décisions logiques",
    icon: "🧠",
    color: "border-amber-500/50 bg-amber-950/30 text-amber-300",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  {
    role: "SORTIE" as DigitalComponentRole,
    title: "3. AGIR & COMMUNIQUER • Les Actionneurs (Sorties)",
    sub: "Exécutent les ordres physiques réels (arroser, ventiler, éclairer) ou affichent l'information (écran LCD)",
    icon: "⚙️",
    color: "border-emerald-500/50 bg-emerald-950/30 text-emerald-300",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
];

export function Room2BioDome({ onUnlock, onError, openPdf }: Props) {
  const [activeTab, setActiveTab] = useState<"timeline" | "iot_chain">("timeline");

  const [orderedSteps, setOrderedSteps] = useState<DemarcheStepCard[]>(INITIAL_SHUFFLED_STEPS);
  const [timelineValidated, setTimelineValidated] = useState(false);

  const [assignedComponents, setAssignedComponents] = useState<Record<string, DigitalComponentRole>>({});
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isChainSimulating, setIsChainSimulating] = useState(false);

  // Spiral progression question for Bloc 3 teachers
  const [spiralChoice, setSpiralChoice] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const unassignedComponents = IOT_COMPONENTS.filter((c) => !assignedComponents[c.id]);

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
        "❌ Ordre chronologique erroné ! La démarche technologique (p. 22-23) débute obligatoirement par le Besoin sociétal, passe par les Croquis et les Matériaux, puis l'Usinage supervisé, et se conclut par l'Éco-évaluation de durabilité."
      );
      return;
    }

    setErrorMsg("");
    setTimelineValidated(true);
    setActiveTab("iot_chain");
  }

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
        `❌ Erreur dans la chaîne numérique : ${errors.slice(0, 2).join(", ")} n'est pas au bon maillon ! Rappel didactique : le Capteur mesure une grandeur physique (Entrée), le Microcontrôleur compare et décide (Traitement), et l'Actionneur/Écran agit ou affiche (Sortie).`
      );
      return;
    }

    if (spiralChoice !== 1) {
      onError();
      setErrorMsg("❌ Analyse de progression spiralaire incorrecte ! Comment évoluent les systèmes automatisés du P4 au S3 selon le référentiel p. 20, 23 et 76-79 ?");
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
              <span className="text-xs uppercase tracking-widest font-mono text-emerald-400">Secteur 02 • Niveau 2 (Intermédiaire)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                DÉMARCHE TECHNOLOGIQUE & CHAÎNE IoT (P. 22-25)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Ingénierie de la Serre : Démarche de Projet & Système Cyber-Physique
            </h2>
            <p className="text-xs text-slate-300">
              Ordonnancez la démarche de projet sans céder au bricolage spontané, puis structurez la chaîne d'information d'un objet connecté (<strong>Capteurs ➔ Traitement ➔ Actionneurs</strong>).
            </p>
          </div>
        </div>

        <button
          onClick={() => openPdf(24)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>Consulter Référentiel p. 22-25</span>
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
          <Layers className="w-4 h-4" />
          <span>1. Les 5 Étapes de la Démarche Technologique (p. 22-23)</span>
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
          <span>2. Chaîne d'Information IoT & Spirale Curriculaire (p. 24-25)</span>
          {unlocked && <CheckCircle className="w-4 h-4 text-emerald-300" />}
        </button>
      </div>

      {/* UNLOCKED SUCCESS BANNER */}
      {unlocked ? (
        <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-emerald-300">
            BIO-DÔME OPÉRATIONNEL & SERRE IoT EN SERVICE !
          </h3>
          <p className="text-sm text-emerald-200/90 max-w-xl mx-auto">
            Maîtrise didactique parfaite ! La démarche technologique garantit une conception écologique rigoureuse, et la chaîne cyber-physique (Capteurs ➔ Micro:bit ➔ Actionneurs) régule le biotope en toute autonomie.
          </p>
        </div>
      ) : activeTab === "timeline" ? (
        /* ─────────────────────────────────────────────────────────────
           TAB 1 : LA DÉMARCHE TECHNOLOGIQUE (ORDONNANCEMENT SÉQUENTIEL)
        ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Logique Séquentielle de la Démarche Technologique (p. 22-23)
              </h3>
              <p className="text-xs text-slate-300">
                Utilisez les flèches ▲ et ▼ pour remettre les 5 phases dans l'ordre chronologique d'apprentissage :
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              5 Phases Canoniques
            </span>
          </div>

          {/* Cards List with Up/Down buttons */}
          <div className="space-y-3">
            {orderedSteps.map((step, idx) => (
              <div
                key={step.id}
                className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center gap-4 transition hover:border-emerald-500/50"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>

                <span className="text-2xl shrink-0">{step.icon}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white">{step.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-emerald-300 border border-slate-700">
                      {step.phaseName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{step.sub}</p>
                  <p className="text-[11px] text-emerald-400/80 italic mt-1">{step.didacticRationale}</p>
                </div>

                {/* Move Controls */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveStep(idx, "up")}
                    disabled={idx === 0 || timelineValidated}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 disabled:opacity-20 text-white transition cursor-pointer"
                    title="Monter"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveStep(idx, "down")}
                    disabled={idx === orderedSteps.length - 1 || timelineValidated}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 disabled:opacity-20 text-white transition cursor-pointer"
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

          <div className="flex justify-end pt-2">
            <button
              onClick={verifyTimeline}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition cursor-pointer hover:scale-105"
            >
              <span>Valider la Démarche & Passer à la Chaîne IoT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
           TAB 2 : CHAÎNE D'INFORMATION NUMÉRIQUE & SPIRALE (P. 24-25, 76, 79)
        ───────────────────────────────────────────────────────────── */
        <div className="space-y-6">
          {/* Unassigned Components Pool */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Composants IoT de la Serre ({unassignedComponents.length} restants) :</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">
                {selectedComponentId ? "👉 Cliquez sur un des 3 maillons ci-dessous pour insérer" : "Sélectionnez un composant ci-dessous"}
              </span>
            </div>

            {unassignedComponents.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold">
                ✓ Tous les 8 composants sont placés dans la chaîne d'information !
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {unassignedComponents.map((comp) => {
                  const isSelected = selectedComponentId === comp.id;
                  return (
                    <div
                      key={comp.id}
                      onClick={() => handleSelectComponent(comp.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-emerald-600 border-white text-white scale-105 shadow-xl ring-2 ring-white"
                          : "bg-slate-950/90 border-slate-700/80 hover:border-emerald-400 text-slate-200 hover:scale-[1.02]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-2xl">{comp.icon}</span>
                          <span className="font-bold text-xs leading-tight">{comp.name}</span>
                        </div>
                        <p className="text-[11px] opacity-80 leading-snug">{comp.description}</p>
                      </div>
                      <div className="pt-2 mt-2 border-t border-slate-800/80 text-[10px] font-mono text-emerald-400">
                        {isSelected ? "Sélectionné ➔" : "Sélectionner"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3 Chain Compartments (Acquérir / Traiter / Agir) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {COMPARTMENTS.map((comp) => {
              const itemsInRole = IOT_COMPONENTS.filter((c) => assignedComponents[c.id] === comp.role);
              const isTargetReady = selectedComponentId !== null;

              return (
                <div
                  key={comp.role}
                  onClick={() => isTargetReady && handleAssignRole(comp.role)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between min-h-[240px] ${comp.color} ${
                    isTargetReady
                      ? "cursor-pointer hover:border-white hover:scale-[1.01] ring-2 ring-emerald-500/40"
                      : "cursor-default"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{comp.icon}</span>
                        <span className="font-bold text-xs sm:text-sm text-white">{comp.title}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900/80 text-slate-300 border border-slate-700">
                        {itemsInRole.length}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-75 leading-relaxed mb-3">{comp.sub}</p>
                  </div>

                  {/* Components placed */}
                  <div className="space-y-1.5 my-2 flex-1">
                    {itemsInRole.map((item) => (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveComponent(item.id);
                        }}
                        title="Cliquez pour retirer"
                        className="p-2 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-rose-500 flex items-center justify-between text-xs text-slate-200 transition cursor-pointer group"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span>{item.icon}</span>
                          <span className="truncate font-semibold">{item.name}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 group-hover:text-rose-400 font-mono shrink-0 ml-1">✕</span>
                      </div>
                    ))}

                    {itemsInRole.length === 0 && (
                      <div className="h-16 rounded-xl border border-dashed border-slate-700/60 flex items-center justify-center text-[11px] text-slate-500 italic text-center px-2">
                        {isTargetReady ? "👉 Cliquez ici pour insérer le composant" : "Maillon vide"}
                      </div>
                    )}
                  </div>

                  {isTargetReady && (
                    <button
                      onClick={() => handleAssignRole(comp.role)}
                      className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer mt-1"
                    >
                      Insérer dans ce maillon ⇩
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sub-challenge: Spiral Progression Question for Bloc 3 Teacher */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Transposition Didactique : La Progression Spiralaire des Objets Connectés (p. 20, 23, 76-79)</span>
            </div>
            <p className="text-xs text-slate-300">
              Dans le référentiel FMTTN, comment s'articule la complexification progressive de la compétence « Concevoir, construire un objet technologique » du primaire au secondaire inférieur ?
            </p>

            <div className="space-y-2">
              {[
                {
                  id: 1,
                  title: "Progression Spiralaire Officielle (p. 20, 23 & 76-79)",
                  text: "P4 : Utilisation d'un instrument de mesure passif ➔ P6/S1 : Circuit électrique élémentaire avec capteur réactif ➔ S2-S3 : Système cyber-physique automatisé multicapteurs avec régulation algorithmique en boucle fermée.",
                  correct: true,
                },
                {
                  id: 2,
                  title: "Saut Conceptuel Brutal",
                  text: "P1 à P6 : Dessins théoriques sur papier sans aucun composant ➔ S1 : Passage immédiat au câblage industriel haute tension.",
                  correct: false,
                },
                {
                  id: 3,
                  title: "Rupture par Exclusion",
                  text: "L'apprentissage des capteurs et des microcontrôleurs est strictement exclu du Tronc Commun général et réservé aux filières techniques qualifiantes du troisième degré.",
                  correct: false,
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setSpiralChoice(opt.id);
                    setErrorMsg("");
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                    spiralChoice === opt.id
                      ? "bg-emerald-950/60 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/40"
                      : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div className="font-bold text-white mb-0.5">{opt.title}</div>
                  <p className="text-slate-300 leading-relaxed">{opt.text}</p>
                </div>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <div>{errorMsg}</div>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveTab("timeline")}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ← Revoir la Démarche Technologique
            </button>

            <button
              onClick={verifyIoTChain}
              disabled={isChainSimulating}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition cursor-pointer hover:scale-105 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{isChainSimulating ? "Simulation du cycle IoT en cours..." : "Valider la Chaîne Numérique & Débloquer"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
