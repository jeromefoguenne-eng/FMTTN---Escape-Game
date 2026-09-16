"use client";

import { useState } from "react";
import {
  FileSearch,
  CheckCircle2,
  Lock,
  X,
  Compass,
  Cpu,
  Globe2,
  Bot,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  clearedZoneIds: number[];
  openPdf: (page?: number) => void;
};

type EvidenceItem = {
  zoneId: number;
  title: string;
  roomName: string;
  icon: typeof Cpu;
  evidenceCode: string;
  anomalyFound: string;
  didacticDiagnosis: string;
  pedagogicalKey: string;
  pageRef: number;
};

const EVIDENCE_LIST: EvidenceItem[] = [
  {
    zoneId: 1,
    title: "Pièce #1 : Registre Mémoire Volatile Altéré",
    roomName: "Secteur 1 • Atelier Hardware & Software",
    icon: Cpu,
    evidenceCode: "EVID-01-RAM",
    anomalyFound:
      "Le terminal principal a crashé brutalement. Des processus non enregistrés ont disparu de la mémoire de travail sans laisser de trace sur le disque.",
    didacticDiagnosis:
      "Confusion matérielle entre mémoire vive temporaire (RAM volatile) et stockage permanent (SSD/Disque). Sans alimentation continue, les données de la RAM sont immédiatement perdues.",
    pedagogicalKey:
      "Démarche d'investigation : Observation concrète du comportement d'un ordinateur lors d'une coupure électrique pour comprendre la fonction de chaque composant matériel.",
    pageRef: 43,
  },
  {
    zoneId: 2,
    title: "Pièce #2 : Trame Réseau Falsifiée & Sources Douteuses",
    roomName: "Secteur 2 • Bio-Dôme & Systèmes IoT",
    icon: Globe2,
    evidenceCode: "EVID-02-NET",
    anomalyFound:
      "Le tableau de bord affichait une humidité optimale alors que les serres dépérissaient. L'automate suivait des consignes issues d'un site non vérifié.",
    didacticDiagnosis:
      "Absence d'esprit critique dans la recherche en ligne et rupture de la chaîne cybernétique (Capteur ➔ Traitement ➔ Actionneur). Les données affichées n'avaient pas été validées par recoupement.",
    pedagogicalKey:
      "Démarche d'investigation : Confrontation critique entre l'affichage numérique et la réalité physique du monde réel. Vérification méthodique de l'auteur, de la date et de la source.",
    pageRef: 37,
  },
  {
    zoneId: 3,
    title: "Pièce #3 : Le Logigramme en Boucle Infinie",
    roomName: "Secteur 3 • Réacteur & Robotique",
    icon: Bot,
    evidenceCode: "EVID-03-ALGO",
    anomalyFound:
      "Le robot d'inspection tournait en rond dans le sas de ventilation en répétant l'instruction « Avancer » sans jamais vérifier la présence d'obstacles.",
    didacticDiagnosis:
      "Absence de structure conditionnelle (Si... Alors... Sinon...). L'algorithme manquait d'une condition d'arrêt et confondait répétition simple et boucle conditionnelle bornée.",
    pedagogicalKey:
      "Démarche d'investigation : Expérimentation débranchée du déplacement au sol, identification du bug par simulation pas-à-pas, puis traduction en logigramme normalisé.",
    pageRef: 50,
  },
  {
    zoneId: 4,
    title: "Pièce #4 : L'E-mail d'Hameçonnage et Clé Compromise",
    roomName: "Secteur 4 • Centre de Cyberdéfense",
    icon: ShieldCheck,
    evidenceCode: "EVID-04-SEC",
    anomalyFound:
      "Une fausse alerte urgente de maintenance invitait un membre d'équipage à cliquer sur un lien externe et à saisir son code de sécurité « 123456 ».",
    didacticDiagnosis:
      "Attaque par ingénierie sociale (Phishing) combinée à un mot de passe trop court et prévisible. Les données personnelles du secteur ont été compromises.",
    pedagogicalKey:
      "Démarche d'investigation : Autopsie collective des indices suspects dans un message (expéditeur étrange, urgence injustifiée, URL masquée) et règles de cybersécurité.",
    pageRef: 39,
  },
  {
    zoneId: 5,
    title: "Pièce #5 : Le Diagnostic de Régulation Didactique",
    roomName: "Secteur 5 • Passerelle & Lab Pédagogique",
    icon: GraduationCap,
    evidenceCode: "EVID-05-DIDAC",
    anomalyFound:
      "Dans l'école de bord, les tablettes étaient utilisées comme simples récompenses de fin de tâche, sans objectif d'apprentissage FMTTN ni régulation.",
    didacticDiagnosis:
      "Glissement vers le techno-solutionnisme : utilisation du numérique sans valeur ajoutée didactique ni étayage réflexif. Les élèves consommaient du contenu sans comprendre le média.",
    pedagogicalKey:
      "Démarche d'investigation : Posture de l'enseignant régulateur, observation critériée des productions d'élèves et conception d'activités actives créatives et réflexives.",
    pageRef: 24,
  },
];

