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
    name: "Situation 1 : Recherche sur Internet & Publicités",
    shortName: "Recherche Web",
    champFMTTN: "Informations et Données (p. 37, 43, 73)",
    icon: Search,
    gaugeColor: "from-blue-600 to-cyan-400",
    contextFWB: "Classe de P5 / P6 (Namur)",
    problemScenario: "Lors d'une recherche sur Internet, les élèves cliquent tous sur le premier lien commercial sponsorisé et recopient le texte de la publicité sans vérifier qui a écrit la page. Quelle consigne donnez-vous ?",
    switches: [
      {
        id: 1,
        label: "Choix 1 : Interdire les moteurs de recherche et donner des textes imprimés",
        sub: "Donner des documents tout préparés sur papier sans laisser les élèves utiliser Internet.",
        isOptimal: false,
        feedbackEffect: "Trop restrictif : les élèves n'apprennent pas à évaluer les informations sur le Web (p. 43, 73).",
      },
      {
        id: 2,
        label: "Choix 2 : Apprendre à repérer la mention 'Annonce', vérifier l'adresse et comparer 2 sites",
        sub: "Faire repérer la balise publicitaire, regarder si le site est fiable (.be, .org) et comparer avec une deuxième source.",
        isOptimal: true,
        feedbackEffect: "✓ Choix validé ! L'élève apprend à distinguer publicité et information, et vérifie la fiabilité des sources (p. 43, 73).",
      },
      {
        id: 3,
        label: "Choix 3 : Laisser les élèves chercher sans consigne particulière",
        sub: "Penser que les élèves comprendront d'eux-mêmes avec le temps.",
        isOptimal: false,
        feedbackEffect: "Insuffisant : sans apprentissage explicite, les élèves continuent à confondre publicité et résultat fiable (p. 24).",
      },
    ],
  },
  {
    id: 2,
    name: "Situation 2 : E-mails, Politesse en ligne & Données personnelles",
    shortName: "E-mails & RGPD",
    champFMTTN: "Communication & Sécurité (p. 49, 57, 64)",
    icon: Mail,
    gaugeColor: "from-indigo-600 to-blue-400",
    contextFWB: "Classe de P6 / S1 (Bruxelles)",
    problemScenario: "Pour envoyer un devoir de groupe par e-mail, un élève écrit un message et met les adresses e-mails personnelles de ses 25 camarades de classe dans la case 'À'. Quelle consigne donnez-vous ?",
    switches: [
      {
        id: 1,
        label: "Choix 1 : Expliquer l'utilité de la case 'Cci' (copie cachée) pour protéger les adresses (RGPD)",
        sub: "Montrer que la case 'Cci' permet d'envoyer à plusieurs personnes sans dévoiler publiquement leurs adresses privées.",
        isOptimal: true,
        feedbackEffect: "✓ Choix validé ! L'élève comprend comment protéger la vie privée et les données personnelles de ses camarades (p. 49, 57, 64).",
      },
      {
        id: 2,
        label: "Choix 2 : Supprimer la messagerie électronique pour toute la classe",
        sub: "Interdire les e-mails et demander de tout rendre sur clé USB ou papier.",
        isOptimal: false,
        feedbackEffect: "Inadapté : le référentiel demande d'apprendre à utiliser les outils de communication en toute sécurité, pas de les bannir (p. 49).",
      },
      {
        id: 3,
        label: "Choix 3 : Mettre toutes les adresses dans la case 'Cc' (copie visible)",
        sub: "Penser que la case 'Cc' protège la vie privée.",
        isOptimal: false,
        feedbackEffect: "Erreur : la case 'Cc' laisse les 25 adresses visibles de tout le monde (p. 57, 64).",
      },
    ],
  },
  {
    id: 3,
    name: "Situation 3 : Programmation par Blocs sous Scratch",
    shortName: "Scratch & Boucles",
    champFMTTN: "Création de Contenus & Programmation (p. 50, 56)",
    icon: Code,
    gaugeColor: "from-purple-600 to-pink-400",
    contextFWB: "Classe de P5 / P6 (Liège)",
    problemScenario: "Pour faire tracer un polygone à 8 côtés à son lutin Scratch, un élève empile 16 blocs à la suite : 8 fois [avancer] et 8 fois [tourner]. Que faites-vous ?",
    switches: [
      {
        id: 1,
        label: "Choix 1 : Valider le programme tant que le dessin est réussi",
        sub: "Considérer que la façon d'écrire le code n'a pas d'importance du moment que l'image apparaît.",
        isOptimal: false,
        feedbackEffect: "Incomplet : l'élève passe à côté de la notion essentielle de répétition et de boucle en programmation (p. 56).",
      },
      {
        id: 2,
        label: "Choix 2 : Prendre la souris et remplacer le code soi-même sans rien expliquer",
        sub: "Faire la correction à sa place pour aller plus vite pendant le cours.",
        isOptimal: false,
        feedbackEffect: "Inadéquat : l'élève doit comprendre et construire la solution par lui-même.",
      },
      {
        id: 3,
        label: "Choix 3 : Faire remarquer la répétition et faire utiliser le bloc [Répéter 8 fois]",
        sub: "Aider l'élève à voir les blocs qui se répètent et lui faire découvrir la boucle pour simplifier son programme.",
        isOptimal: true,
        feedbackEffect: "✓ Choix validé ! Répond exactement à l'attendu du référentiel : 'Identifier une suite d'opérations remplaçable par une boucle' (p. 56).",
      },
    ],
  },
  {
    id: 4,
    name: "Situation 4 : Images sur Internet & Droits d'auteur",
    shortName: "Droits d'Auteur",
    champFMTTN: "Création de Contenus & Éthique (p. 44, 63, 66)",
    icon: ShieldCheck,
    gaugeColor: "from-emerald-600 to-teal-400",
    contextFWB: "Classe de S1 / S2 (Mons)",
    problemScenario: "Pour illustrer un diaporama d'exposé, des élèves copient des photographies trouvées sur Google Images sans mentionner les auteurs ni vérifier si elles sont libres de droits. Quelle consigne donnez-vous ?",
    switches: [
      {
        id: 1,
        label: "Choix 1 : Apprendre à filtrer les images sous licence libre (Creative Commons) et citer l'auteur",
        sub: "Montrer comment activer le filtre d'images réutilisables et expliquer comment noter le nom de l'auteur et la licence.",
        isOptimal: true,
        feedbackEffect: "✓ Choix validé ! L'élève respecte le droit d'auteur et apprend à utiliser légalement des ressources partagées (p. 44, 63, 66).",
      },
      {
        id: 2,
        label: "Choix 2 : Autoriser à copier n'importe quelle image sous prétexte que c'est pour l'école",
        sub: "Dire aux élèves que tout est gratuit sur Internet tant qu'on ne vend rien.",
        isOptimal: false,
        feedbackEffect: "Erreur : même à l'école, on doit apprendre à vérifier les droits et à citer les sources (p. 63, 66).",
      },
      {
        id: 3,
        label: "Choix 3 : Interdire toute image et obliger les élèves à tout dessiner à la main",
        sub: "Refuser d'utiliser des images numériques pour ne pas avoir à gérer les droits d'auteur.",
        isOptimal: false,
        feedbackEffect: "Contournement : cela n'apprend pas aux élèves à rechercher et utiliser des médias numériques de manière responsable (p. 24).",
      },
    ],
  },
  {
    id: 5,
    name: "Situation 5 : Tableur & Calcul Automatique",
    shortName: "Tableur",
    champFMTTN: "Création de Contenus & Données (p. 50, 73, 74)",
    icon: FileSpreadsheet,
    gaugeColor: "from-amber-600 to-yellow-400",
    contextFWB: "Classe de S1 / S2 (Charleroi)",
    problemScenario: "Dans un tableur, des élèves doivent calculer le total d'une colonne de dépenses. Ils font le calcul sur une calculatrice et tapent directement le résultat '145' au clavier dans la case du total. Que faites-vous ?",
    switches: [
      {
        id: 1,
        label: "Choix 1 : Valider le nombre tapé tant que le résultat est juste",
        sub: "Considérer le tableur comme un simple tableau de texte sans utiliser ses fonctions de calcul.",
        isOptimal: false,
        feedbackEffect: "Dommage : l'élève n'apprend pas à utiliser la puissance du calcul automatique dans un tableur (p. 73-74).",
      },
      {
        id: 2,
        label: "Choix 2 : Faire taper la formule '=50+45+50' avec les chiffres en dur dans la barre",
        sub: "Expliquer le symbole '=' mais en additionnant des chiffres fixes au lieu des cases.",
        isOptimal: false,
        feedbackEffect: "Piège : si l'élève modifie un nombre dans le tableau, le total ne se mettra pas à jour tout seul (p. 74).",
      },
      {
        id: 3,
        label: "Choix 3 : Faire utiliser les cases (A2:A10) et la formule '=SOMME()' pour que tout se calcule automatiquement",
        sub: "Montrer qu'en changeant un prix dans le tableau, le total se recalcule immédiatement sans calculatrice.",
        isOptimal: true,
        feedbackEffect: "✓ Choix validé ! L'élève comprend l'intérêt des formules et des références de cellules (p. 73-74).",
      },
    ],
  },
];

