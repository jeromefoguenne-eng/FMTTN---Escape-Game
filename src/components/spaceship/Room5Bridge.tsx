"use client";

import { useState } from "react";
import { GraduationCap, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, ArrowLeft, Power, Zap, Sliders, FileSpreadsheet, Search, Mail, Code, ShieldCheck } from "lucide-react";

type Props = {
  onUnlock: () => void;
  onError: () => void;
  openPdf: (page?: number) => void;
};

type ViseeSector = {
  id: number;
  name: string;
  shortName: string;
  champFMTTN: string;
  icon: typeof Search;
  gaugeColor: string;
  contextFWB: string;
  problemScenario: string;
  switches: {
    id: number;
    label: string;
    sub: string;
    isOptimal: boolean;
    feedbackEffect: string;
  }[];
};

const SECTORS: ViseeSector[] = [
  {
    id: 1,
    name: "Dilemme 1 : Recherche d'Information & Discernement Critique",
    shortName: "Recherche Web",
    champFMTTN: "Champ 1 : Informations et Données (p. 37, 43, 73)",
    icon: Search,
    gaugeColor: "from-blue-600 to-cyan-400",
    contextFWB: "P5 / P6 — Initiation à la recherche documentaire sur le Web (Namur)",
    problemScenario: "En recherchant des données pour un projet de classe sur l'environnement, les élèves cliquent systématiquement sur le premier lien commercial sponsorisé et recopient fidèlement son texte promotionnel sans vérifier l'auteur. Quelle régulation didactique activer ?",
    switches: [
      {
        id: 1,
        label: "Levier 1 : Verrouillage restrictif : interdire le Web et fournir un dossier PDF pré-sélectionné",
        sub: "Distribuer une sélection fermée d'articles validés par le professeur sans confronter les élèves au Web ouvert",
        isOptimal: false,
        feedbackEffect: "Approche trop fermée : priver les élèves du Web ouvert empêche l'acquisition de l'autonomie et des critères d'évaluation des sources prescrits par le référentiel (p. 43, 73).",
      },
      {
        id: 2,
        label: "Levier 2 : Démarche d'analyse critique : repérage des annonces, examen de l'URL & croisement de sources",
        sub: "Faire repérer la mention 'Annonce/Sponsorisé', vérifier le domaine (.be, .org, .gouv) et confronter à deux sources indépendantes",
        isOptimal: true,
        feedbackEffect: "✓ Jauge chargée ! Pleine conformité avec l'attendu officiel : identifier l'intention de chaque élément d'une page Web et questionner la fiabilité de l'information (p. 43, 73).",
      },
      {
        id: 3,
        label: "Levier 3 : Laisser-faire naïf : supposer que les 'digital natives' développeront l'esprit critique d'eux-mêmes",
        sub: "Valider les documents tant que le thème général est abordé, sans analyser la véracité ni le statut de l'auteur",
        isOptimal: false,
        feedbackEffect: "Illusion pédagogique : l'aisance technique superficielle des élèves ne remplace pas l'apprentissage explicite de la littératie informationnelle (p. 24).",
      },
    ],
  },
  {
    id: 2,
    name: "Dilemme 2 : Messagerie, Nétiquette & Protection de la Vie Privée",
    shortName: "Courriel & RGPD",
    champFMTTN: "Champ 2 & 4 : Communication, Collaboration & Sécurité (p. 49, 57, 64)",
    icon: Mail,
    gaugeColor: "from-indigo-600 to-blue-400",
    contextFWB: "P6 / S1 — Communication par messagerie et travail collaboratif (Bruxelles)",
    problemScenario: "Pour diffuser la synthèse d'un travail de groupe, un élève rédige un e-mail et insère les 25 adresses électroniques personnelles de ses camarades dans le champ 'À' (destinataire direct). Quelle régulation didactique activer ?",
    switches: [
      {
        id: 1,
        label: "Levier 1 : Enseignement explicite du champ 'Cci / Bcc' (copie cachée) et sensibilisation au RGPD",
        sub: "Distinguer 'À' (action attendue), 'Cc' (information visible) et 'Cci' (protection de l'adresse et de l'identité numérique des pairs)",
        isOptimal: true,
        feedbackEffect: "✓ Jauge chargée ! L'élève comprend l'importance de préserver la vie privée et les données personnelles d'autrui conformément au RGPD et à la nétiquette (p. 49, 57, 64).",
      },
      {
        id: 2,
        label: "Levier 2 : Suspension de l'accès à la messagerie scolaire et retour exclusif au papier",
        sub: "Retirer l'outil de communication pour éviter tout risque de fuite de données sans enseigner la bonne pratique",
        isOptimal: false,
        feedbackEffect: "Approche punitive stérile : le référentiel demande d'apprendre à utiliser les outils de communication en contexte sécurisé, non de les supprimer (p. 49).",
      },
      {
        id: 3,
        label: "Levier 3 : Demander de transférer les 25 adresses dans le champ 'Cc' (copie conforme)",
        sub: "Considérer que le champ 'Cc' résout le problème de confidentialité en séparant destinataire et observateurs",
        isOptimal: false,
        feedbackEffect: "Erreur technique et légale : le champ 'Cc' laisse toutes les adresses visibles de tous les destinataires, ce qui viole la confidentialité des données personnelles (p. 57, 64).",
      },
    ],
  },
  {
    id: 3,
    name: "Dilemme 3 : Pensée Algorithmique & Factorisation par Boucles",
    shortName: "Scratch & Boucles",
    champFMTTN: "Champ 3 : Création de Contenus — Pensée informatique (p. 50, 56)",
    icon: Code,
    gaugeColor: "from-purple-600 to-pink-400",
    contextFWB: "P5 / P6 — Algorithmes et programmation par blocs Scratch (Liège)",
    problemScenario: "Pour faire dessiner un octogone régulier à son lutin Scratch, un élève empile 16 blocs consécutifs : 8 fois le bloc [avancer de 50] alterné avec 8 fois le bloc [tourner à droite de 45°]. Quel levier didactique enclencher ?",
    switches: [
      {
        id: 1,
        label: "Levier 1 : Valider le script tel quel car le tracé visuel sur la scène est correct",
        sub: "Considérer que la méthode d'écriture importe peu tant que le lutin produit la forme géométrique demandée",
        isOptimal: false,
        feedbackEffect: "Obstacle didactique : passer à côté de l'essence de la pensée computationnelle qui vise l'élégance algorithmique et la factorisation (p. 50, 56).",
      },
      {
        id: 2,
        label: "Levier 2 : Reprendre la souris et remplacer soi-même les blocs par une boucle sans expliciter",
        sub: "Corriger directement le programme à l'écran pour gagner du temps lors de la séance",
        isOptimal: false,
        feedbackEffect: "Dépouillement de l'élève : l'enseignant résout le problème à la place de l'élève sans lui permettre de construire la notion de répétition (p. 26).",
      },
      {
        id: 3,
        label: "Levier 3 : Faire verbaliser le motif récurrent et faire découvrir le bloc itératif [Répéter 8 fois]",
        sub: "Guider l'élève pour repérer la séquence élémentaire répétée et factoriser le code selon l'attendu du référentiel",
        isOptimal: true,
        feedbackEffect: "✓ Jauge chargée ! Parfaite réponse à l'attendu officiel : 'Identifier une suite d'opérations qui peut être remplacée par une boucle' (p. 56).",
      },
    ],
  },
  {
    id: 4,
    name: "Dilemme 4 : Propriété Intellectuelle, Licences Libres & Médias",
    shortName: "Droits d'Auteur",
    champFMTTN: "Champ 3 & 4 : Création multimédia et Éthique légale (p. 44, 63, 66)",
    icon: ShieldCheck,
    gaugeColor: "from-emerald-600 to-teal-400",
    contextFWB: "S1 / S2 — Conception de présentations multimédias et éthique numérique (Mons)",
    problemScenario: "Pour illustrer son diaporama d'exposé, un groupe télécharge des photographies artistiques filigranées sur un moteur de recherche et les publie sans mentionner les auteurs ni vérifier les autorisations. Quelle régulation didactique opérer ?",
    switches: [
      {
        id: 1,
        label: "Levier 1 : Atelier sur les licences Creative Commons, le filtrage par droits d'usage & la citation légale",
        sub: "Apprendre à paramétrer le filtre d'images réutilisables, citer l'auteur, le titre et la licence (ex: CC BY-NC) dans le respect de la loi",
        isOptimal: true,
        feedbackEffect: "✓ Jauge chargée ! L'élève respecte le droit d'auteur, la propriété intellectuelle et apprend à exploiter légalement des ressources partagées (p. 44, 63, 66).",
      },
      {
        id: 2,
        label: "Levier 2 : Autoriser la copie intégrale sous prétexte que l'usage est strictement scolaire",
        sub: "Affirmer aux élèves que toute image visible sur Internet est utilisable librement tant qu'on ne la vend pas",
        isOptimal: false,
        feedbackEffect: "Erreur didactique majeure : l'exception pédagogique ne dispense pas de vérifier les droits et d'apprendre la citation éthique des auteurs (p. 63, 66).",
      },
      {
        id: 3,
        label: "Levier 3 : Proscrire tout média externe et obliger à dessiner chaque élément à la main",
        sub: "Refuser l'accès aux banques d'images pour contourner le problème des droits",
        isOptimal: false,
        feedbackEffect: "Contournement stérile : l'élève ne développe aucune compétence de recherche documentaire responsable ni de gestion de droits numériques (p. 24).",
      },
    ],
  },
  {
    id: 5,
    name: "Dilemme 5 : Tableur & Modélisation Dynamique par Formules",
    shortName: "Tableur Dynamique",
    champFMTTN: "Champ 3 : Création de Contenus — Traitement de données (p. 50, 73, 74)",
    icon: FileSpreadsheet,
    gaugeColor: "from-amber-600 to-yellow-400",
    contextFWB: "S1 / S2 — Traitement de données et automatisation sous tableur (Charleroi)",
    problemScenario: "Dans un tableur, des élèves doivent calculer les totaux et les moyennes de dépenses d'un club scolaire. Ils calculent les valeurs sur leur calculatrice et tapent directement le chiffre '145' en dur dans la cellule de total. Quel levier didactique enclencher ?",
    switches: [
      {
        id: 1,
        label: "Levier 1 : Valider la cellule dès lors que le montant numérique calculé est arithmétiquement exact",
        sub: "Traiter le tableur comme une simple grille de traitement de texte sans mobiliser ses capacités de calcul",
        isOptimal: false,
        feedbackEffect: "Régression didactique : le tableur est réduit à un tableau passif sans faire découvrir la puissance du calcul dynamique (p. 73-74).",
      },
      {
        id: 2,
        label: "Levier 2 : Faire saisir la formule '=50+45+50' avec les chiffres en dur dans la barre de formule",
        sub: "Expliquer le symbole '=' mais en additionnant des constantes plutôt que des références de cellules",
        isOptimal: false,
        feedbackEffect: "Piège technique : si une valeur de départ change, le total reste faux car il n'est pas lié aux coordonnées des cellules (p. 74).",
      },
      {
        id: 3,
        label: "Levier 3 : Faire manipuler les références de cellules (A2:A10) et la fonction '=SOMME()' puis modifier une valeur test",
        sub: "Démontrer l'intérêt du recalcul automatique instantané et formaliser les notions de cellule, plage et fonction native",
        isOptimal: true,
        feedbackEffect: "✓ Jauge chargée ! Réussite exemplaire des attendus du tableur : utiliser adéquatement formules, fonctions et adressage de cellules (p. 73-74).",
      },
    ],
  },
];