export function InvestigationModal({ isOpen, onClose, clearedZoneIds, openPdf }: Props) {
  const [activeTab, setActiveTab] = useState<"evidence" | "methodology">("evidence");

  if (!isOpen) return null;

  const totalCleared = clearedZoneIds.length;
  const isFullySolved = totalCleared === 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900/95 border border-indigo-500/40 shadow-2xl shadow-indigo-950/80 overflow-hidden">
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
              <FileSearch className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Dossier d'Investigation #FMTTN-404
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {totalCleared}/5 Preuves Collectées
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Affaire du Signal Fantôme de l'Arche FMTTN • Protocole d'Apprentissage par Investigation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Fermer le dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab("evidence")}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "evidence"
                ? "border-indigo-500 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileSearch className="w-4 h-4" />
            <span>Tableau des Preuves ({totalCleared}/5)</span>
          </button>

          <button
            onClick={() => setActiveTab("methodology")}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "methodology"
                ? "border-emerald-500 text-emerald-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>La Démarche d'Investigation Pédagogique</span>
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "evidence" && (
            <div className="space-y-4">
              {/* Introduction Banner */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs sm:text-sm text-indigo-200 leading-relaxed flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Principe de l'Enquête FMTTN :</strong> Chaque zone résolue
                  fournit une <strong className="text-emerald-300">Pièce à Conviction</strong>. En analysant
                  l'anomalie et en formulant les bonnes hypothèses, vous identifiez la cause première de
                  l'avarie. Réunissez les 5 pièces pour déverrouiller le Sas Final d'Évacuation !
                </div>
              </div>

              {/* 5 Evidence Cards */}
              <div className="space-y-3">
                {EVIDENCE_LIST.map((ev) => {
                  const isCleared = clearedZoneIds.includes(ev.zoneId);
                  const Icon = ev.icon;

                  return (
                    <div
                      key={ev.zoneId}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCleared
                          ? "bg-slate-900/90 border-emerald-500/40 shadow-md shadow-emerald-950/20"
                          : "bg-slate-950/40 border-slate-800 opacity-60"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                              isCleared
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-slate-800 text-slate-500 border border-slate-700"
                            }`}
                          >
                            {isCleared ? <Icon className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{ev.title}</h4>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                  isCleared
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "bg-slate-800 text-slate-500"
                                }`}
                              >
                                {ev.evidenceCode}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">{ev.roomName}</span>
                          </div>
                        </div>

                        {isCleared ? (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                              <CheckCircle2 className="w-4 h-4" />
                              Preuve Authentifiée
                            </span>
                            <button
                              onClick={() => openPdf(ev.pageRef)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono border border-slate-700 flex items-center gap-1 transition"
                            >
                              <BookOpen className="w-3 h-3 text-emerald-400" />
                              <span>p. {ev.pageRef}</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" />
                            Preuve non résolue (Visitez le secteur)
                          </span>
                        )}
                      </div>

                      {isCleared ? (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                          <div>
                            <span className="font-bold text-amber-300">Anomalie constatée : </span>
                            <span className="text-slate-300">{ev.anomalyFound}</span>
                          </div>
                          <div>
                            <span className="font-bold text-cyan-300">Diagnostic d'enquête : </span>
                            <span className="text-slate-300">{ev.didacticDiagnosis}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-indigo-500/20 text-indigo-200">
                            <strong className="text-indigo-400">Application Didactique : </strong>
                            {ev.pedagogicalKey}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic mt-1">
                          Les données de ce secteur sont encore brouillées. Rendez-vous dans la salle
                          pour recueillir les indices et formuler vos hypothèses diagnostiques.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress Footer */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-300">
                  État de l'investigation globale :{" "}
                  <strong className="text-white">
                    {totalCleared === 5
                      ? "Enquête résolue à 100% ! Vous pouvez entrer dans le Sas Final."
                      : `${totalCleared}/5 secteurs diagnostiqués. Continuez vos investigations.`}
                  </strong>
                </div>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30"
                >
                  Continuer l'Investigation
                </button>
              </div>
            </div>
          )}

          {activeTab === "methodology" && (
            <div className="space-y-6">
              {/* Educational Notice for Teachers */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-indigo-950/50 border border-emerald-500/40 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2">
                <div className="flex items-center gap-2 text-sm font-black text-emerald-300">
                  <Compass className="w-5 h-5 text-emerald-400" />
                  <span>POURQUOI L'APPRENTISSAGE PAR INVESTIGATION EN FMTTN ?</span>
                </div>
                <p>
                  Dans le référentiel FMTTN (Fédération Wallonie-Bruxelles), le numérique ne s'enseigne pas
                  comme une théorie abstraite ni comme une succession de clics passifs. Il s'apprend par la
                  <strong className="text-white"> démarche d'investigation</strong> : face à une situation
                  réelle ou un dysfonctionnement, l'élève émet des hypothèses, manipule le matériel ou le
                  code, confronte ses résultats et structure ses nouveaux savoirs.
                </p>
              </div>

              {/* The 5 Canonical Steps of Inquiry-Based Learning */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Les 5 Étapes de la Démarche d'Investigation Didactique</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs flex items-center justify-center">
                      1
                    </div>
                    <h5 className="text-xs font-bold text-white">Situation Déclenchante</h5>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Constat d'une anomalie ou d'un mystère concret (écran noir, robot bloqué, message suspect).
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center">
                      2
                    </div>
                    <h5 className="text-xs font-bold text-white">Émission d'Hypothèses</h5>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Formulation d'explications plausibles : matériel, logiciel, algorithme ou facteur humain ?
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center">
                      3
                    </div>
                    <h5 className="text-xs font-bold text-white">Recherche & Expérimentation</h5>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Manipulation débranchée, observation des logs, test de code et consultation du référentiel FMTTN.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center">
                      4
                    </div>
                    <h5 className="text-xs font-bold text-white">Confrontation & Validation</h5>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Réfutation ou confirmation de l'hypothèse de départ grâce aux preuves tangibles recueillies.
                    </p>
                  </div>

                  {/* Step 5 */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold text-xs flex items-center justify-center">
                      5
                    </div>
                    <h5 className="text-xs font-bold text-white">Institutionnalisation</h5>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Fixation des savoirs, trace écrite, charte d'usage et réinvestissement dans de nouvelles situations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Transposition en classe */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs text-slate-300">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Conseil de Transposition Didactique pour votre future classe :</span>
                </h4>
                <p>
                  Dans cet escape game, vos élèves ou vos étudiants vivent la démarche de l'intérieur. Pour
                  chaque défi de la vie courante (imprimante qui ne répond pas, image non libre de droit,
                  programme qui plante), évitez de donner la solution immédiatement : invitez-les à
                  <strong className="text-emerald-300"> mener l'enquête</strong> en verbalisant leurs
                  hypothèses et en vérifiant leurs sources.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