export function Room5Bridge({ onUnlock, onError, openPdf }: Props) {
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
      setErrorMsg("Toutes les jauges doivent être chargées à 100% avec les bonnes options pédagogiques !");
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
                Situations de Classe en Cours de Numérique
              </h2>
              <p className="text-sm text-slate-300">
                Observez 5 situations concrètes d'élèves et choisissez la meilleure façon de les aider à progresser.
              </p>
            </div>
          </div>

          <button
            onClick={() => openPdf(24)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-medium transition self-start md:self-auto shadow-sm"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Consulter le Référentiel (p. 24-26)</span>
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
              title="Précédent"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-400 px-2">
              {activeSectorId} / 5
            </span>
            <button
              onClick={() => setActiveSectorId((prev) => (prev < 5 ? prev + 1 : 1))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
              title="Suivant"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SITUATION DIDACTIQUE AUTHENTIQUE */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/30 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Situation observée en classe</span>
          </div>
          <p className="text-sm text-slate-200 font-medium leading-relaxed italic">
            « {activeSector.problemScenario} »
          </p>
        </div>

        {/* 3 CHOIX PEDAGOGIQUES SIMPLES */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Choisissez la meilleure façon d'aider les élèves :
          </div>

          {activeSector.switches.map((sw) => {
            const isSelected = activeSwitchSelections[activeSectorId] === sw.id;
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
                          {isThisOptimal ? "✓ Choix Validé" : "✕ À améliorer"}
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
            Progression :
          </div>
          <div className="text-sm font-semibold text-slate-200 mt-0.5">
            Situations résolues : <span className="font-mono text-cyan-400 font-bold">{totalGaugesSum / 100} / 5</span>
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
          <span>{all5GaugesCharged ? "Valider les 5 Situations et Ouvrir le Sas Final" : "Résolvez les 5 situations (100%)"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* SUCCESS BANNER */}
      {unlocked && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-sm flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold">Bravo !</span> Vous avez apporté les bonnes réponses aux 5 situations d'élèves. Le pont de commandement est prêt pour le test final.
          </div>
        </div>
      )}
    </div>
  );
}
