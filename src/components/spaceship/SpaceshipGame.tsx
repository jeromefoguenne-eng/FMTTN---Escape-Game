"use client";

import { useState, useEffect, useRef } from "react";
import {
  Timer,
  BookOpen,
  Volume2,
  VolumeX,
  MapPin,
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Radio,
  ExternalLink,
  Wrench,
  Leaf,
  Cpu,
  Smartphone,
  GraduationCap,
  Rocket,
  Shield,
  Play,
  Globe2,
  Users,
} from "lucide-react";
import { Room1Workshop } from "./Room1Workshop";
import { Room2BioDome } from "./Room2BioDome";
import { Room3Engines } from "./Room3Engines";
import { Room4CyberCenter } from "./Room4CyberCenter";
import { Room5Bridge } from "./Room5Bridge";
import { FinalEscapeTrial } from "./FinalEscapeTrial";
import { ReferentielModal } from "../layout/ReferentielModal";
import { assetUrl } from "@/lib/utils";
import { soundEngine } from "@/lib/sound/soundEngine";

type Props = {
  roomCode?: string;
  playerName?: string;
};

type CrewLog = {
  id: string;
  sender: string;
  role: string;
  avatar: string;
  message: string;
  time: string;
};

type ZoneInfo = {
  id: number;
  name: string;
  theme: string;
  pageRef: number;
  icon: typeof Wrench;
  color: string;
  badgeColor: string;
  description: string;
  mapX: number;
  mapY: number;
  mapLabel: string;
  shortChoice: string;
  wireframeColor: string;
};

const ZONES: ZoneInfo[] = [
  {
    id: 1,
    name: "Architecture Matérielle & Logicielle",
    theme: "Niveau 1 • Hardware, Software, Fichiers & Cloud (p. 43, 63)",
    pageRef: 43,
    icon: Cpu,
    color: "from-blue-900/40 to-slate-900 border-blue-600/40 hover:border-blue-400",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    description: "Découvrez le fonctionnement d'un ordinateur : classez matériel, logiciels, fichiers et cloud, puis aidez un élève à comprendre la mémoire vive.",
    mapX: 71.0,
    mapY: 67.0,
    mapLabel: "Système",
    shortChoice: "N1 • Hardware & Software (p. 43, 63)",
    wireframeColor: "border-blue-500 bg-blue-950/80 text-blue-300",
  },
  {
    id: 2,
    name: "Investigation Critique & Systèmes de Données",
    theme: "Niveau 2 • Recherche Web, Fiabilité des Sources & IoT (p. 37, 43, 73)",
    pageRef: 43,
    icon: Globe2,
    color: "from-emerald-900/40 to-slate-900 border-emerald-600/40 hover:border-emerald-400",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    description: "Remettez dans le bon ordre les étapes d'une recherche sur Internet et comprenez comment fonctionne un système connecté (Capteurs ➔ Traitement ➔ Sorties).",
    mapX: 50.0,
    mapY: 25.0,
    mapLabel: "Données & IoT",
    shortChoice: "N2 • Recherche Critique (p. 43, 73)",
    wireframeColor: "border-teal-400 bg-teal-950/80 text-teal-300",
  },
  {
    id: 3,
    name: "Cœur Robotique & Pensée Computationnelle",
    theme: "Niveau 3 • Logigrammes, Algorithmes & Scratch (p. 50, 56, 101)",
    pageRef: 50,
    icon: Cpu,
    color: "from-amber-900/40 to-slate-900 border-amber-600/40 hover:border-amber-400",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    description: "Associez les formes géométriques du logigramme, découvrez la différence entre Algorithme et Programme, puis guidez le robot.",
    mapX: 76.0,
    mapY: 10.0,
    mapLabel: "Robotique",
    shortChoice: "N3 • Pensée Computationnelle (p. 50, 56)",
    wireframeColor: "border-amber-500 bg-amber-950/80 text-amber-300",
  },
  {
    id: 4,
    name: "Cyber-Centre & Éducation aux Médias",
    theme: "Niveau 4 • Identité Numérique, Phishing & RGPD (p. 24, 49, 100)",
    pageRef: 100,
    icon: Shield,
    color: "from-purple-900/40 to-slate-900 border-purple-600/40 hover:border-purple-400",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    description: "Classez les traces de l'identité numérique, déjouez un faux e-mail piégé (phishing) et mobilisez l'éducation aux médias.",
    mapX: 33.0,
    mapY: 44.0,
    mapLabel: "Cyber-Centre",
    shortChoice: "N4 • RGPD & Médias (p. 24, 100)",
    wireframeColor: "border-purple-400 bg-purple-950/80 text-purple-300",
  },
  {
    id: 5,
    name: "Laboratoire Didactique du Numérique",
    theme: "Niveau 5 • Régulations Didactiques en Classe (p. 24-26, 43, 49, 56, 73)",
    pageRef: 24,
    icon: GraduationCap,
    color: "from-indigo-900/40 to-slate-900 border-indigo-600/40 hover:border-indigo-400",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    description: "Observez 5 situations concrètes d'élèves en classe et choisissez la meilleure façon de les aider à progresser.",
    mapX: 18.0,
    mapY: 60.0,
    mapLabel: "Lab Didactique",
    shortChoice: "N5 • Didactique du Numérique (p. 24-26)",
    wireframeColor: "border-indigo-400 bg-indigo-950/80 text-indigo-300",
  },
];

