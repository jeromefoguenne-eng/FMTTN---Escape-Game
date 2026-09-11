export type AgentPersonality = "supportive" | "spoon_feeder" | "supervisor" | "friendly";

export type PathId =
  | "fmttn_grand_defi"
  | "fmttn_didactique_socles"
  | "fmttn_niveaux_progressivite"
  | "fmttn_matieres_materiaux"
  | "fmttn_objets_technologiques"
  | "fmttn_techniques_culture"
  | "fmttn_alimentation_habitat"
  | "fmttn_info_donnees"
  | "fmttn_communication"
  | "fmttn_creation_contenus"
  | "fmttn_securite"
  // Legacy paths preserved for backward compatibility
  | "cs_algorithms"
  | "cs_theory"
  | "cs_discrete_math"
  | "cs_os_compilers"
  | "cs_networks"
  | "cs_cybersecurity"
  | "cs_ml_ai"
  | "cs_databases"
  | "cs_data_science"
  | "cs_software_engineering"
  | "cs_graphics"
  | "cs_hci"
  | "cs_random"
  | "gmat_quant"
  | "gmat_verbal"
  | "gmat_data_insights"
  | "gmat_full_test"
  | (string & {});

export type MCQQuestion = {
  id: string;
  path: PathId;
  passage?: string;
  question: string;
  options: readonly [string, string, string, string] | readonly [string, string, string, string, string];
  answer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
};

export type ClientMCQQuestion = Omit<MCQQuestion, "answer" | "explanation"> & {
  answer?: number;
  explanation?: string;
};

export type SlotType = "human" | "agent";

export type TeamSlot = {
  slotIndex: number;
  type: SlotType;
  userId?: string;
  agentPersonality?: AgentPersonality;
  displayName: string;
  joinedAt?: string;
};

export type Team = {
  id: string;
  teamName: string;
  inviteCode: string;
  maxSize: number;
  slots: TeamSlot[];
  createdBy: string;
  selectedPath?: PathId;
  status: "forming" | "ready" | "in_game" | "completed";
  createdAt: string;
};

export type PuzzleType =
  | "code_fill"
  | "cipher"
  | "recursion_trace"
  | "maze"
  | "mcq";

export type PuzzleCategory =
  | "sorting"
  | "cipher"
  | "recursion"
  | "maze"
  | "data_structures"
  | "fmttn_didactique"
  | "fmttn_technique"
  | "fmttn_numerique";

export type PuzzleTestCase = {
  input: unknown;
  expected: unknown;
};

export type PuzzleSetup = {
  language?: string;
  starterCode?: string;
  blankPlaceholder?: string;
  testCases?: PuzzleTestCase[];
  ciphertext?: string;
  shiftHint?: string;
  code?: string;
  callToTrace?: string;
  blanksInStack?: { frameId: number; field: string }[];
  grid?: number[][];
  start?: [number, number];
  end?: [number, number];
  algorithm?: string;
  referencePage?: string;
};

export type Puzzle = {
  id: string;
  type: PuzzleType;
  category: PuzzleCategory;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  stage: number;
  description: string;
  setup: PuzzleSetup;
  hints: string[];
  maxAttempts: number;
  timeLimitSeconds: number;
  points: number;
  agentContext: string;
};

export type GameSession = {
  id: string;
  teamId: string;
  roomCode: string;
  puzzleSetId: string;
  currentPuzzleIndex: number;
  totalScore: number;
  status: "active" | "completed" | "abandoned";
  startedAt: string;
  completedAt?: string;
};

export type AgentMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentPersonality?: AgentPersonality;
  timestamp: number;
};

export type PlayerSkill = {
  userId: string;
  category: PuzzleCategory;
  theta: number;
  totalAttempts: number;
};

export type PuzzleResult = {
  puzzleId: string;
  title: string;
  isCorrect: boolean;
  hintsUsed: number;
  timeTakenSeconds: number;
  score: number;
};
