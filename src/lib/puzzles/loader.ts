import type { MCQQuestion, PathId } from "@/types";
import { didactiqueQuestions } from "./data/fmttn/didactique";
import { voletTechniqueQuestions } from "./data/fmttn/volet-technique";
import { voletNumeriqueQuestions } from "./data/fmttn/volet-numerique";
import { glossaireNiveauxQuestions } from "./data/fmttn/glossaire";
import { allFmttnQuestions } from "./data/fmttn/mix";

export const ALL_MCQ_BY_ID: Record<string, MCQQuestion> = {};

allFmttnQuestions.forEach((q) => {
  ALL_MCQ_BY_ID[q.id] = q;
});

export function getQuestionsForPath(pathId: PathId, count: number = 10): MCQQuestion[] {
  let pool: MCQQuestion[] = [];

  switch (pathId) {
    case "fmttn_didactique_socles":
      pool = didactiqueQuestions;
      break;
    case "fmttn_niveaux_progressivite":
      pool = glossaireNiveauxQuestions;
      break;
    case "fmttn_matieres_materiaux":
    case "fmttn_objets_technologiques":
    case "fmttn_techniques_culture":
    case "fmttn_alimentation_habitat":
      pool = voletTechniqueQuestions.filter((q) => q.path === pathId);
      if (pool.length === 0) pool = voletTechniqueQuestions;
      break;
    case "fmttn_securite":
    case "fmttn_creation_contenus":
    case "fmttn_communication":
    case "fmttn_info_donnees":
      pool = voletNumeriqueQuestions.filter((q) => q.path === pathId);
      if (pool.length === 0) pool = voletNumeriqueQuestions;
      break;
    case "fmttn_grand_defi":
    default:
      pool = allFmttnQuestions;
      break;
  }

  // Shuffle pool
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
