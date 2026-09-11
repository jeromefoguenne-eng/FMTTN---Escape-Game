import { NextRequest, NextResponse } from "next/server";
import { db, teams, gameSessions } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";
import { createSupabaseServerClient, getUserFromRequest } from "@/lib/db/supabase.server";
import { validateAnswer, calculateScore } from "@/lib/puzzles/validator";
import { PUZZLES, getPuzzleOrder } from "@/lib/puzzles/data/puzzles";
import { submitAnswerSchema } from "@/lib/security/schemas";
import { withRateLimit, puzzleSubmitLimiter, roomLimiter } from "@/lib/security/ratelimit";

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

// POST /api/rooms — start a game session
export async function POST(request: NextRequest) {
  return withRateLimit(request, roomLimiter, async () => {
    try {
      const body = await request.json().catch(() => ({}));
      const teamId = body?.teamId as string;

      // Guest / Offline fallback
      if (!process.env.DATABASE_URL || !teamId || teamId.startsWith("demo-")) {
        const roomCode = "FMTTN-" + generateRoomCode();
        return NextResponse.json({
          roomCode,
          session: {
            id: "demo-session-id",
            roomCode,
            puzzleSetId: "fmttn_grand_defi",
            currentPuzzleIndex: 0,
            totalScore: 0,
            status: "active",
          },
        });
      }

      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const [team] = await db.select().from(teams).where(eq(teams.id, teamId));
      if (!team) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }

      const roomCode = generateRoomCode();
      const puzzleSetId = team.selectedPath ?? "fmttn_grand_defi";

      const [session] = await db
        .insert(gameSessions)
        .values({
          teamId,
          userId: user.id,
          roomCode,
          puzzleSetId,
          currentPuzzleIndex: 0,
          totalScore: 0,
          status: "active",
        })
        .returning();

      return NextResponse.json({ roomCode, session });
    } catch (err: unknown) {
      const roomCode = "FMTTN-" + generateRoomCode();
      return NextResponse.json({
        roomCode,
        session: {
          id: "demo-session-id",
          roomCode,
          puzzleSetId: "fmttn_grand_defi",
          currentPuzzleIndex: 0,
          totalScore: 0,
          status: "active",
        },
      });
    }
  });
}

// GET /api/rooms — get room state
export async function GET(request: NextRequest) {
  return withRateLimit(request, roomLimiter, async () => {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const teamId = searchParams.get("teamId");

    // Local / Guest room handling
    if (code && (code.startsWith("FMTTN-") || code.startsWith("SOLO-") || !process.env.DATABASE_URL)) {
      return NextResponse.json({
        session: {
          id: "demo-session-id",
          teamId: "demo-team-id",
          roomCode: code,
          puzzleSetId: "fmttn_grand_defi",
          currentPuzzleIndex: 0,
          totalScore: 0,
          status: "active",
          startedAt: new Date().toISOString(),
        },
        isMcqMode: true,
        selectedPath: "fmttn_grand_defi",
        gameTrack: "team",
        agentPersonalities: ["supportive", "spoon_feeder", "supervisor", "friendly"],
        humanSlots: [{ userId: "guest", displayName: "Étudiant HECh" }],
      });
    }

    if (!code) {
      return NextResponse.json({ error: "Missing room code" }, { status: 400 });
    }

    try {
      const [session] = await db
        .select()
        .from(gameSessions)
        .where(eq(gameSessions.roomCode, code.toUpperCase()));

      if (!session) {
        // Fallback for demo
        return NextResponse.json({
          session: {
            id: "demo-session-id",
            teamId: "demo-team-id",
            roomCode: code,
            puzzleSetId: "fmttn_grand_defi",
            currentPuzzleIndex: 0,
            totalScore: 0,
            status: "active",
            startedAt: new Date().toISOString(),
          },
          isMcqMode: true,
          selectedPath: "fmttn_grand_defi",
          gameTrack: "team",
          agentPersonalities: ["supportive"],
          humanSlots: [{ userId: "guest", displayName: "Étudiant" }],
        });
      }

      const [team] = await db.select().from(teams).where(eq(teams.id, session.teamId));
      const slots = team?.slots ?? [];

      const agentPersonalities = (slots as any[])
        .filter(s => s.type === "agent" && s.agentPersonality)
        .map(s => s.agentPersonality);

      const humanSlots = (slots as any[])
        .filter(s => s.type === "human" && s.userId)
        .map(s => ({ userId: s.userId, displayName: s.displayName }));

      return NextResponse.json({
        session,
        isMcqMode: true,
        selectedPath: session.puzzleSetId,
        gameTrack: team?.gameTrack ?? "team",
        agentPersonalities: agentPersonalities.length > 0 ? agentPersonalities : ["supportive"],
        humanSlots,
      });
    } catch (e) {
      return NextResponse.json({
        session: {
          id: "demo-session-id",
          teamId: "demo-team-id",
          roomCode: code,
          puzzleSetId: "fmttn_grand_defi",
          currentPuzzleIndex: 0,
          totalScore: 0,
          status: "active",
          startedAt: new Date().toISOString(),
        },
        isMcqMode: true,
        selectedPath: "fmttn_grand_defi",
        gameTrack: "team",
        agentPersonalities: ["supportive"],
        humanSlots: [{ userId: "guest", displayName: "Étudiant" }],
      });
    }
  });
}
