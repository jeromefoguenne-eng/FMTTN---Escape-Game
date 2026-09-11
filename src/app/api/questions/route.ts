import { NextRequest, NextResponse } from "next/server";
import { getQuestionsForPath } from "@/lib/puzzles/loader";
import { getUserFromRequest } from "@/lib/db/supabase.server";
import { withRateLimit, puzzlesReadLimiter } from "@/lib/security/ratelimit";
import type { PathId, ClientMCQQuestion } from "@/types";

function sanitizeQuestion({ answer: _answer, explanation: _explanation, ...safe }: ReturnType<typeof getQuestionsForPath>[number]): ClientMCQQuestion {
  return safe;
}

const VALID_PATH_IDS = new Set<string>([
  "fmttn_grand_defi",
  "fmttn_didactique_socles",
  "fmttn_niveaux_progressivite",
  "fmttn_matieres_materiaux",
  "fmttn_objets_technologiques",
  "fmttn_techniques_culture",
  "fmttn_alimentation_habitat",
  "fmttn_securite",
  "fmttn_creation_contenus",
  "fmttn_communication",
  "fmttn_info_donnees",
  // Legacy
  "cs_algorithms", "cs_theory", "cs_discrete_math", "cs_os_compilers",
  "cs_networks", "cs_cybersecurity", "cs_ml_ai", "cs_databases",
  "cs_data_science", "cs_software_engineering", "cs_graphics", "cs_hci",
  "cs_random",
]);

export async function GET(request: NextRequest) {
  return withRateLimit(request, puzzlesReadLimiter, async () => {
    // If Supabase is configured, check auth; otherwise allow guest mode
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const user = await getUserFromRequest(request);
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    const effectivePath =
      path && VALID_PATH_IDS.has(path)
        ? (path as PathId)
        : "fmttn_grand_defi";
    const questions = getQuestionsForPath(effectivePath, 10).map(
      sanitizeQuestion
    );
    return NextResponse.json({ questions });
  });
}
