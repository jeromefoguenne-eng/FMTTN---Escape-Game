import { NextRequest, NextResponse } from "next/server";
import { db, teams } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/db/supabase.server";
import { withRateLimit, teamCreateLimiter } from "@/lib/security/ratelimit";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, teamCreateLimiter, async () => {
    try {
      const body = await request.json().catch(() => ({}));
      const { teamName, maxSize, creatorName, selectedPath, gameTrack, slotConfigs } = body;

      if (!process.env.DATABASE_URL) {
        // Guest mode fallback
        return NextResponse.json({
          team: {
            id: "demo-team-id",
            teamName: teamName || "Équipe FMTTN",
            inviteCode: generateInviteCode(),
            maxSize: maxSize || 4,
            selectedPath: selectedPath || "fmttn_grand_defi",
            status: "ready",
            slots: slotConfigs || [{ slotIndex: 0, type: "human", displayName: creatorName || "Étudiant" }],
          },
        });
      }

      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({
          team: {
            id: "demo-team-id",
            teamName: teamName || "Équipe FMTTN",
            inviteCode: generateInviteCode(),
            maxSize: maxSize || 4,
            selectedPath: selectedPath || "fmttn_grand_defi",
            status: "ready",
            slots: slotConfigs || [{ slotIndex: 0, type: "human", displayName: creatorName || "Étudiant" }],
          },
        });
      }

      const inviteCode = generateInviteCode();
      const initialSlots = [
        { slotIndex: 0, type: "human", userId: user.id, displayName: creatorName || "Joueur 1" },
        ...(Array.isArray(slotConfigs) ? slotConfigs : []),
      ];

      const [team] = await db
        .insert(teams)
        .values({
          teamName: teamName || "Équipe FMTTN",
          inviteCode,
          maxSize: maxSize || 4,
          createdBy: user.id,
          selectedPath: selectedPath || "fmttn_grand_defi",
          gameTrack: gameTrack || "team",
          status: "forming",
          slots: initialSlots,
        })
        .returning();

      return NextResponse.json({ team }, { status: 201 });
    } catch (err) {
      return NextResponse.json({
        team: {
          id: "demo-team-id",
          teamName: "Équipe FMTTN",
          inviteCode: generateInviteCode(),
          maxSize: 4,
          selectedPath: "fmttn_grand_defi",
          status: "ready",
          slots: [{ slotIndex: 0, type: "human", displayName: "Étudiant" }],
        },
      });
    }
  });
}
