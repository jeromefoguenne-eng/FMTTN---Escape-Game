import { z } from "zod";

export const createTeamSchema = z.object({
  teamName: z.string().min(2).max(50),
  maxSize: z.number().int().min(1).max(6),
  creatorName: z.string().min(1).max(50),
  selectedPath: z.string().optional(),
  gameTrack: z.enum(["team", "race"]).optional(),
  slotConfigs: z
    .array(
      z.object({
        slotIndex: z.number().int().min(1).max(5),
        type: z.enum(["human", "agent"]),
        agentPersonality: z
          .enum(["supportive", "spoon_feeder", "supervisor", "friendly"])
          .optional(),
      })
    )
    .optional(),
});

export const joinTeamSchema = z.object({
  inviteCode: z.string().min(4).max(12),
  displayName: z.string().min(1).max(50),
});

export const joinSlotSchema = z.object({
  slotIndex: z.number().int().min(0).max(5),
  type: z.enum(["human", "agent"]),
  agentPersonality: z
    .enum(["supportive", "spoon_feeder", "supervisor", "friendly"])
    .optional(),
  displayName: z.string().min(1).max(50),
});

export const trackVisitSchema = z.object({
  path: z.string().min(1).max(200),
  referrer: z.string().max(500).optional(),
});

export const submitAnswerSchema = z.object({
  puzzleId: z.string().min(1),
  answer: z.union([z.string(), z.record(z.string(), z.string()), z.array(z.array(z.number()))]),
  timeTakenSeconds: z.number().int().min(0),
  hintsUsed: z.number().int().min(0),
});

export const agentChatSchema = z.object({
  sessionId: z.string().min(1).max(100),
  puzzleId: z.string().min(1),
  agentPersonality: z.enum(["supportive", "spoon_feeder", "supervisor", "friendly"]),
  playerAttempt: z.string().max(2000).optional(),
  timeRemainingSeconds: z.number().int().min(0),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      })
    )
    .max(20),
  trigger: z
    .enum(["opening", "wrong_answer", "silence", "low_timer", "peer_greeting"])
    .optional(),
  triggerContext: z.string().max(2000).optional(),
});

export const hintRequestSchema = z.object({
  puzzleId: z.string().min(1),
  sessionId: z.string().min(1).max(100),
  playerAttempt: z.string().max(2000),
  agentPersonality: z.enum(["supportive", "spoon_feeder", "supervisor", "friendly"]),
  hintsUsed: z.number().int().min(0),
});

export const completeRoomSchema = z.object({
  roomCode: z.string().min(4).max(32),
  finalScore: z.number().int().min(0).max(50000),
});

export const mcqGradeSchema = z.object({
  roomCode: z.string().min(4).max(32),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        selectedIndex: z.number().int().min(0).max(4).nullable(),
      })
    )
    .min(1)
    .max(30),
});

export const gmatResultSchema = z.object({
  roomCode: z.string().min(4).max(32),
  pathId: z.string().min(1).max(50),
  testNum: z.number().int().min(1).max(20).nullable().optional(),
  totalScore: z.number().min(0).max(1000),
  sectionScores: z
    .array(
      z.object({
        label: z.string(),
        score: z.number(),
        correct: z.number(),
        total: z.number(),
      })
    )
    .optional(),
  wrongAnswers: z.array(z.unknown()).optional(),
});