export function Room5Bridge({ onUnlock, onError, openPdf }: Props) {
  // Gauges values (0 to 100)
  const [gauges, setGauges] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  const [activeSectorId, setActiveSectorId] = useState<number>(1);
  const [activeSwitchSelections, setActiveSwitchSelections] = useState<Record<number, number>>({});
  const [feedbackMessages, setFeedbackMessages] = useState<Record<number, string>>({});
  const [errorMsg, setErrorMsg] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const activeSector = SECTORS.find((s) => s.id === activeSectorId) || SECTORS[0];
  const Icon = activeSector.icon;

  const totalGaugesSum = Object.values(gauges).reduce((a, b) => a + b, 0);
  const all5GaugesCharged = totalGaugesSum === 500;

  function toggleSwitch(sectorId: number, switchId: number) {
    const sector = SECTORS.find((s) => s.id === sectorId);
    const sw = sector?.switches.find((w) => w.id === switchId);
    if (!sw) return;

    setActiveSwitchSelections((prev) => ({
      ...prev,
      [sectorId]: switchId,
    }));

    if (sw.isOptimal) {
      setGauges((prev) => ({ ...prev, [sectorId]: 100 }));
      setFeedbackMessages((prev) => ({
        ...prev,
        [sectorId]: sw.feedbackEffect,
      }));
      setErrorMsg("");
    } else {
      setGauges((prev) => ({ ...prev, [sectorId]: 0 }));
      setFeedbackMessages((prev) => ({
        ...prev,
        [sectorId]: sw.feedbackEffect,
      }));
      onError();
    }
  }

  function handleIgniteHyperdrive() {
    if (!all5GaugesCharged) {
      setErrorMsg("Toutes les jauges didactiques doivent être chargées à 100% avec les leviers optimaux !");
      onError();
      return;
    }
    setUnlocked(true);
    onUnlock();
  }

  return (
    <div className="space-y-6 text-slate-100 max-w-5xl mx-auto pb-12">
      {/* HEADER SECTION */}
      <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400">
              <Sliders className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Secteur 05 · Niveau 5
                </span>
                <span className="text-xs text-slate-400 font-mono">Volet 2 : Numérique FMTTN</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                Le Laboratoire Didactique de l'Enseignant de Numérique
              </h2>
              <p className="text-sm text-slate-300">
                Analysez 5 situations authentiques de classe de numérique et choisissez la régulation didactique conforme au Tronc Commun.
              </p>
            </div>
          </div>

          <button
            onClick={() => openPdf(24)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-medium transition self-start md:self-auto shadow-sm"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Consulter le Volet Numérique (p. 24-26)</span>
          </button>
        </div>

        {/* 5 GAUGES SUMMARY BAR */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800">
          {SECTORS.map((s) => {
            const isFilled = gauges[s.id] === 100;
            const isCurrent = activeSectorId === s.id;
            const SectorIcon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSectorId(s.id)}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? "bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-500/30"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`p-1 rounded-md ${isFilled ? "text-emerald-400 bg-emerald-950/50" : "text-slate-400 bg-slate-800"}`}>
                    <SectorIcon className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-mono font-bold ${isFilled ? "text-emerald-400" : "text-slate-500"}`}>
                    {gauges[s.id]}%
                  </span>
                </div>
                <div className="text-xs font-bold truncate text-slate-200">{s.shortName}</div>
                {/* Visual mini-bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isFilled ? "bg-gradient-to-r from-emerald-500 to-cyan-400 w-full" : "w-0"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SECTOR DETAIL CARD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {activeSector.champFMTTN}
                </span>
                <span className="text-xs text-slate-500 font-mono">• {activeSector.contextFWB}</span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">{activeSector.name}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSectorId((prev) => (prev > 1 ? prev - 1 : 5))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
              title="Dilemme précédent"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-400 px-2">
              {activeSectorId} / 5
            </span>
            <button
              onClick={() => setActiveSectorId((prev) => (prev < 5 ? prev + 1 : 1))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
              title="Dilemme suivant"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SITUATION DIDACTIQUE AUTHENTIQUE */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/30 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Situation Didactique Concrète de Classe (FWB)</span>
          </div>
          <p className="text-sm text-slate-200 font-medium leading-relaxed italic">
            « {activeSector.problemScenario} »
          </p>
        </div>

        {/* 3 LEVIERS PLAUSIBLES */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Actionnez le levier didactique conforme aux attendus du Tronc Commun :
          </div>

          {activeSector.switches.map((sw) => {
            const isSelected = activeSwitchSelections[activeSectorId] === sw.id;
            const isGaugeFull = gauges[activeSectorId] === 100;
            const isThisOptimal = sw.isOptimal;

            return (
              <button
                key={sw.id}
                onClick={() => toggleSwitch(activeSectorId, sw.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden ${
                  isSelected
                    ? isThisOptimal
                      ? "bg-emerald-950/40 border-emerald-500/80 ring-2 ring-emerald-500/40"
                      : "bg-red-950/40 border-red-500/80 ring-2 ring-red-500/40"
                    : "bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`mt-0.5 p-2 rounded-lg border transition ${
                      isSelected
                        ? isThisOptimal
                          ? "bg-emerald-500 text-slate-950 border-emerald-400"
                          : "bg-red-500 text-white border-red-400"
                        : "bg-slate-900 text-slate-400 border-slate-800"
                    }`}
                  >
                    <Power className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${isSelected ? (isThisOptimal ? "text-emerald-300" : "text-red-300") : "text-slate-200"}`}>
                        {sw.label}
                      </span>
                      {isSelected && (
                        <span className="text-xs font-bold uppercase font-mono px-2 py-0.5 rounded">
                          {isThisOptimal ? "✓ Activé (100%)" : "✕ Inadéquat"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{sw.sub}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* FEEDBACK DISPLAY */}
        {feedbackMessages[activeSectorId] && (
          <div
            className={`mt-5 p-4 rounded-xl border text-xs font-medium leading-relaxed animate-fadeIn ${
              gauges[activeSectorId] === 100
                ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                : "bg-red-950/40 border-red-500/50 text-red-200"
            }`}
          >
            {feedbackMessages[activeSectorId]}
          </div>
        )}
      </div>

      {/* ERROR MESSAGE IF ANY */}
      {errorMsg && (
        <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FINAL UNLOCK BUTTON */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-sm">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Progression Didactique du Volet Numérique :
          </div>
          <div className="text-sm font-semibold text-slate-200 mt-0.5">
            Jauges chargées : <span className="font-mono text-cyan-400 font-bold">{totalGaugesSum / 100} / 5</span>
          </div>
        </div>

        <button
          onClick={handleIgniteHyperdrive}
          disabled={!all5GaugesCharged}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg ${
            all5GaugesCharged
              ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 ring-2 ring-cyan-400/50 cursor-pointer animate-pulse"
              : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{all5GaugesCharged ? "Allumer le Cap Didactique & Valider la Salle" : "Chargez les 5 jauges à 100%"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* SUCCESS BANNER */}
      {unlocked && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-sm flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold">Postures Didactiques Maîtrisées !</span> Vous avez régulé avec succès les 5 situations de classe du Volet Numérique. Le pont de commandement est opérationnel pour le Sas Final.
          </div>
        </div>
      )}
    </div>
  );
}
