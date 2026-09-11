import type { MCQQuestion } from "@/types";

export const voletNumeriqueQuestions: MCQQuestion[] = [
  {
    id: "fmttn_num_01",
    path: "fmttn_securite",
    question: "Selon la définition officielle du glossaire FMTTN (p. 100), de combien de niveaux l'identité numérique est-elle constituée ?",
    options: [
      "3 niveaux (Nom, Prénom, Mot de passe)",
      "4 niveaux (IP, Carte d'identité, Email, Téléphone)",
      "5 niveaux : e-réputation, publication, activités, logs in et identité personnelle",
      "7 niveaux de classification de cybersécurité"
    ],
    answer: 2,
    explanation: "Page 100 : 'Identité numérique : identité constituée de cinq niveaux : l’e-réputation (informations publiées à mon propos), la publication (informations rendues publiques), les activités (traces, historiques de navigation, cookies…), les logs in (identifiants, mots de passe…) et l’identité personnelle.'",
    difficulty: "easy",
  },
  {
    id: "fmttn_num_02",
    path: "fmttn_creation_contenus",
    question: "Comment le glossaire (p. 101) définit-il un 'Logigramme' dans l'apprentissage de la pensée informatique ?",
    options: [
      "Un logo publicitaire d'une entreprise technologique",
      "La modélisation d’un ensemble d’opérations formalisant un algorithme",
      "Une formule de calcul mathématique complexe sur tableur",
      "Un câble reliant une imprimante à l'ordinateur"
    ],
    answer: 1,
    explanation: "Page 101 : 'Logigramme : modélisation d’un ensemble d’opérations formalisant un algorithme.' (Voir aussi p. 25 : 'En abordant des notions de logigramme* et de programmation... l’élève développe sa pensée informatique et algorithmique.')",
    difficulty: "easy",
  },
  {
    id: "fmttn_num_03",
    path: "fmttn_communication",
    question: "Quelle distinction le glossaire (p. 100-101) fait-il entre un échange numérique 'Synchrone' et 'Asynchrone' ?",
    options: [
      "Synchrone = par câble ; Asynchrone = en wifi",
      "Synchrone = de manière simultanée (en temps réel) ; Asynchrone = de manière différée",
      "Synchrone = public ; Asynchrone = confidentiel et sécurisé",
      "Synchrone = payant ; Asynchrone = gratuit et libre"
    ],
    answer: 1,
    explanation: "Glossaire p. 100 & 101 : 'Asynchrone : de manière différée.' / 'Synchrone : de manière simultanée.'",
    difficulty: "easy",
  },
  {
    id: "fmttn_num_04",
    path: "fmttn_creation_contenus",
    question: "Quelle est la définition exacte du verbe 'Programmer' selon le glossaire FMTTN (p. 101) ?",
    options: [
      "Régler l'heure sur un écran d'ordinateur",
      "Concevoir un logiciel informatique en traduisant un algorithme, à l’aide d’un langage de programmation, pour qu’il puisse être compris et exécuté par un ordinateur",
      "Télécharger des jeux vidéo depuis un magasin d'applications",
      "Nettoyer le disque dur de fichiers inutilisés"
    ],
    answer: 1,
    explanation: "Page 101 : 'Programmer : concevoir un logiciel informatique en traduisant un algorithme, à l’aide d’un langage de programmation, pour qu’il puisse être compris et exécuté par un ordinateur.'",
    difficulty: "medium",
  },
  {
    id: "fmttn_num_05",
    path: "fmttn_communication",
    question: "Qu'est-ce que la 'Nétiquette' selon le glossaire officiel (p. 101) ?",
    options: [
      "Une étiquette autocollante apposée au dos des écrans d'ordinateur",
      "Une charte de bienséance régissant les règles de conduite et de politesse lors d’échanges numériques",
      "Le prix d'un abonnement internet haut débit pour l'école",
      "Un certificat délivré par la police fédérale du cyberespace"
    ],
    answer: 1,
    explanation: "Page 101 : 'Nétiquette : charte de bienséance régissant les règles de conduite et de politesse, lors d’échanges numériques.'",
    difficulty: "easy",
  },
  {
    id: "fmttn_num_06",
    path: "fmttn_info_donnees",
    question: "Dans le champ 'Informations et données' (p. 24 & 43), quel apprentissage fondamental est visé au-delà de la simple recherche d'informations ?",
    options: [
      "Mémoriser l'ensemble des adresses IP des serveurs de recherche",
      "Élaborer des stratégies de recherche pertinentes et exercer un regard critique sur la fiabilité des sources",
      "Cliquer en priorité sur les liens publicitaires en tête de page",
      "Ne consulter qu'une seule et unique source pour gagner du temps"
    ],
    answer: 1,
    explanation: "Page 24 : 'L’élève s’approprie progressivement les outils de recherche. Il est amené à élaborer des stratégies de recherche pertinentes et est initié au regard critique à porter sur les résultats obtenus, notamment en termes de fiabilité des sources.'",
    difficulty: "easy",
  },
  {
    id: "fmttn_num_07",
    path: "fmttn_securite",
    question: "Quelle est la traduction française officielle recommandée dans le glossaire FMTTN (p. 101) pour le terme 'uploader' ?",
    options: [
      "Uploader",
      "Haut-charger",
      "Téléverser",
      "Distancier"
    ],
    answer: 2,
    explanation: "Page 101 : 'Téléverser : transférer un document d’un ordinateur local à un ordinateur distant (version française de « uploader »).'",
    difficulty: "medium",
  },
  {
    id: "fmttn_num_08",
    path: "fmttn_creation_contenus",
    question: "Que prévoient les licences 'Creative Commons' définies au glossaire (p. 101) pour les créations d'élèves et de ressources ?",
    options: [
      "L'interdiction absolue et définitive de copier ou consulter une ressource",
      "Des contrats types permettant aux titulaires de droits d’auteur d’accorder des permissions spécifiques à leurs œuvres",
      "L'obligation de payer une redevance annuelle à l'Union Européenne",
      "L'attribution automatique de tous les droits à l'éditeur du logiciel utilisé"
    ],
    answer: 1,
    explanation: "Page 101 : 'Licences « Creative Commons » : contrats types ou licences pour la mise à disposition d’œuvres en ligne, qui permettent aux titulaires de droits d’auteur d’accorder des permissions spécifiques à leurs œuvres.'",
    difficulty: "medium",
  }
];
