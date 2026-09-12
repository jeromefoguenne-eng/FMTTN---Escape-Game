"use client";

import { useState } from "react";
import { Bot, CheckCircle, AlertTriangle, HelpCircle, Play, RotateCcw, ArrowRight, ArrowLeft, ArrowUp, Cpu, Sparkles, Flame, Shield, Workflow, CheckCircle2 } from "lucide-react";

type Props = {
  onUnlock: () => void;
  onError: () => void;
  openPdf: (page?: number) => void;
};

type Direction = "NORTH" | "EAST" | "SOUTH" | "WEST";
type Command = "FORWARD" | "TURN_RIGHT" | "TURN_LEFT";

const GRID_SIZE = 5;
const OBSTACLES: [number, number][] = [
  [1, 0],
  [1, 2],
  [2, 2],
  [3, 1],
  [3, 3],
  [2, 4],
];

type LogigrammeSymbol = {
  id: string;
  shapeName: string;
  shapeSvg: string;
  expectedFunctionId: string;
  officialRef: string;
};

const LOGI_SYMBOLS: LogigrammeSymbol[] = [
  {
    id: "oval",
    shapeName: "Ovale / Rectangle arrondi",
    shapeSvg: "⬯",
    expectedFunctionId: "fn_start_end",
    officialRef: "Symbole normalisé Début / Fin (p. 50)",
  },
  {
    id: "rect",
    shapeName: "Rectangle",
    shapeSvg: "▭",
    expectedFunctionId: "fn_process",
    officialRef: "Symbole normalisé Processus / Action (p. 50)",
  },
  {
    id: "diamond",
    shapeName: "Losange",
    shapeSvg: "◇",
    expectedFunctionId: "fn_decision",
    officialRef: "Symbole normalisé Décision / Condition (p. 50)",
  },
];

const LOGI_FUNCTIONS = [
  {
    id: "fn_start_end",
    title: "Début et Fin",
    desc: "Marque l'initialisation ou l'arrêt définitif de la séquence algorithmique.",
    role: "Initialiser / Terminer",
  },
  {
    id: "fn_process",
    title: "Processus / Action",
    desc: "Exécute une opération ou un ordre moteur déterminé (ex. avancer d'un pas, allumer une DEL).",
    role: "Agir / Calculer",
  },
  {
    id: "fn_decision",
    title: "Décision / Condition",
    desc: "Évalue un test logique (Vrai/Faux) pour aiguiller l'exécution selon le capteur (ex. obstacle détecté ?).",
    role: "Tester / Aiguiller",
  },
];

