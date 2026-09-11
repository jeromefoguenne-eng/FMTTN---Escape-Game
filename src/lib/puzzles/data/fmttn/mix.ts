import type { MCQQuestion } from "@/types";
import { didactiqueQuestions } from "./didactique";
import { voletTechniqueQuestions } from "./volet-technique";
import { voletNumeriqueQuestions } from "./volet-numerique";
import { glossaireNiveauxQuestions } from "./glossaire";

export const allFmttnQuestions: MCQQuestion[] = [
  ...didactiqueQuestions,
  ...voletTechniqueQuestions,
  ...voletNumeriqueQuestions,
  ...glossaireNiveauxQuestions,
];
