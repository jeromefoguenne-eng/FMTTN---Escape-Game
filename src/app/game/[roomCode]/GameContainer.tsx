"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SpaceshipGame } from "@/components/spaceship/SpaceshipGame";
import { Loader2 } from "lucide-react";

function GameInner({ roomCode }: { roomCode: string }) {
  const searchParams = useSearchParams();
  const [playerName, setPlayerName] = useState("Cadet FMTTN");

  useEffect(() => {
    const queryName = searchParams?.get("name");
    const storedName = typeof window !== "undefined" ? localStorage.getItem("fmttn_player_name") : null;
    if (queryName) {
      setPlayerName(queryName);
    } else if (storedName) {
      setPlayerName(storedName);
    }
  }, [searchParams]);

  return <SpaceshipGame roomCode={roomCode} playerName={playerName} />;
}

export function GameContainer({ roomCode }: { roomCode: string }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-300">
          <div className="flex items-center gap-3 font-mono text-sm">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
            <span>Initialisation de l'Arche FMTTN...</span>
          </div>
        </div>
      }
    >
      <GameInner roomCode={roomCode} />
    </Suspense>
  );
}