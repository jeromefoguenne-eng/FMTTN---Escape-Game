import type { Puzzle } from "@/types";

export const PUZZLES: Record<string, Puzzle> = {
  fmttn_axiome_fondateur: {
    id: "fmttn_axiome_fondateur",
    type: "cipher",
    category: "fmttn_didactique",
    title: "Le Verrou de l'Atelier Technique",
    difficulty: "easy",
    stage: 1,
    description:
      "Pour déverrouiller la porte de l'atelier didactique, vous devez décoder la maxime fondatrice de la page 99 du référentiel qui réconcilie le manuel et l'intellectuel : 'C'est le geste qui est technique, c'est l'objet qui est... ?'",
    setup: {
      ciphertext: "WHFKQRORJLTXH",
      shiftHint: "Chiffre de César (décalage de 3). Trouvez le mot final de la formule officielle p. 99.",
      referencePage: "p. 99",
    },
    hints: [
      "Consultez la page 99 du référentiel FMTTN, dans l'encadré du Volet 1 du glossaire.",
      "La phrase complète est : 'C’est le geste qui est technique, c’est l’objet qui est technologique.'",
      "Le mot décodé est : TECHNOLOGIQUE (sans accent dans le mot de passe).",
    ],
    maxAttempts: 5,
    timeLimitSeconds: 300,
    points: 100,
    agentContext:
      "L'énigme porte sur la page 99 du référentiel FMTTN : 'C'est le geste qui est technique, c'est l'objet qui est technologique'. Le mot de passe attendu est TECHNOLOGIQUE.",
  },

  fmttn_code_identite: {
    id: "fmttn_code_identite",
    type: "code_fill",
    category: "fmttn_numerique",
    title: "Les 5 Niveaux de l'Identité Numérique",
    difficulty: "medium",
    stage: 2,
    description:
      "Le serveur de l'école est crypté. Selon le glossaire FMTTN (page 100), l'identité numérique comporte 5 niveaux : e-réputation, publication, activités, logs in, et identité personnelle. Complétez la fonction ci-dessous avec le nom exact du niveau correspondant aux traces, historiques et cookies.",
    setup: {
      language: "python",
      starterCode: `def verifier_identite_numerique(traces_et_cookies):
    # Selon le glossaire FMTTN p. 100 :
    # Quel est le niveau qui regroupe les traces, historiques de navigation et cookies ?
    niveau = ___BLANK___
    return niveau == "activites"`,
      blankPlaceholder: "___BLANK___",
      testCases: [
        { input: "traces", expected: true },
      ],
      referencePage: "p. 100",
    },
    hints: [
      "Ouvrez le référentiel à la page 100 dans la section Volet 2 : Numérique.",
      "Recherchez la définition du terme 'Identité numérique'.",
      "Le niveau associé aux traces, historiques de navigation et cookies est 'activites' (ou \"activites\").",
    ],
    maxAttempts: 5,
    timeLimitSeconds: 360,
    points: 150,
    agentContext:
      "La réponse attendue est 'activites' ou '\"activites\"' conformément à la page 100 du référentiel FMTTN.",
  },

  fmttn_seuil_primaire: {
    id: "fmttn_seuil_primaire",
    type: "cipher",
    category: "fmttn_didactique",
    title: "Le Point de Bascule Curriculaire",
    difficulty: "easy",
    stage: 3,
    description:
      "La commission d'inspection exige de connaître l'année de scolarité exacte du tronc commun où démarrent les attendus spécifiques obligatoires du volet 'Numérique'. Indiquez le code de cette classe (ex: P1, P2, P3, P4, P5, P6, S1, S2, S3) d'après les pages 20 et 24.",
    setup: {
      ciphertext: "S3",
      shiftHint: "Consultez le tableau synoptique p. 20 ou la mention p. 24.",
      referencePage: "p. 20 & 24",
    },
    hints: [
      "Regardez le tableau de répartition par champ et par année à la page 20.",
      "Le volet Numérique ne comporte aucune croix en P1 et P2 pour Informations, Communication ou Sécurité.",
      "La réponse est : P3 (3e primaire).",
    ],
    maxAttempts: 4,
    timeLimitSeconds: 240,
    points: 100,
    agentContext:
      "La réponse est P3. Le volet numérique fixe ses attendus spécifiques à partir de la 3e année primaire (p. 24).",
  },

  fmttn_logigramme_sequence: {
    id: "fmttn_logigramme_sequence",
    type: "code_fill",
    category: "fmttn_numerique",
    title: "Le Logigramme Algorithmique Débranché",
    difficulty: "medium",
    stage: 4,
    description:
      "En 4e primaire (P4 p.44), les élèves découvrent la pensée algorithmique. Selon le glossaire p. 101, le logigramme est 'la modélisation d'un ensemble d'opérations formalisant un algorithme'. Complétez la condition d'arrêt pour éviter la boucle infinie dans ce logigramme de tri de matériaux d'atelier.",
    setup: {
      language: "python",
      starterCode: `def recycler_materiaux(bac_dechets):
    while ___BLANK___:
        materiau = bac_dechets.pop()
        trier(materiau)
    return "Atelier securise"`,
      blankPlaceholder: "___BLANK___",
      testCases: [
        { input: ["bois", "metal"], expected: "Atelier securise" },
      ],
      referencePage: "p. 25 & 101",
    },
    hints: [
      "La boucle doit continuer tant que le bac contient encore des éléments.",
      "En Python : len(bac_dechets) > 0 ou simplement bac_dechets.",
      "La condition classique est : len(bac_dechets) > 0",
    ],
    maxAttempts: 5,
    timeLimitSeconds: 360,
    points: 150,
    agentContext:
      "La réponse est len(bac_dechets) > 0 ou bool(bac_dechets) ou bac_dechets.",
  },

  fmttn_compost_equilibre: {
    id: "fmttn_compost_equilibre",
    type: "cipher",
    category: "fmttn_technique",
    title: "Le Secret Écologique du Compost",
    difficulty: "medium",
    stage: 5,
    description:
      "Dernière épreuve avant la certification du tronc commun ! Dans le champ 'Techniques de culture' (glossaire p. 99), un compost équilibré respecte une juste proportion entre les déchets verts et les déchets... ? Trouvez le mot exact (au pluriel ou singulier).",
    setup: {
      ciphertext: "EURQV",
      shiftHint: "Chiffre de César (décalage de 3). Consultez la définition p. 99.",
      referencePage: "p. 99",
    },
    hints: [
      "Page 99 du référentiel : 'Compost équilibré : compost respectant une juste proportion entre les déchets verts (...) et les déchets...' ",
      "Ces déchets sont les feuilles mortes, la paille, le carton et les branchages.",
      "La réponse est : BRUNS (ou BRUN).",
    ],
    maxAttempts: 5,
    timeLimitSeconds: 300,
    points: 200,
    agentContext:
      "La réponse est BRUNS ou BRUN. Glossaire p.99 : déchets verts et déchets bruns.",
  },

  // Legacy puzzle definitions for backward compatibility
  caesar_cipher_01: {
    id: "caesar_cipher_01",
    type: "cipher",
    category: "cipher",
    title: "The Encrypted Handshake",
    difficulty: "easy",
    stage: 1,
    description: "Caesar cipher with shift 3. Decode KHOOR ZRUOG.",
    setup: { ciphertext: "KHOOR ZRUOG", shiftHint: "Shift is 3" },
    hints: ["Shift 3 letters back"],
    maxAttempts: 5,
    timeLimitSeconds: 300,
    points: 100,
    agentContext: "Shift 3 backwards gives HELLO WORLD",
  },
  bubble_sort_01: {
    id: "bubble_sort_01",
    type: "code_fill",
    category: "sorting",
    title: "Corrupted Sort Loop",
    difficulty: "easy",
    stage: 2,
    description: "Fill the comparison in bubble sort.",
    setup: { starterCode: "if ___BLANK___:", blankPlaceholder: "___BLANK___" },
    hints: ["arr[j] > arr[j + 1]"],
    maxAttempts: 5,
    timeLimitSeconds: 360,
    points: 100,
    agentContext: "arr[j] > arr[j + 1]",
  },
};

