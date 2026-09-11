"use client";

import { useState } from "react";
import { GraduationCap, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, ArrowLeft, Sparkles, Compass, Lightbulb, Users, Leaf, Cpu, Power, Zap, Sliders } from "lucide-react";

type Props = {
  onUnlock: () => void;
  onError: () => void;
  openPdf: (page?: number) => void;
};

type ViseeSector = {
  id: number;
  name: string;
  shortName: string;
  icon: typeof Compass;
  gaugeColor: string;
  contextFWB: string;
  problemScenario: string;
  switches: {
    id: number;
    label: string;
    sub: string;
    isOptimal: boolean;
    feedbackEffect: string;
  }[];
};

const SECTORS: ViseeSector[] = [
  {
    id: 1,
    name: "Visée 1 : Autonomie (Choix raisonnés & Sécurité)",
    shortName: "Autonomie",
    icon: Compass,
    gaugeColor: "from-blue-600 to-cyan-400",
    contextFWB: "Intelligence Artificielle générative en classe (Liège)",
    problemScenario: "Les élèves copient-collent des synthèses générées par ChatGPT sans recul critique. Quel levier didactique enclencher ?",
    switches: [
      {
        id: 1,
        label: "Levier 1 : Interdiction totale & surveillance policière",
        sub: "Bloquer tous les accès et punir sans expliquer les enjeux",
        isOptimal: false,
        feedbackEffect: "Court-circuit : L'interdiction pure crée la clandestinité et empêche l'éducation à l'autonomie.",
      },
      {
        id: 2,
        label: "Levier 2 : Enseignement critique du prompt & vérification des sources",
        sub: "Faire de l'IA un tuteur d'investigation : détecter les hallucinations et repérer les biais",
        isOptimal: true,
        feedbackEffect: "✓ Jauge chargée ! L'élève apprend à poser des choix raisonnés et responsables face aux techniques (p. 26).",
      },
      {
        id: 3,
        label: "Levier 3 : Laisser-faire consumériste passif",
        sub: "Tolérer la délégation aveugle de tous les travaux sans contrôle",
        isOptimal: false,
        feedbackEffect: "Court-circuit : Dépendance passive incompatible avec l'émancipation intellectuelle.",
      },
    ],
  },
  {
    id: 2,
    name: "Visée 2 : Cognition (Démarche d'Investigation & Diagnostic)",
    shortName: "Cognition",
    icon: Cpu,
    gaugeColor: "from-amber-500 to-yellow-400",
    contextFWB: "Démarche d'investigation technologique (Namur)",
    problemScenario: "La sonde d'humidité de la serre scolaire renvoie des données aberrantes. Quel levier didactique enclencher ?",
    switches: [
      {
        id: 1,
        label: "Levier 1 : Démarche scientifique : hypothèses, test de continuité & isolation",
        sub: "Étalonner le capteur dans l'eau, vérifier la masse et inspecter le code",
        isOptimal: true,
        feedbackEffect: "✓ Jauge chargée ! Développement des processus d'acquisition de savoirs et de compétences (p. 26).",
      },
      {
        id: 2,
        label: "Levier 2 : Remplacement aveugle sans analyse",
        sub: "Jeter la sonde à la poubelle sans tester le circuit",
        isOptimal: false,
        feedbackEffect: "Court-circuit : Consommation impulsive sans démarche d'investigation ni rigueur cognitive.",
      },
      {
        id: 3,
        label: "Levier 3 : Abandonner le projet de serre",
        sub: "Conclure que l'électronique est inaccessible aux élèves",
        isOptimal: false,
        feedbackEffect: "Court-circuit : Renoncement stérile face à l'aléa technique.",
      },
    ],
  },
  {
    id: 3,
    name: "Visée 3 : Créativité (Conception Originale & Prototypage)",
    shortName: "Créativité",
    icon: Lightbulb,
    gaugeColor: "from-purple-500 to-pink-400",
    contextFWB: "Résolution de problème concret d'école (Bruxelles)",
    problemScenario: "Les vélos et trottinettes encombrent le hall d'école par manque de mobilier adapté. Quel levier didactique enclencher ?",
    switches: [
      {
        id: 1,
        label: "Levier 1 : Interdiction de venir à vélo",
        sub: "Pénaliser la mobilité active des élèves par une mesure disciplinaire",
        isOptimal: false,
        feedbackEffect: "Court-circuit : Mesure punitive qui tue l'initiative et l'éco-citoyenneté.",
      },
      {
        id: 2,
        label: "Levier 2 : Télécharger un modèle sans adaptation",
        sub: "Copier un plan sans l'adapter aux dimensions réelles du hall",
        isOptimal: false,
        feedbackEffect: "Court-circuit : Reproduction passive sans démarche de conception créative.",
      },
      {
        id: 3,
        label: "Levier 3 : Défi créatif : concevoir un range-vélos modulaire en bois recyclé",
        sub: "Cahier des charges, croquis côtés, maquettes carton et prototypage en atelier",
        isOptimal: true,
        feedbackEffect: "✓ Jauge chargée ! L'imagination et la construction collective résolvent un problème réel (p. 26).",
      },
    ],
  },
  {
    id: 4,
    name: "Visée 4 : Collaboration, souci des autres (Intelligence Collective & Inclusion)",
    shortName: "Collaboration",
    icon: Users,
    gaugeColor: "from-teal-500 to-emerald-400",
    contextFWB: "Inclusion et travail d'équipe en robotique (Charleroi)",
    problemScenario: "En binôme robotique, un élève monopolise le robot et laisse son camarade passif. Quel levier didactique enclencher ?",
    switches: [
      {
        id: 1,
        label: "Levier 1 : Protocole 'Pair Programming' avec rôles alternés (Pilote / Copilote)",
        sub: "Un élève code, l'autre contrôle la logique, puis inversion toutes les 15 minutes",
        isOptimal: true,
        feedbackEffect: "✓ Jauge chargée ! Mise en commun bienveillante des compétences et respect d'autrui (p. 26).",
      },
      {
        id: 2,
        label: "Levier 2 : Isoler les élèves chacun sur un écran",
        sub: "Supprimer tout travail d'équipe et imposer un travail individuel",
        isOptimal: false,
        feedbackEffect: "Court-circuit : Élimine l'apprentissage social et la collaboration solidaire.",
      },
      {
        id: 3,
        label: "Levier 3 : Encourager la compétition individuelle",
        sub: "Seule l'équipe la plus rapide reçoit une note valorisante",
        isOptimal: false,
        feedbackEffect: "Court-circuit : Compétition individualiste opposée à la solidarité du Tronc Commun.",
      },
    ],
  },
  {
    id: 5,
    name: "Visée 5 : Développement durable (Écologique, Économique & Social)",
    shortName: "Dév. durable",
    icon: Leaf,
    gaugeColor: "from-emerald-600 to-green-400",
    contextFWB: "Durabilité du matériel informatique scolaire (Mons)",
    problemScenario: "30 ordinateurs portables de l'école sont jugés 'trop lents' et voués au rebut. Quel levier didactique enclencher ?",
    switches: [
      {
        id: 1,
        label: "Levier 1 : Jeter tous les appareils à la benne",
        sub: "Rachat complet de matériel neuf sur catalogue",
        isOptimal: false,
        feedbackEffect: "Court-circuit : Gaspillage économique et pollution électronique massive.",
      },
      {
        id: 2,
        label: "Levier 2 : Laisser pourrir dans une armoire",
        sub: "Stocker passivement les machines sans chercher à les réparer",
        isOptimal: false,
        feedbackEffect: "Court-circuit : Immobilisation inutile sans valorisation pédagogique.",
      },
      {
        id: 3,
        label: "Levier 3 : Créer un 'Repair Café scolaire' : nettoyage & Linux éducatif léger",
        sub: "Dépoussiérer, changer la pâte thermique, installer un OS libre sobre et éco-responsable",
        isOptimal: true,
        feedbackEffect: "✓ Jauge chargée ! Confluence exemplaire des enjeux écologiques, économiques et sociaux (p. 26).",
      },
    ],
  },
];