export function Room3Engines({ onUnlock, onError, openPdf }: Props) {
  const [activeTab, setActiveTab] = useState<"logigramme" | "robot_maze">("logigramme");

  const [symbolMatches, setSymbolMatches] = useState<Record<string, string>>({});
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);
  const [algoConceptChoice, setAlgoConceptChoice] = useState<number | null>(null);
  const [tab1Validated, setTab1Validated] = useState(false);

  const [commands, setCommands] = useState<Command[]>([
    "FORWARD",
    "TURN_RIGHT",
    "FORWARD",
    "FORWARD",
    "TURN_LEFT",
    "FORWARD",
    "FORWARD",
    "TURN_RIGHT",
    "FORWARD",
  ]);

  const [robotPos, setRobotPos] = useState<[number, number]>([0, 0]);
  const [robotDir, setRobotDir] = useState<Direction>("EAST");
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [simStatus, setSimStatus] = useState<"idle" | "running" | "crashed" | "success">("idle");

  const [errorMsg, setErrorMsg] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  function handleSelectSymbol(symId: string) {
    if (symbolMatches[symId]) {
      setSymbolMatches((prev) => {
        const copy = { ...prev };
        delete copy[symId];
        return copy;
      });
      setSelectedSymbolId(null);
      return;
    }
    setSelectedSymbolId(symId);
    setErrorMsg("");
  }

  function handleAssignFunction(funcId: string) {
    if (!selectedSymbolId) {
      setErrorMsg("👉 Sélectionnez d'abord une forme géométrique à gauche, puis associez-la à sa fonction conventionnelle à droite.");
      return;
    }

    const expected = LOGI_SYMBOLS.find((s) => s.id === selectedSymbolId)?.expectedFunctionId;
    if (expected !== funcId) {
      onError();
      setErrorMsg("❌ Association géométrique incorrecte ! Consultez les symboles conventionnels du logigramme dans le référentiel p. 50.");
      setSelectedSymbolId(null);
      return;
    }

    setSymbolMatches((prev) => ({
      ...prev,
      [selectedSymbolId]: funcId,
    }));
    setSelectedSymbolId(null);
    setErrorMsg("");
  }

  function verifyTab1() {
    if (Object.keys(symbolMatches).length < LOGI_SYMBOLS.length) {
      setErrorMsg("⚠️ Veuillez associer les 3 symboles conventionnels du logigramme (p. 50).");
      return;
    }

    if (algoConceptChoice !== 1) {
      onError();
      setErrorMsg("❌ Distinction conceptuelle incorrecte ! Quelle est la différence fondamentale entre Algorithme et Programme selon le référentiel p. 56 et 101 ?");
      return;
    }

    setErrorMsg("");
    setTab1Validated(true);
    setActiveTab("robot_maze");
  }

  function isObstacle(x: number, y: number): boolean {
    return OBSTACLES.some(([ox, oy]) => ox === x && oy === y);
  }

  function addCommand(cmd: Command) {
    if (isRunning || unlocked) return;
    if (commands.length >= 15) {
      setErrorMsg("⚠️ Mémoire du robot limitée à 15 instructions.");
      return;
    }
    setCommands((prev) => [...prev, cmd]);
    setErrorMsg("");
  }

  function removeCommand(index: number) {
    if (isRunning || unlocked) return;
    setCommands((prev) => prev.filter((_, i) => i !== index));
    setErrorMsg("");
  }

  function resetSimulation() {
    setRobotPos([0, 0]);
    setRobotDir("EAST");
    setIsRunning(false);
    setActiveStepIndex(null);
    setSimStatus("idle");
    setErrorMsg("");
  }

  function clearCommands() {
    if (isRunning || unlocked) return;
    setCommands([]);
    resetSimulation();
  }

  async function executeProgram() {
    if (commands.length === 0) {
      setErrorMsg("⚠️ Ajoutez des blocs d'instructions pour guider le robot.");
      return;
    }

    resetSimulation();
    setIsRunning(true);
    setSimStatus("running");
    setErrorMsg("");

    let curX = 0;
    let curY = 0;
    let curDir: Direction = "EAST";

    for (let i = 0; i < commands.length; i++) {
      setActiveStepIndex(i);
      const cmd = commands[i];

      await new Promise((res) => setTimeout(res, 500));

      if (cmd === "TURN_RIGHT") {
        if (curDir === "NORTH") curDir = "EAST";
        else if (curDir === "EAST") curDir = "SOUTH";
        else if (curDir === "SOUTH") curDir = "WEST";
        else if (curDir === "WEST") curDir = "NORTH";
        setRobotDir(curDir);
      } else if (cmd === "TURN_LEFT") {
        if (curDir === "NORTH") curDir = "WEST";
        else if (curDir === "WEST") curDir = "SOUTH";
        else if (curDir === "SOUTH") curDir = "EAST";
        else if (curDir === "EAST") curDir = "NORTH";
        setRobotDir(curDir);
      } else if (cmd === "FORWARD") {
        let nextX = curX;
        let nextY = curY;
        if (curDir === "NORTH") nextY -= 1;
        else if (curDir === "SOUTH") nextY += 1;
        else if (curDir === "EAST") nextX += 1;
        else if (curDir === "WEST") nextX -= 1;

        if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
          setIsRunning(false);
          setSimStatus("crashed");
          onError();
          setErrorMsg("💥 Collision avec la paroi externe du conduit ! Ajustez vos rotations.");
          return;
        }

        if (isObstacle(nextX, nextY)) {
          setIsRunning(false);
          setSimStatus("crashed");
          onError();
          setErrorMsg(`💥 Collision avec un débris sur la case (${nextX}, ${nextY}) ! Ajustez la trajectoire pour contourner.`);
          return;
        }

        curX = nextX;
        curY = nextY;
        setRobotPos([curX, curY]);
      }
    }

    setIsRunning(false);
    setActiveStepIndex(null);

    if (curX === 4 && curY === 4) {
      setSimStatus("success");
      setUnlocked(true);
      onUnlock();
    } else {
      setSimStatus("idle");
      onError();
      setErrorMsg(`⚠️ Le robot s'est arrêté en (${curX}, ${curY}) sans atteindre le cœur du réacteur (case 4, 4). Complétez le programme !`);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/70 border border-amber-800/40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-mono text-amber-400">Secteur 03 • Niveau 3 (Avancé - Pensée Computationnelle)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PENSÉE COMPUTATIONNELLE & ROBOTIQUE (P. 50, 56, 101)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Logigramme Conventionnel & Pilotage du Robot Thymio
            </h2>
            <p className="text-xs text-slate-300">
              Maîtrisez les symboles normés du logigramme et la distinction Algorithme/Programme (p. 50 & 56), puis guidez le Thymio par programmation par blocs (Scratch).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openPdf(50)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold transition cursor-pointer"
            title="Consulter les symboles du logigramme en P5"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Symboles p. 50</span>
          </button>
          <button
            onClick={() => openPdf(101)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold transition cursor-pointer"
            title="Consulter le glossaire numérique"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Glossaire p. 101</span>
          </button>
        </div>
      </div>

      {/* TABS HEADER */}
      <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <button
          onClick={() => setActiveTab("logigramme")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "logigramme"
              ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>1. Symboles du Logigramme & Pensée Algorithmique (p. 50 & 56)</span>
          {tab1Validated && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
        </button>

        <button
          onClick={() => setActiveTab("robot_maze")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "robot_maze"
              ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>2. Labyrinthe Robotique Thymio (Scratch)</span>
          {unlocked && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
        </button>
      </div>

      {/* UNLOCKED SUCCESS BANNER */}
      {unlocked ? (
        <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-emerald-300">
            LOGIGRAMME MAÎTRISÉ & RÉACTEUR STABILISÉ PAR LE THYMIO !
          </h3>
          <p className="text-sm text-emerald-200/90 max-w-xl mx-auto">
            Brillante démonstration didactique et technique ! Vous avez formalisé les symboles conventionnels du logigramme (p. 50), clarifié la distinction Algorithme/Programme (p. 56 & 101) et conduit l'automate au cœur du réacteur.
          </p>
        </div>
      ) : activeTab === "logigramme" ? (
        /* TAB 1 */
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <span>A. Les Symboles Conventionnels du Logigramme (Référentiel p. 50 - P5)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Cliquez sur un symbole géométrique à gauche, puis associez-le à sa signification conventionnelle normée à droite :
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              {/* Left: Shapes */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  Formes Normalisées :
                </span>
                {LOGI_SYMBOLS.map((sym) => {
                  const isMatched = symbolMatches[sym.id] !== undefined;
                  const isSelected = selectedSymbolId === sym.id;

                  return (
                    <div
                      key={sym.id}
                      onClick={() => handleSelectSymbol(sym.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                        isMatched
                          ? "bg-emerald-950/40 border-emerald-500 text-emerald-200 opacity-90 shadow-md"
                          : isSelected
                          ? "bg-amber-600 border-white text-white scale-105 shadow-xl ring-2 ring-white"
                          : "bg-slate-950/90 border-slate-700/80 hover:border-amber-400 text-slate-200"
                      }`}
                    >
                      <div className="text-3xl font-mono shrink-0 w-10 text-center">{sym.shapeSvg}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs sm:text-sm">{sym.shapeName}</div>
                        <p className="text-[10px] opacity-75">{sym.officialRef}</p>
                      </div>
                      {isMatched ? (
                        <span className="text-emerald-400 font-mono text-xs font-bold shrink-0">✓ Relié</span>
                      ) : isSelected ? (
                        <span className="text-xs font-bold text-amber-200 animate-pulse shrink-0">Choisi ➔</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {/* Right: Normalized Functions */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  Rôles Conventionnels :
                </span>
                {LOGI_FUNCTIONS.map((fn) => {
                  const isUsed = Object.values(symbolMatches).includes(fn.id);
                  const isTargetReady = selectedSymbolId !== null;

                  return (
                    <div
                      key={fn.id}
                      onClick={() => handleAssignFunction(fn.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isUsed
                          ? "bg-emerald-950/40 border-emerald-500 text-emerald-200 opacity-90 shadow-md"
                          : isTargetReady
                          ? "border-amber-500/60 bg-amber-950/30 text-amber-200 hover:scale-[1.02] ring-1 ring-white"
                          : "bg-slate-950/90 border-slate-700 text-slate-400"
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-slate-800 text-xs font-mono font-bold shrink-0 text-amber-300">
                        {fn.role}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-white">{fn.title}</div>
                        <p className="text-[11px] opacity-80 mt-0.5">{fn.desc}</p>
                      </div>
                      {isUsed && (
                        <span className="text-emerald-400 font-mono text-xs font-bold shrink-0">✓ Validé</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sub-part B */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="border-b border-slate-800/80 pb-2">
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-mono">
                B. Épistémologie Didactique : Différencier Algorithme & Programme (p. 56 & 100-101)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                En tant que futur enseignant de Bloc 3, quelle proposition transmet la distinction exacte du référentiel à vos élèves ?
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 1,
                  title: "Distinction Didactique Rigoureuse du Tronc Commun (p. 56 & 100-101)",
                  text: "L'Algorithme est la méthode logique abstraite et la suite finie d'opérations pour résoudre un problème (indépendant de toute machine, mobilisable en débranché). Le Programme est sa transcription concrète dans un langage formel (Scratch, Python) exécutable par l'ordinateur ou le Thymio.",
                  correct: true,
                },
                {
                  id: 2,
                  title: "Confusion Didactique Fréquente (Outil vs Concept)",
                  text: "Scratch est un algorithme visuel par blocs, tandis que Python ou le C++ sont des programmes textuels.",
                  correct: false,
                },
                {
                  id: 3,
                  title: "Confusion Matériel / Logiciel",
                  text: "L'algorithme concerne uniquement les calculs mathématiques sur papier, tandis que le programme désigne le châssis physique et les moteurs du robot Thymio.",
                  correct: false,
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setAlgoConceptChoice(opt.id);
                    setErrorMsg("");
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                    algoConceptChoice === opt.id
                      ? "bg-amber-950/60 border-amber-400 text-amber-100 ring-2 ring-amber-400/40"
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

          <div className="flex justify-end pt-2">
            <button
              onClick={verifyTab1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer hover:scale-105"
            >
              <span>Valider le Logigramme & Débloquer le Thymio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* TAB 2 */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Conduits du Réacteur (Grille 5x5)</span>
              </span>
              <span className="text-amber-400">
                Orientation robot : <strong>{robotDir}</strong>
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 aspect-square max-w-md mx-auto">
              {Array.from({ length: GRID_SIZE }).map((_, y) =>
                Array.from({ length: GRID_SIZE }).map((_, x) => {
                  const isRobotHere = robotPos[0] === x && robotPos[1] === y;
                  const isBlocked = isObstacle(x, y);
                  const isCore = x === 4 && y === 4;
                  const isStart = x === 0 && y === 0;

                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`relative rounded-xl border flex items-center justify-center transition-all duration-300 ${
                        isRobotHere
                          ? simStatus === "crashed"
                            ? "bg-rose-600/80 border-white ring-4 ring-rose-500 scale-105"
                            : "bg-amber-500/30 border-amber-400 ring-2 ring-amber-400 shadow-lg shadow-amber-500/40"
                          : isBlocked
                          ? "bg-slate-800/90 border-red-900/60 text-slate-500"
                          : isCore
                          ? "bg-gradient-to-br from-red-600/40 to-amber-600/40 border-amber-400 animate-pulse"
                          : isStart
                          ? "bg-blue-950/40 border-blue-600/40"
                          : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80"
                      }`}
                    >
                      {isRobotHere ? (
                        <div
                          style={{
                            transform:
                              robotDir === "EAST"
                                ? "rotate(0deg)"
                                : robotDir === "SOUTH"
                                ? "rotate(90deg)"
                                : robotDir === "WEST"
                                ? "rotate(180deg)"
                                : "rotate(270deg)",
                          }}
                          className="transition-transform duration-300 text-2xl filter drop-shadow-md select-none"
                        >
                          🤖
                        </div>
                      ) : isBlocked ? (
                        <div className="flex flex-col items-center justify-center text-xs opacity-60">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-[9px] font-mono text-slate-400">Débris</span>
                        </div>
                      ) : isCore ? (
                        <div className="flex flex-col items-center justify-center text-xs text-amber-300 font-bold">
                          <span className="text-xl">⚛️</span>
                          <span className="text-[9px] font-mono">CŒUR</span>
                        </div>
                      ) : isStart ? (
                        <span className="text-[9px] font-mono text-blue-400">Sas</span>
                      ) : (
                        <span className="text-[9px] font-mono text-slate-700">
                          {x},{y}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1 font-mono">
              <span className="flex items-center gap-1">
                <span>🤖</span> Robot Thymio
              </span>
              <span className="flex items-center gap-1">
                <span className="text-orange-500">🔥</span> Débris (Éviter)
              </span>
              <span className="flex items-center gap-1">
                <span>⚛️</span> Cœur Réacteur (Objectif)
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                1. Boîte de Blocs d'Instructions (Cliquez pour ajouter) :
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addCommand("FORWARD")}
                  disabled={isRunning}
                  className="p-3 rounded-xl bg-blue-950/70 border border-blue-500/60 hover:bg-blue-900 text-blue-200 text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer hover:scale-105 disabled:opacity-50"
                >
                  <ArrowUp className="w-5 h-5 text-blue-400" />
                  <span>Avancer ⬆️</span>
                </button>

                <button
                  onClick={() => addCommand("TURN_RIGHT")}
                  disabled={isRunning}
                  className="p-3 rounded-xl bg-purple-950/70 border border-purple-500/60 hover:bg-purple-900 text-purple-200 text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer hover:scale-105 disabled:opacity-50"
                >
                  <span className="text-lg">↻</span>
                  <span>Tourner 90° D</span>
                </button>

                <button
                  onClick={() => addCommand("TURN_LEFT")}
                  disabled={isRunning}
                  className="p-3 rounded-xl bg-purple-950/70 border border-purple-500/60 hover:bg-purple-900 text-purple-200 text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer hover:scale-105 disabled:opacity-50"
                >
                  <span className="text-lg">↺</span>
                  <span>Tourner 90° G</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-300">
                  2. Séquence Algorithmique ({commands.length} blocs) :
                </span>
                <button
                  onClick={clearCommands}
                  disabled={isRunning}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition cursor-pointer"
                >
                  Vider tout ✕
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[90px] p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 items-center">
                {commands.map((cmd, idx) => {
                  const isActive = activeStepIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => removeCommand(idx)}
                      title="Cliquez pour supprimer"
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                        isActive
                          ? "bg-amber-500 text-slate-950 border-white ring-2 ring-white scale-110 shadow-lg"
                          : cmd === "FORWARD"
                          ? "bg-blue-600/30 border-blue-500/50 text-blue-200 hover:border-rose-500"
                          : "bg-purple-600/30 border-purple-500/50 text-purple-200 hover:border-rose-500"
                      }`}
                    >
                      <span>{idx + 1}.</span>
                      <span>{cmd === "FORWARD" ? "⬆️ Avancer" : cmd === "TURN_RIGHT" ? "↻ Droite" : "↺ Gauche"}</span>
                      <span className="text-[10px] opacity-60 ml-0.5">✕</span>
                    </div>
                  );
                })}

                {commands.length === 0 && (
                  <span className="text-xs text-slate-500 italic">
                    Aucun bloc. Cliquez sur les boutons ci-dessus pour composer l'itinéraire du robot.
                  </span>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <div>{errorMsg}</div>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={resetSimulation}
                disabled={isRunning}
                className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser</span>
              </button>

              <button
                onClick={executeProgram}
                disabled={isRunning}
                className="w-2/3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30 transition cursor-pointer hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isRunning ? "Exécution du robot en cours..." : "Exécuter le Programme Thymio"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
