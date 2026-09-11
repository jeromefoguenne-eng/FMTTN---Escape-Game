"use client";

import { useState, useEffect } from "react";
import { Bot, CheckCircle, AlertTriangle, HelpCircle, Play, RotateCcw, ArrowRight, ArrowUp, ArrowDown, Cpu, Sparkles, Flame, Shield } from "lucide-react";

type Props = {
  onUnlock: () => void;
  onError: () => void;
  openPdf: (page?: number) => void;
};

type Direction = "NORTH" | "EAST" | "SOUTH" | "WEST";

type Command = "FORWARD" | "TURN_RIGHT" | "TURN_LEFT";

// 5x5 Grid Maze
// 0: Empty path, 1: Obstacle / Wall, 2: Start (0,0), 3: Target Core (4,4)
const GRID_SIZE = 5;
const OBSTACLES: [number, number][] = [
  [1, 0],
  [1, 2],
  [2, 2],
  [3, 1],
  [3, 3],
  [2, 4],
];

export function Room3Engines({ onUnlock, onError, openPdf }: Props) {
  // Instruction stack
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

  // Robot simulation state
  const [robotPos, setRobotPos] = useState<[number, number]>([0, 0]);
  const [robotDir, setRobotDir] = useState<Direction>("EAST");
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const [simStatus, setSimStatus] = useState<"idle" | "running" | "crashed" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [unlocked, setUnlocked] = useState(false);

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

      // Delay for animation
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

        // Check boundary
        if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
          setIsRunning(false);
          setSimStatus("crashed");
          onError();
          setErrorMsg("💥 Collision avec la paroi externe du conduit ! Ajustez vos rotations.");
          return;
        }

        // Check obstacle
        if (isObstacle(nextX, nextY)) {
          setIsRunning(false);
          setSimStatus("crashed");
          onError();
          setErrorMsg(`💥 Collision avec un débris sur la case (${nextX}, ${nextY}) ! Utilisez les capteurs infrarouges pour contourner.`);
          return;
        }

        curX = nextX;
        curY = nextY;
        setRobotPos([curX, curY]);
      }
    }

    setIsRunning(false);
    setActiveStepIndex(null);

    // Check if reached core (4, 4)
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
              <span className="text-xs uppercase tracking-widest font-mono text-amber-400">Secteur 03</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PENSÉE COMPUTATIONNELLE & ROBOTIQUE THYMIO (P. 101)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Mini-Labyrinthe : Programmation par Blocs du Robot Thymio
            </h2>
            <p className="text-xs text-slate-300">
              Comme sur Scratch / LearningApps, assemblez les blocs d'instructions pour guider le robot Thymio jusqu'au cœur du réacteur sans heurter les débris.
            </p>
          </div>
        </div>

        <button
          onClick={() => openPdf(101)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold transition shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Consulter Référentiel p. 101</span>
        </button>
      </div>

      {/* UNLOCKED SUCCESS */}
      {unlocked ? (
        <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-emerald-300">
            ROBOT THYMIO AU CŒUR DU RÉACTEUR !
          </h3>
          <p className="text-sm text-emerald-200/90 max-w-xl mx-auto">
            Génie algorithmique ! Votre séquence de blocs d'instructions a guidé l'automate à travers les conduits étroits sans aucune collision. Le cœur à plasma est réparé !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 5x5 Visual Grid Canvas */}
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

            {/* The 5x5 Maze Grid */}
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
                      {/* Cell Content */}
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

            {/* Grid Legend */}
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

          {/* Right Column: Visual Block Programmer (Scratch style) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Block toolbox */}
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

            {/* Assembled Program Stack */}
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

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <div>{errorMsg}</div>
              </div>
            )}

            {/* Execution Controls */}
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