export const PUZZLE_SETS: Record<string, { stages: { stageNumber: number; title: string; puzzleIds: string[] }[] }> = {
  default_set: {
    stages: [
      {
        stageNumber: 1,
        title: "Étape 1 : Le Verrou de l'Atelier Technique",
        puzzleIds: ["fmttn_axiome_fondateur"],
      },
      {
        stageNumber: 2,
        title: "Étape 2 : Les 5 Niveaux de l'Identité Numérique",
        puzzleIds: ["fmttn_code_identite"],
      },
      {
        stageNumber: 3,
        title: "Étape 3 : Le Point de Bascule Curriculaire",
        puzzleIds: ["fmttn_seuil_primaire"],
      },
      {
        stageNumber: 4,
        title: "Étape 4 : Le Logigramme Algorithmique Débranché",
        puzzleIds: ["fmttn_logigramme_sequence"],
      },
      {
        stageNumber: 5,
        title: "Étape 5 : Le Secret Écologique du Compost",
        puzzleIds: ["fmttn_compost_equilibre"],
      },
    ],
  },
};

export function getPuzzleOrder(setId = "default_set"): string[] {
  const set = PUZZLE_SETS[setId] ?? PUZZLE_SETS["default_set"];
  if (!set) return ["fmttn_axiome_fondateur", "fmttn_code_identite", "fmttn_seuil_primaire", "fmttn_logigramme_sequence", "fmttn_compost_equilibre"];
  return set.stages.flatMap((stage) => stage.puzzleIds);
}
