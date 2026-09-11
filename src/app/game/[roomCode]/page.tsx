import { GameContainer } from "./GameContainer";

export function generateStaticParams() {
  return [{ roomCode: "BLOC3-FMTTN" }];
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  const { roomCode } = await params;
  return <GameContainer roomCode={roomCode} />;
}
