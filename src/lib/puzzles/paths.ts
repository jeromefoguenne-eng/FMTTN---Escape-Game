import type { PathId } from "@/types";

export type PathMeta = {
  id: PathId;
  label: string;
  description: string;
  icon: string;
  questionCount: number;
  category: "fmttn_didactique" | "fmttn_volet1" | "fmttn_volet2" | "fmttn_defi";
  difficulty: "Débutant" | "Intermédiaire" | "Avancé" | "Complet";
};

export const PATH_CATEGORIES = [
  {
    id: "fmttn_defi",
    label: "🏆 Grand Défi Tronc Commun",
    color: "#f59e0b",
  },
  {
    id: "fmttn_didactique",
    label: "🎓 Didactique, Visées & Structure FMTTN",
    color: "#05b9b6",
  },
  {
    id: "fmttn_volet1",
    label: "🛠️ Volet 1 : Formation Manuelle & Technologique",
    color: "#0066ff",
  },
  {
    id: "fmttn_volet2",
    label: "💻 Volet 2 : Éducation au Numérique (DigComp)",
    color: "#ff00cc",
  },
] as const;

export const PATHS: PathMeta[] = [
  // ── Grand Défi ───────────────────────────────────────────
  {
    id: "fmttn_grand_defi",
    label: "Le Grand Escape Game FMTTN (Tous Volets)",
    description: "Parcours complet de 10 questions transversales sur l'ensemble du référentiel (Volets 1, 2, didactique et glossaire).",
    icon: "🌟",
    questionCount: 10,
    category: "fmttn_defi",
    difficulty: "Complet",
  },

  // ── Didactique & Enjeux Généraux ────────────────────────
  {
    id: "fmttn_didactique_socles",
    label: "Didactique Générale & 5 Visées Annuelles",
    description: "Les finalités du tronc commun, la formation AU vs PAR le numérique, et les 5 concepts (Autonomie, Cognition, etc. p.18-26).",
    icon: "🎯",
    questionCount: 10,
    category: "fmttn_didactique",
    difficulty: "Intermédiaire",
  },
  {
    id: "fmttn_niveaux_progressivite",
    label: "Continuum Curriculaire & Glossaire",
    description: "Repérage des attendus de P1 à S3 et maîtrise des termes officiels (technique vs technologie, ouvrage, poste de travail p.99-101).",
    icon: "📖",
    questionCount: 5,
    category: "fmttn_didactique",
    difficulty: "Débutant",
  },

  // ── Volet 1 : Formation Manuelle & Technologique ─────────
  {
    id: "fmttn_matieres_materiaux",
    label: "Matières, Matériaux & Objets",
    description: "Travail du bois, métal, textile, gestes techniques, sécurité, consommables et machines simples (p.22-23).",
    icon: "🔨",
    questionCount: 5,
    category: "fmttn_volet1",
    difficulty: "Intermédiaire",
  },
  {
    id: "fmttn_objets_technologiques",
    label: "Objets Technologiques & Capteurs",
    description: "Des instruments de mesure en P4 aux systèmes automatisés avec capteurs en S3 (p.23).",
    icon: "⚙️",
    questionCount: 5,
    category: "fmttn_volet1",
    difficulty: "Avancé",
  },
  {
    id: "fmttn_techniques_culture",
    label: "Techniques de Culture & Écologie",
    description: "Horticulture de base, compost équilibré (verts/bruns), développement durable et biodiversité (p.22).",
    icon: "🌱",
    questionCount: 5,
    category: "fmttn_volet1",
    difficulty: "Débutant",
  },
  {
    id: "fmttn_alimentation_habitat",
    label: "Alimentation & Aménagement de l'Habitat",
    description: "Maquette de classe, vivre-ensemble, assiette équilibrée, sécurité et réduction énergétique (p.22).",
    icon: "🥗",
    questionCount: 5,
    category: "fmttn_volet1",
    difficulty: "Débutant",
  },

  // ── Volet 2 : Éducation au Numérique ────────────────────
  {
    id: "fmttn_securite",
    label: "Sécurité & Identité Numérique (5 Niveaux)",
    description: "Protection des données, e-réputation, cookies, cyberharcèlement et netiquette (p.25 & 100).",
    icon: "🛡️",
    questionCount: 5,
    category: "fmttn_volet2",
    difficulty: "Intermédiaire",
  },
  {
    id: "fmttn_creation_contenus",
    label: "Création de Contenus & Pensée Algorithmique",
    description: "Logigrammes, suites d'instructions débranchées, programmation visuelle, multimédia et Creative Commons (p.25 & 101).",
    icon: "🧩",
    questionCount: 5,
    category: "fmttn_volet2",
    difficulty: "Avancé",
  },
  {
    id: "fmttn_communication",
    label: "Communication & Espaces Virtuels",
    description: "Échanges synchrones vs asynchrones, netiquette, collaboration et téléversement (p.24).",
    icon: "💬",
    questionCount: 5,
    category: "fmttn_volet2",
    difficulty: "Débutant",
  },
  {
    id: "fmttn_info_donnees",
    label: "Informations, Données & Esprit Critique",
    description: "Recherche sur le Web, critères de fiabilité des sources et organisation des données (p.24).",
    icon: "🔍",
    questionCount: 5,
    category: "fmttn_volet2",
    difficulty: "Intermédiaire",
  },
];