export function Room5Bridge({ onUnlock, onError, openPdf }: Props) {
  // Gauges values (0 to 100)
  const [gauges, setGauges] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  const [activeSectorId, setActiveSectorId] = useState<number>(1);
  const [activeSwitchSelections, setActiveSwitchSelections] = useState<Record<number, number>>({});
  const [feedbackMessages, setFeedbackMessages] = useState<Record<number, string>>({});
  const [errorMsg, setErrorMsg] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const activeSector = SECTORS.find((s) => s.id === activeSectorId) || SECTORS[0];
  const Icon = activeSector.icon;

  const totalGaugesSum = Object.values(gauges).reduce((a, b) => a + b, 0);
  const all5GaugesCharged = totalGaugesSum === 500;

  function toggleSwitch(sectorId: number, switchId: number) {
    const sector = SECTORS.find((s) => s.id === sectorId);
    const sw = sector?.switches.find((w) => w.id === switchId);
    if (!sw) return;

    setActiveSwitchSelections((prev) => ({
      ...prev,
      [sectorId]: switchId,
    }));

    if (sw.isOptimal) {
      // Gauge to 100%
      setGauges((prev) => ({
        ...prev,
        [sectorId]: 100,
      }));
      setFeedbackMessages((prev) => ({
        ...prev,
        [sectorId]: sw.feedbackEffect,
      }));
      setErrorMsg("");

      // Automatically advance to next uncharged sector
      const nextUncharged = SECTORS.find((s) => s.id !== sectorId && (gauges[s.id] || 0) < 100);
      if (nextUncharged) {
        setTimeout(() => setActiveSectorId(nextUncharged.id), 700);
      }
    } else {
      // Penalty / Crash
      setGauges((prev) => ({
        ...prev,
        [sectorId]: 0,
      }));
      setFeedbackMessages((prev) => ({
        ...prev,
        [sectorId]: sw.feedbackEffect,
      }));
      onError();
      setErrorMsg(`⚠️ Commutateur inadapté sur la ${sector?.shortName} : ${sw.feedbackEffect}`);
    }
  }

  function handleFinalHyperspaceLock() {
    if (!all5GaugesCharged) {
      onError();
      setErrorMsg("⚠️ Toutes les 5 jauges sociétales doivent être chargées à 100% pour allumer l'ordinateur de bord.");
      return;
    }

    setUnlocked(true);
    onUnlock();
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-cyan-950/70 border border-indigo-800/40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-mono text-cyan-400">Secteur 05</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PONT DE COMMANDEMENT & LES 5 VISÉES (P. 26)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Console Cockpit : Les 5 Leviers de Gouvernance Sociétale
            </h2>
            <p className="text-xs text-slate-300">
              Comme sur un tableau de bord LearningApps, actionnez les bons commutateurs didactiques pour charger les 5 jauges sociétales de l'Arche à 100% (p. 26).
            </p>
          </div>
        </div>

        <button
          onClick={() => openPdf(26)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Consulter Référentiel p. 26</span>
        </button>
      </div>

      {/* 5 COCKPIT POWER GAUGES (LE CLUSTEUR DE BORD) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl">
        {SECTORS.map((s) => {
          const SIcon = s.icon;
          const val = gauges[s.id] || 0;
          const isCharged = val === 100;
          const isCurrent = activeSectorId === s.id;

          return (
            <div
              key={s.id}
              onClick={() => setActiveSectorId(s.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isCurrent
                  ? "bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg"
                  : isCharged
                  ? "bg-emerald-950/20 border-emerald-500/50"
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-1 truncate">
                  <SIcon className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                  <span className="truncate">{s.shortName}</span>
                </span>
                {isCharged && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              </div>

              {/* Vertical Gauge Bar */}
              <div className="my-2 h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${val}%` }}
                  className={`h-full bg-gradient-to-r ${s.gaugeColor} transition-all duration-500`}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>V0{s.id}</span>
                <span className={isCharged ? "text-emerald-400 font-bold" : "text-slate-500"}>
                  {val}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* UNLOCKED SUCCESS */}
      {unlocked ? (
        <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-emerald-300">
            5 / 5 JAUGES SOCIÉTALES AU MAXIMUM !
          </h3>
          <p className="text-sm text-emerald-200/90 max-w-xl mx-auto">
            Gouvernance exemplaire ! Vous avez activé les 5 leviers émancipateurs du Tronc Commun (Autonomie, Raisonnement, Créativité, Coopération, Éco-citoyenneté p. 26). L'Arche FMTTN est déverrouillée !
          </p>
        </div>
      ) : (
        /* INTERACTIVE CONSOLE SECTOR PANEL */
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
          {/* Active Sector Header */}
          <div className="flex items-start gap-4 pb-4 border-b border-slate-800">
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shrink-0">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  {activeSector.name}
                </span>
                <span className="text-xs text-slate-500 font-mono">• {activeSector.contextFWB}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                « {activeSector.problemScenario} »
              </h3>
            </div>
          </div>

          {/* 3 Mechanical Switches */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Actionnez le commutateur didactique conforme au Tronc Commun (p. 26) :
            </span>

            <div className="grid grid-cols-1 gap-3">
              {activeSector.switches.map((sw) => {
                const isSelected = activeSwitchSelections[activeSector.id] === sw.id;
                const isOptimal = sw.isOptimal;

                return (
                  <div
                    key={sw.id}
                    onClick={() => toggleSwitch(activeSector.id, sw.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? isOptimal
                          ? "bg-emerald-950/50 border-emerald-400 ring-2 ring-emerald-400/40 text-white shadow-xl scale-[1.01]"
                          : "bg-rose-950/50 border-rose-500 ring-2 ring-rose-500/40 text-rose-200"
                        : "bg-slate-950/90 border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:bg-slate-900/80"
                    }`}
                  >
                    {/* Mechanical Toggle Button Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? isOptimal
                            ? "bg-emerald-500 border-white text-slate-950 shadow-md shadow-emerald-500/50"
                            : "bg-rose-600 border-white text-white"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}
                    >
                      <Power className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-white">{sw.label}</div>
                      <p className="text-xs text-slate-400 mt-1">{sw.sub}</p>
                      {isSelected && (
                        <div
                          className={`text-xs mt-2 font-mono font-bold ${
                            isOptimal ? "text-emerald-300" : "text-rose-400"
                          }`}
                        >
                          {sw.feedbackEffect}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sector Navigation & Master Hyperspace Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">
                Jauges pleines : <strong className="text-cyan-400">{Object.values(gauges).filter((v) => v === 100).length} / 5</strong>
              </span>
            </div>

            <button
              onClick={handleFinalHyperspaceLock}
              disabled={!all5GaugesCharged}
              className={`px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xl transition cursor-pointer flex items-center gap-2 ${
                all5GaugesCharged
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white animate-bounce shadow-cyan-500/40"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{all5GaugesCharged ? "Verrouiller le Cap vers la Nouvelle Planète ➔" : "Chargez les 5 jauges pour allumer le cap"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
