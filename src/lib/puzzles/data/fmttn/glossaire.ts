import type { MCQQuestion } from "@/types";

export const glossaireNiveauxQuestions: MCQQuestion[] = [
  {
    id: "fmttn_glo_01",
    path: "fmttn_niveaux_progressivite",
    question: "En 4e primaire (P4), dans le volet 'Numérique - Création de contenus' (p. 44), quel type d'algorithme l'élève est-il attendu de lire et créer ?",
    options: [
      "Un script d'intelligence artificielle en Python avec réseaux neuronaux",
      "Une suite finie d’instructions simples (déplacements, séquences d'actions) sur support débranché ou environnement visuel par blocs",
      "Le code source d'un système d'exploitation complet",
      "Une requête SQL sur une base de données relationnelle distribuée"
    ],
    answer: 1,
    explanation: "Référentiel FMTTN p. 44 : En P4, l'élève traite de la pensée informatique par des séquences ordonnées, algorithmes débranchés et blocs simples (de type Scratch/robot de sol).",
    difficulty: "medium",
  },
  {
    id: "fmttn_glo_02",
    path: "fmttn_niveaux_progressivite",
    question: "Comment le glossaire officiel (p. 100) définit-il un 'Objet technologique' ?",
    options: [
      "Tout appareil électronique muni d'une connexion Wi-Fi et d'un écran tactile",
      "Un objet intégrant un ensemble de techniques mises en œuvre pour produire une action déterminée",
      "Un objet fabriqué exclusivement en usine automatisée sans intervention humaine",
      "Un composant en plastique recyclé utilisé dans la classe"
    ],
    answer: 1,
    explanation: "Page 100 : 'Objet technologique : objet intégrant un ensemble de techniques mises en œuvre pour produire une action déterminée.'",
    difficulty: "medium",
  },
  {
    id: "fmttn_glo_03",
    path: "fmttn_niveaux_progressivite",
    question: "Dans le glossaire p. 100, comment est défini le terme 'Ouvrage' ?",
    options: [
      "Un livre scolaire de référence déposé à la bibliothèque",
      "Un objet résultant d’un travail",
      "Une grande construction de génie civil uniquement",
      "Une séance de cours magistral donnée par l'enseignant"
    ],
    answer: 1,
    explanation: "Page 100 : 'Ouvrage : objet résultant d’un travail.'",
    difficulty: "easy",
  },
  {
    id: "fmttn_glo_04",
    path: "fmttn_niveaux_progressivite",
    question: "En matière d'organisation et de sécurité dans les ateliers FMTT, que désigne le 'Poste de travail' (p. 100) ?",
    options: [
      "L'ordinateur principal de la direction de l'école",
      "La zone, lieu ou cadre dans lesquels une personne effectue son travail",
      "Le contrat d'embauche liant le professeur à son pouvoir organisateur",
      "L'armoire fermée à clé contenant les outils dangereux"
    ],
    answer: 1,
    explanation: "Page 100 : 'Poste de travail : zone, lieu ou cadre dans lesquels une personne effectue son travail.' (L'élève apprend à sécuriser et gérer son poste de travail dès le début du cursus, p. 21 & 23).",
    difficulty: "easy",
  },
  {
    id: "fmttn_glo_05",
    path: "fmttn_niveaux_progressivite",
    question: "Selon la page 21 du référentiel, quel est l'un des éléments clés du 'Profil de sortie' de l'élève à l'issue du tronc commun ?",
    options: [
      "Avoir obtenu une certification professionnelle d'ingénieur en chef",
      "Disposer d'un bagage technique et numérique nécessaire dans les situations de la vie quotidienne et citoyenne",
      "Être capable de réparer n'importe quel serveur internet industriel",
      "Avoir conçu une entreprise commerciale rentable"
    ],
    answer: 1,
    explanation: "Page 21 : 'À l’issue du tronc commun, l’élève disposera d’un bagage technique nécessaire à tout citoyen, à toute citoyenne, dans des situations de la vie quotidienne : aménager un espace de vie, sécuriser un poste de travail, diagnostiquer un dysfonctionnement, créer du contenu numérique...'",
    difficulty: "easy",
  }
];
