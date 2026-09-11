import { NextRequest, NextResponse } from "next/server";
import { ALL_MCQ_BY_ID } from "@/lib/puzzles/loader";
import { mcqGradeSchema } from "@/lib/security/schemas";
import { withRateLimit, mcqGradeLimiter } from "@/lib/security/ratelimit";

export async function POST(request: NextRequest) {
  return withRateLimit(request, mcqGradeLimiter, async () => {
    const body = await request.json();
    const parsed = mcqGradeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { roomCode, answers } = parsed.data;

    const results: Array<{
      questionId: string;
      isCorrect: boolean;
      correctIndex: number;
      explanation: string;
    }> = [];

    for (const { questionId, selectedIndex } of answers) {
      const question = ALL_MCQ_BY_ID[questionId];
      if (!question) continue;

      const isCorrect = selectedIndex !== null && selectedIndex === question.answer;

      results.push({
        questionId,
        isCorrect,
        correctIndex: question.answer,
        explanation: question.explanation,
      });
    }

    return NextResponse.json({ results });
  });
}
