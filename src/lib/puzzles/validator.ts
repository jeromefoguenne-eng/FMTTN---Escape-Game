import { PUZZLES } from "./data/puzzles";

type ValidationResult = {
  isCorrect: boolean;
  feedback?: string;
};

// Cipher: normalize and compare
function validateCipher(answer: unknown, puzzleId: string): ValidationResult {
  const normalized =
    typeof answer === "string" ? answer.trim().toUpperCase() : "";

  const ANSWERS: Record<string, string[]> = {
    fmttn_axiome_fondateur: ["TECHNOLOGIQUE", "L'OBJET QUI EST TECHNOLOGIQUE", "TECHNOLOGIQUES"],
    fmttn_seuil_primaire: ["P3", "3E PRIMAIRE", "3EME PRIMAIRE", "3E", "3"],
    fmttn_compost_equilibre: ["BRUNS", "BRUN", "DECHETS BRUNS", "DECHET BRUN"],
    caesar_cipher_01: ["HELLO WORLD"],
  };

  const valid = ANSWERS[puzzleId] ?? [];
  return {
    isCorrect: valid.includes(normalized),
    feedback: valid.includes(normalized)
      ? "Bravo ! Énigme résolue avec succès d'après le référentiel FMTTN."
      : `"${normalized}" n'est pas la réponse attendue. Consultez la page indiquée du référentiel FMTTN !`,
  };
}

// Code fill: compare the filled-in expression (trimmed, case-insensitive)
function validateCodeFill(answer: unknown, puzzleId: string): ValidationResult {
  const normalized =
    typeof answer === "string"
      ? answer.trim().replace(/\s+/g, " ").toLowerCase()
      : "";

  const ANSWERS: Record<string, string[]> = {
    fmttn_code_identite: [
      '"activites"',
      "'activites'",
      '"activités"',
      "'activités'",
      "activites",
      "activités",
    ],
    fmttn_logigramme_sequence: [
      "len(bac_dechets) > 0",
      "len(bac_dechets)>0",
      "bac_dechets",
      "len(bac_dechets) != 0",
      "len(bac_dechets)!=0",
    ],
    bubble_sort_01: ["arr[j] > arr[j + 1]", "arr[j]>arr[j+1]"],
    binary_search_01: ["left + (right - left) // 2", "left+(right-left)//2", "(left + right) // 2"],
  };

  const valid = (ANSWERS[puzzleId] ?? []).map((a) =>
    a.replace(/\s+/g, " ").toLowerCase()
  );

  return {
    isCorrect: valid.includes(normalized),
    feedback: valid.includes(normalized)
      ? "Excellent ! Logique validée selon les attendus FMTTN."
      : "Ce n'est pas tout à fait cela. Vérifiez la formulation dans le référentiel.",
  };
}

function validateRecursionTrace(_answer: unknown, _puzzleId: string): ValidationResult {
  return { isCorrect: true, feedback: "Validé !" };
}

function validateMaze(_answer: unknown, _puzzleId: string): ValidationResult {
  return { isCorrect: true, feedback: "Labyrinthe traversé avec succès !" };
}

export function validateAnswer(
  puzzleId: string,
  answer: unknown
): ValidationResult {
  const puzzle = PUZZLES[puzzleId];
  if (!puzzle) return { isCorrect: false, feedback: "Énigme inconnue." };

  switch (puzzle.type) {
    case "cipher":
      return validateCipher(answer, puzzleId);
    case "code_fill":
      return validateCodeFill(answer, puzzleId);
    case "recursion_trace":
      return validateRecursionTrace(answer, puzzleId);
    case "maze":
      return validateMaze(answer, puzzleId);
    default:
      return { isCorrect: false, feedback: "Type d'épreuve non reconnu." };
  }
}

export function calculateScore(
  basePoints: number,
  hintsUsed: number,
  timeTakenSeconds: number,
  timeLimitSeconds: number
): number {
  const hintPenalty = hintsUsed * 15;
  const timePenalty = Math.floor((timeTakenSeconds / timeLimitSeconds) * 30);
  return Math.max(0, basePoints - hintPenalty - timePenalty);
}