export function SpaceshipGame({ roomCode = "EXPEDITION-FMTTN", playerName: initialPlayerName = "Cadet Enseignant" }: Props) {
  // Navigation states: 'briefing' | 'map' | 'zone' | 'final' | 'victory' | 'meltdown'
  const [gameState, setGameState] = useState<"briefing" | "map" | "zone" | "final" | "victory" | "meltdown">("briefing");
  const [activeZoneId, setActiveZoneId] = useState<number>(1);
  const [clearedZoneIds, setClearedZoneIds] = useState<number[]>([]);
  const [hoveredZoneId, setHoveredZoneId] = useState<number | null>(null);

  const [playerName, setPlayerName] = useState(initialPlayerName);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [evaluationScore, setEvaluationScore] = useState(100);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundEngine.isSoundEnabled());
  const [musicEnabled, setMusicEnabled] = useState(soundEngine.isMusicEnabled());

  // PDF modal state
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfPage, setPdfPage] = useState<number | null>(null);

  // Intercom logs
  const [crewLogs, setCrewLogs] = useState<CrewLog[]>([
    {
      id: "1",
      sender: "Hélène",
      role: "Officier Scientifique en Chef",
      avatar: "👩‍🚀",
      message:
        "Alerte générale à bord de l'Arche FMTTN ! Notre voyage vers les nouvelles exoplanètes habitables est gravement compromis suite à une avarie majeure. Les automates sont hors service. Seules les compétences et concepts de la FMTTN peuvent réparer nos systèmes et sauver les passagers !",
      time: "T-30:00",
    },
  ]);

  const audioCtxRef = useRef<AudioContext | null>(null);

  function playSound(type: "success" | "error" | "alarm" | "victory") {
    if (!soundEnabled) return;
    soundEngine.unlockContext();
    soundEngine.playSfx(type);
  }

  // Timer Tick & Progressive Classical Oppression
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const nextVal = prev <= 1 ? 0 : prev - 1;
        // Dynamically update music tension, tempo and filters
        soundEngine.updateChronoTension(nextVal, 1800);

        if (nextVal === 0) {
          setIsTimerRunning(false);
          soundEngine.stopMusic();
          soundEngine.playSfx("alarm");
          setGameState("meltdown");
        } else if (nextVal === 300) {
          soundEngine.playSfx("alarm");
        }
        return nextVal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  function startMissionFromBriefing() {
    setIsTimerRunning(true);
    setGameState("map");
    soundEngine.unlockContext();
    soundEngine.updateChronoTension(1800, 1800);
    soundEngine.startMusic("classical");
    soundEngine.playSfx("unlock");
    addRadioMessage(
      "Commandant de Bord",
      "Passerelle Centrale",
      "🚀",
      `Mission de sauvetage enclenchée par ${playerName} ! Les 30 minutes sont décomptées. 5 secteurs vitaux à stabiliser pour sauver les passagers.`
    );
  }

  function handleOpenPdf(page?: number) {
    setPdfPage(page ?? null);
    setPdfOpen(true);
  }

  function handleEnterZone(zoneId: number) {
    setActiveZoneId(zoneId);
    setGameState("zone");
  }

  function handleZoneCleared(zoneId: number) {
    playSound("success");
    if (!clearedZoneIds.includes(zoneId)) {
      const updated = [...clearedZoneIds, zoneId];
      setClearedZoneIds(updated);

      const zoneInfo = ZONES.find((z) => z.id === zoneId);
      addRadioMessage(
        "Hélène",
        "Officier Scientifique",
        "👩‍🚀",
        `Zone « ${zoneInfo?.name} » rétablie ! Les passagers de ce secteur sont hors de danger. Retournez à la carte pour choisir le prochain secteur.`
      );
    }
  }

  function handleFinalEscapeSuccess() {
    soundEngine.startMusic("victory");
    playSound("victory");
    setIsTimerRunning(false);
    setGameState("victory");
    addRadioMessage(
      "Commandant de Bord",
      "Victoire Intergalactique",
      "🌟",
      "Tous les passagers sont sains et saufs ! Grâce aux compétences FMTTN, l'Arche a repris sa trajectoire vers la nouvelle planète habitable !"
    );
  }

  function handleErrorPenalty() {
    playSound("error");
    setTimeLeft((prev) => Math.max(5, prev - 30));
    setEvaluationScore((prev) => Math.max(10, prev - 5));
  }

  function addRadioMessage(sender: string, role: string, avatar: string, message: string) {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    const timeStr = `T-${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;

    setCrewLogs((prev) => [
      {
        id: Math.random().toString(),
        sender,
        role,
        avatar,
        message,
        time: timeStr,
      },
      ...prev,
    ]);
  }

  function resetToBriefing() {
    setTimeLeft(1800);
    setEvaluationScore(100);
    setClearedZoneIds([]);
    setIsTimerRunning(false);
    setGameState("briefing");
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const all5ZonesCleared = clearedZoneIds.length === 5;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Persistent PDF Reference Modal */}
      <ReferentielModal
        isOpen={pdfOpen}
        page={pdfPage}
        onClose={() => setPdfOpen(false)}
        showButton={false}
      />

      {/* TOP STATUS BAR */}
      {gameState !== "briefing" && (
        <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {gameState === "zone" || gameState === "final" ? (
                <button
                  onClick={() => setGameState("map")}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Carte de l'Arche ({clearedZoneIds.length}/5)</span>
                </button>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-600 flex items-center justify-center text-lg shadow-md">
                    🚀
                  </div>
                  <div>
                    <h1 className="text-sm md:text-base font-black text-white flex items-center gap-2">
                      <span>L'ARCHE FMTTN</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {all5ZonesCleared ? "SAS FINAL PRÊT" : "MISSION SAUVETAGE PASSAGERS"}
                      </span>
                    </h1>
                    <p className="text-[11px] text-slate-400">
                      Officier : <span className="text-indigo-300 font-semibold">{playerName}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Countdown Timer */}
            <div
              className={`px-4 py-1.5 rounded-2xl border flex items-center gap-3 transition-all ${
                timeLeft < 300
                  ? "bg-rose-950/50 border-rose-500 text-rose-300 animate-pulse shadow-lg ring-2 ring-rose-500/50"
                  : "bg-slate-900 border-slate-700 text-white"
              }`}
            >
              <Timer className={`w-5 h-5 ${timeLeft < 300 ? "text-rose-400 animate-spin" : "text-amber-400"}`} />
              <div>
                <div className="text-[9px] uppercase tracking-wider font-mono text-slate-400">
                  Temps avant surcharge fatale
                </div>
                <div className="text-xl font-black font-mono tracking-wider leading-none">
                  {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                </div>
              </div>
            </div>

            {/* Actions: PDF Referentiel & Sound */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenPdf(2)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition cursor-pointer"
                title="Consulter le Référentiel FMTTN"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Référentiel FMTTN (103 p.)</span>
                <span className="sm:hidden">PDF</span>
              </button>

              {/* Ambient Music Toggle */}
              <button
                onClick={() => {
                  const next = soundEngine.toggleMusic();
                  setMusicEnabled(next);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  musicEnabled
                    ? "bg-purple-950/70 border-purple-500/60 text-purple-300 shadow-md shadow-purple-500/20 ring-1 ring-purple-400/40"
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
                title={musicEnabled ? "Couper la musique d'ambiance spatiale" : "Activer la musique d'ambiance spatiale"}
              >
                <Radio className={`w-3.5 h-3.5 ${musicEnabled ? "text-purple-400 animate-pulse" : "text-slate-500"}`} />
                <span className="hidden md:inline">{musicEnabled ? "Musique ON" : "Musique OFF"}</span>
              </button>

              {/* SFX Toggle */}
              <button
                onClick={() => {
                  const next = soundEngine.toggleSound();
                  setSoundEnabled(next);
                }}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  soundEnabled
                    ? "bg-slate-800 hover:bg-slate-700 text-cyan-400 border-cyan-500/40"
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
                title={soundEnabled ? "Couper les bruitages SFX" : "Activer les bruitages SFX"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 1 : PAGE D'ACCUEIL & BRIEFING DU SCÉNARIO INTERGALACTIQUE
      ───────────────────────────────────────────────────────────── */}
      {gameState === "briefing" && (
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-5xl mx-auto w-full animate-fade-in">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide animate-pulse">
              <Globe2 className="w-4 h-4 text-indigo-400" />
              <span>EXPÉDITION INTERGALACTIQUE STELLA • MISSION VERS UNE NOUVELLE PLANÈTE</span>
            </div>

            <h1 className="font-[family-name:var(--font-orbitron)] text-4xl sm:text-6xl font-black text-white tracking-tight">
              L'ARCHE <span className="text-emerald-400 underline decoration-emerald-500/40">FMTTN</span> EN DÉTRESSE
            </h1>

            <p className="text-base sm:text-lg text-amber-300 font-bold max-w-2xl mx-auto">
              Des centaines de passagers en route vers de nouveaux mondes sont en danger.
            </p>
          </div>

          {/* Holographic Vessel Card with Scenario */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-indigo-950/50">
            {/* Left: Spaceship Blueprint Image */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-xl shadow-indigo-500/10">
                <img
                  src={assetUrl("/images/spaceship_map.jpg")}
                  alt="L'Arche FMTTN"
                  className="w-full h-auto object-cover"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-lg text-xs font-mono font-bold bg-slate-950/80 text-white backdrop-blur-sm border border-slate-700">
                  Plan de l'Arche FMTTN • 5 Secteurs Critiques
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Passagers colons à bord : 1 450 âmes
                </span>
                <span className="font-mono text-amber-400">Chrono : 30:00</span>
              </div>
            </div>

            {/* Right: The Complete Detailed Scenario */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400" />
                  Le Scénario de l'Expédition :
                </h3>
                
                <p>
                  Vous et des centaines de passagers êtes à bord de <strong className="text-white">L'Arche FMTTN</strong>, un gigantesque vaisseau d'exploration intergalactique en route pour <strong className="text-emerald-400">découvrir et coloniser de nouvelles planètes habitables</strong>.
                </p>

                <p>
                  Mais lors de la traversée d'une ceinture d'astéroïdes inconnue, une décharge électromagnétique a désactivé les pilotes automatiques et corrompu les sous-systèmes vitaux de survie du vaisseau : atelier de fabrication, bio-dôme de subsistance, robots de ventilation et réseaux de bord s'effondrent !
                </p>

                <div className="p-4 rounded-xl bg-indigo-950/50 border border-indigo-500/50 text-xs sm:text-sm text-indigo-200 leading-relaxed space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                    <span>⚠️</span>
                    <span>POURQUOI SEULES LES COMPÉTENCES FMTTN PEUVENT SAUVER LA MISSION ?</span>
                  </div>
                  <p>
                    À des millions d'années-lumière de la Terre, <strong className="text-white">aucun secours extérieur, aucune usine et aucun serveur cloud terrestre</strong> ne peuvent intervenir. Tout repose sur l'autonomie technique, écologique et citoyenne des passagers.
                  </p>
                  <p>
                    <strong className="text-emerald-300">Seules les compétences du Volet Numérique du référentiel FMTTN</strong> permettront de sauver l'Arche : rétablir l'architecture informatique en distinguant matériel, logiciels et stockage (p. 43, 63), guider la recherche critique sur le Web et connecter la serre automatisée (p. 43, 76), reprogrammer le robot d'inspection en logigramme normalisé sous Scratch (p. 50, 56), neutraliser l'attaque d'hameçonnage pour protéger les données personnelles des colons (p. 100) et réguler les situations didactiques de classe (p. 24-26) pour sauver les passagers !
                  </p>
                </div>
              </div>

              {/* Audio & Classical Atmosphere Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    🎵
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>Bande-Son Classique Progressive</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        D Mineur
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      S'accélère et devient de plus en plus oppressante avec le chrono
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.unlockContext();
                      const next = soundEngine.toggleMusic();
                      setMusicEnabled(next);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      musicEnabled
                        ? "bg-purple-600/30 border-purple-500 text-purple-200 shadow-md shadow-purple-500/20"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>{musicEnabled ? "Musique ACTIVE" : "Musique COUPEE"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.unlockContext();
                      const next = soundEngine.toggleSound();
                      setSoundEnabled(next);
                    }}
                    className={`p-1.5 rounded-xl border transition cursor-pointer ${
                      soundEnabled
                        ? "bg-slate-800 text-cyan-400 border-cyan-500/40"
                        : "bg-slate-900 border-slate-700 text-slate-500"
                    }`}
                    title={soundEnabled ? "Effets SFX actifs" : "Effets SFX coupés"}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Cadet Name Input */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Identifiant du Cadet / Futur Enseignant Sauveteur :
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Ex : Jérôme, Hélène, Cadet M1..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleOpenPdf(2)}
                  className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Consulter le Référentiel (103 p.)</span>
                </button>

                <button
                  onClick={startMissionFromBriefing}
                  className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>DÉMARRER LA MISSION (30:00)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 2 : LA CARTE DES 5 ZONES DU VAISSEAU (HUB LIBRE)
      ───────────────────────────────────────────────────────────── */}
      {gameState === "map" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
          {/* Map Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Passerelle de Navigation • Sauvetage des Passagers</span>
              </div>
              <h2 className="text-2xl font-black text-white">
                Plan Intérieur de l'Arche FMTTN
              </h2>
              <p className="text-xs text-slate-300">
                Sélectionnez le secteur dans lequel vous souhaitez intervenir. Vous pouvez explorer les 5 zones dans l'ordre de votre choix !
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
              <div className="text-right">
                <div className="text-[10px] uppercase font-mono text-slate-400">Secteurs Sécurisés</div>
                <div className="text-lg font-black text-emerald-400 font-mono">
                  {clearedZoneIds.length} / 5
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-300 font-mono font-bold text-sm">
                {Math.round((clearedZoneIds.length / 5) * 100)}%
              </div>
            </div>
          </div>

          {/* INTERACTIVE HOLOGRAPHIC BLUEPRINT MAP (ENLARGED, NO CHARACTERS) */}
          <div className="relative w-full rounded-3xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl shadow-cyan-950/80 bg-slate-950">
            {/* Large Blueprint Canvas with 16:9 ratio */}
            <div className="relative w-full aspect-video min-h-[540px] md:min-h-[620px] lg:min-h-[720px] select-none">
              {/* The Pure Spaceship Blueprint without human characters */}
              <img
                src={assetUrl("/images/arche_blueprint.jpg")}
                alt="Plan Architectural de l'Arche FMTTN"
                className="w-full h-full object-cover"
              />

              {/* Holographic sci-fi grid overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/60 pointer-events-none" />
              <div className="absolute inset-0 bg-cyan-950/15 pointer-events-none mix-blend-screen" />

              {/* HUD Top Bar */}
              <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between text-xs font-mono z-10 pointer-events-none">
                <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-cyan-500/50 text-cyan-300 shadow-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-black tracking-wider">PLAN TACTIQUE ARCHITECTURAL • L'ARCHE FMTTN</span>
                  <span className="hidden sm:inline text-slate-500">•</span>
                  <span className="hidden sm:inline text-slate-300">Visualisez les 5 salles et cliquez sur votre choix</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-slate-200 shadow-lg">
                  <span className="text-[11px] text-slate-400">Progression :</span>
                  <strong className="text-emerald-400 font-bold">{clearedZoneIds.length} / 5 Salles Sécurisées</strong>
                </div>
              </div>

              {/* 5 Prominent Interactive Room Panels with Choices Written Directly on Them */}
              {ZONES.map((zone) => {
                const isCleared = clearedZoneIds.includes(zone.id);
                const isHovered = hoveredZoneId === zone.id;
                const Icon = zone.icon;

                return (
                  <div
                    key={zone.id}
                    style={{ left: `${zone.mapX}%`, top: `${zone.mapY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredZoneId(zone.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                    onClick={() => handleEnterZone(zone.id)}
                  >
                    {/* Ultra-compact Sci-Fi HUD Room Callout */}
                    <div
                      className={`group flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-md border shadow-md transition-all duration-200 ${
                        isHovered
                          ? "scale-110 ring-2 ring-cyan-300 shadow-cyan-500/80 bg-slate-950/95 z-30"
                          : "scale-100 hover:scale-105"
                      } ${
                        isCleared
                          ? "bg-slate-950/85 border-emerald-500/80 text-emerald-300 shadow-emerald-950/60"
                          : "bg-slate-950/85 border-cyan-500/70 text-slate-100 shadow-cyan-950/60 hover:border-amber-400"
                      }`}
                    >
                      {/* Status indicator dot / checkmark */}
                      {isCleared ? (
                        <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500/30 text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                      )}

                      {/* Room Label */}
                      <span className="font-mono font-bold text-[10px] sm:text-[11px] tracking-tight text-white whitespace-nowrap">
                        0{zone.id} • {zone.mapLabel}
                      </span>

                      <span className="text-slate-500 text-[9px]">•</span>

                      {/* Short Choice Badge */}
                      <span
                        className={`text-[9px] sm:text-[10px] px-1 py-0.2 rounded font-mono font-semibold whitespace-nowrap border ${
                          isCleared
                            ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                            : "bg-cyan-950/70 text-cyan-200 border-cyan-500/40"
                        }`}
                      >
                        {zone.shortChoice}
                      </span>

                      {/* Small Arrow */}
                      <ArrowRight
                        className={`w-3 h-3 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                          isCleared ? "text-emerald-400" : "text-amber-400"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Special Alert for Final Trial on the Map if all 5 are cleared */}
              {all5ZonesCleared && (
                <div
                  onClick={() => setGameState("final")}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 border-2 border-white text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl shadow-red-600/70 cursor-pointer animate-bounce hover:scale-105 transition flex items-center gap-2"
                >
                  <Rocket className="w-5 h-5 animate-pulse" />
                  <span>🚨 5/5 VALIDÉ ! DÉVERROUILLER LA PROPULSION FINALE (CLIQUEZ ICI) ➔</span>
                </div>
              )}
            </div>

            {/* Map Footer Bar with quick instruction */}
            <div className="p-3.5 bg-slate-950/95 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <span className="text-base">🚀</span>
                <span className="font-medium">
                  Cliquez directement sur l'une des 5 salles ci-dessus pour lancer l'épreuve de votre choix.
                </span>
              </span>
              <span className="font-mono text-cyan-400 text-[11px] font-bold">
                Ordre libre • Chronomètre : {minutes}:{seconds.toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* 5 Zones Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ZONES.map((zone) => {
              const Icon = zone.icon;
              const isCleared = clearedZoneIds.includes(zone.id);
              const isHovered = hoveredZoneId === zone.id;

              return (
                <div
                  key={zone.id}
                  onClick={() => handleEnterZone(zone.id)}
                  onMouseEnter={() => setHoveredZoneId(zone.id)}
                  onMouseLeave={() => setHoveredZoneId(null)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isHovered ? "ring-2 ring-indigo-400 scale-[1.02]" : ""
                  } ${
                    isCleared
                      ? "bg-emerald-950/20 border-emerald-500/50 shadow-md shadow-emerald-500/10"
                      : "bg-gradient-to-b " + zone.color + " hover:scale-[1.02] shadow-lg hover:shadow-indigo-500/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${zone.badgeColor}`}>
                        SECTEUR 0{zone.id}
                      </span>

                      {isCleared ? (
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> SECTEUR SAUVÉ
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                          Intervenir ➔
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`p-2.5 rounded-xl border ${
                          isCleared
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 group-hover:bg-indigo-500/30"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition">
                        {zone.name}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4 min-h-[48px]">
                      {zone.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">Réf. FMTTN p. {zone.pageRef}</span>
                    <span className="font-bold text-indigo-400 group-hover:translate-x-1 transition flex items-center gap-1">
                      <span>{isCleared ? "Revoir le secteur" : "Stabiliser ce secteur"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}

            {/* SPECIAL 6th CARD: MINI ÉPREUVE FINALE DE SYNTHÈSE */}
            <div
              onClick={() => {
                if (all5ZonesCleared) {
                  setGameState("final");
                }
              }}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                all5ZonesCleared
                  ? "bg-gradient-to-b from-red-950/70 via-rose-950/50 to-amber-950/70 border-2 border-red-500 shadow-2xl shadow-red-600/30 cursor-pointer hover:scale-[1.02] animate-pulse ring-2 ring-red-500/50"
                  : "bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                    ÉPREUVE FINALE
                  </span>

                  {all5ZonesCleared ? (
                    <span className="text-xs font-mono font-bold text-red-400 animate-bounce">
                      🚨 DÉVERROUILLÉ !
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">
                      Verrouillé (5/5 requis)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-white">
                    Sas d'Éjection & Relance des Moteurs
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {all5ZonesCleared
                    ? "Tous les secteurs sont stabilisés ! Entrez dans le sas d'éjection pour fusionner les 2 volets FMTTN et propulser l'Arche vers la nouvelle planète !"
                    : "Stabilisez les 5 secteurs du vaisseau pour déverrouiller l'accès au sas d'évacuation final."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Fusion Volet 1 & 2</span>
                {all5ZonesCleared && (
                  <span className="font-bold text-red-400 flex items-center gap-1">
                    <span>LANCER LE DÉFI FINAL</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 3 : ZONE ACTIVE DIDACTIQUE (AVEC RETOUR CARTE)
      ───────────────────────────────────────────────────────────── */}
      {gameState === "zone" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <button
              onClick={() => setGameState("map")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retourner au Plan de l'Arche</span>
            </button>

            <span className="text-xs font-mono text-slate-400">
              Secteurs sauvés : <strong className="text-emerald-400 font-bold">{clearedZoneIds.length} / 5</strong>
            </span>
          </div>

          {activeZoneId === 1 && (
            <Room1Workshop
              onUnlock={() => handleZoneCleared(1)}
              onError={handleErrorPenalty}
              openPdf={handleOpenPdf}
            />
          )}

          {activeZoneId === 2 && (
            <Room2BioDome
              onUnlock={() => handleZoneCleared(2)}
              onError={handleErrorPenalty}
              openPdf={handleOpenPdf}
            />
          )}

          {activeZoneId === 3 && (
            <Room3Engines
              onUnlock={() => handleZoneCleared(3)}
              onError={handleErrorPenalty}
              openPdf={handleOpenPdf}
            />
          )}

          {activeZoneId === 4 && (
            <Room4CyberCenter
              onUnlock={() => handleZoneCleared(4)}
              onError={handleErrorPenalty}
              openPdf={handleOpenPdf}
            />
          )}

          {activeZoneId === 5 && (
            <Room5Bridge
              onUnlock={() => handleZoneCleared(5)}
              onError={handleErrorPenalty}
              openPdf={handleOpenPdf}
            />
          )}
        </main>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 4 : MINI ÉPREUVE FINALE DE SYNTHÈSE
      ───────────────────────────────────────────────────────────── */}
      {gameState === "final" && (
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <button
              onClick={() => setGameState("map")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au Plan</span>
            </button>
          </div>

          <FinalEscapeTrial
            onSuccess={handleFinalEscapeSuccess}
            onError={handleErrorPenalty}
            openPdf={handleOpenPdf}
          />
        </main>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VICTORY OVERLAY MODAL
      ───────────────────────────────────────────────────────────── */}
      {gameState === "victory" && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-2xl w-full bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 border-2 border-emerald-500 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl shadow-emerald-500/20">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-widest">
                Expédition Intergalactique Sauvée
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-2">
                LES PASSAGERS SONT SAINS ET SAUFS !
              </h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto mt-2">
                Grâce à votre maîtrise des savoirs et démarches de la FMTTN, tous les systèmes vitaux de l'Arche sont rétablis. L'expédition reprend sa route vers la nouvelle planète habitable !
              </p>
            </div>

            {/* Debrief stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs">
              <div>
                <div className="text-slate-400">Temps Restant</div>
                <div className="text-lg font-black font-mono text-emerald-400">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </div>
              </div>
              <div>
                <div className="text-slate-400">Score Didactique</div>
                <div className="text-lg font-black font-mono text-cyan-400">{evaluationScore}%</div>
              </div>
              <div>
                <div className="text-slate-400">Passagers Sauvés</div>
                <div className="text-lg font-black font-mono text-indigo-400">1 450 Colons</div>
              </div>
              <div>
                <div className="text-slate-400">Distinction</div>
                <div className="text-lg font-black font-mono text-amber-400">Expert FMTTN</div>
              </div>
            </div>

            {/* Recap didactique des 6 compétences FMTTN validées */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Bilan des Compétences Numériques Validées (Référentiel FWB) :</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold">1.</span>
                  <div>
                    <strong className="text-white">Architecture & Matériel (p. 43, 63) :</strong>
                    <p className="text-slate-400 text-[10px]">Distinction mémoire vive (volatile) et stockage permanent (disque SSD/Cloud).</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold">2.</span>
                  <div>
                    <strong className="text-white">Recherche Critique & IoT (p. 43, 73, 76) :</strong>
                    <p className="text-slate-400 text-[10px]">Repérage des publicités, fiabilité des sources et chaîne Capteurs ➔ Traitement ➔ Sorties.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold">3.</span>
                  <div>
                    <strong className="text-white">Pensée Algorithmique (p. 50, 56, 101) :</strong>
                    <p className="text-slate-400 text-[10px]">Symboles normalisés de logigrammes et distinction Algorithme (méthode) vs Programme (code).</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold">4.</span>
                  <div>
                    <strong className="text-white">Cybersécurité & Médias (p. 24, 49, 100) :</strong>
                    <p className="text-slate-400 text-[10px]">Les 5 types de traces numériques, détection du phishing et éducation critique (CSEM).</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold">5.</span>
                  <div>
                    <strong className="text-white">Régulations de Classe (p. 24-26, 43, 74) :</strong>
                    <p className="text-slate-400 text-[10px]">Accompagnement pédagogique actif face aux tableurs, e-mails, boucles et droits d'auteur.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold">6.</span>
                  <div>
                    <strong className="text-white">Les 4 Champs Curriculaires (p. 24-25) :</strong>
                    <p className="text-slate-400 text-[10px]">Données, Communication, Création de contenus et Sécurité au cœur du Tronc Commun.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={resetToBriefing}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rejouer l'expédition</span>
              </button>

              <button
                onClick={() => handleOpenPdf(2)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Consulter le Référentiel Complet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MELTDOWN / GAME OVER OVERLAY
      ───────────────────────────────────────────────────────────── */}
      {gameState === "meltdown" && (
        <div className="fixed inset-0 z-50 bg-rose-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full bg-slate-950 border-2 border-rose-500 rounded-3xl p-6 text-center space-y-5 shadow-2xl shadow-rose-600/30">
            <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-400 text-rose-400 flex items-center justify-center mx-auto animate-pulse">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-widest">
                Surcharge du Réacteur
              </span>
              <h2 className="text-2xl font-black text-white mt-2">ÉCHEC DE LA MISSION SPATIALE</h2>
              <p className="text-xs text-slate-300 mt-1">
                Le compte à rebours de 30 minutes s'est écoulé. Les moteurs se sont éteints avant que les 5 secteurs de l'Arche n'aient pu être réparés par les compétences FMTTN.
              </p>
            </div>

            <button
              onClick={resetToBriefing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Réinitialiser la simulation temporelle (30:00)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}