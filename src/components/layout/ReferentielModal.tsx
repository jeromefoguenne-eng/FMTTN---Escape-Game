"use client";

import { useState, useEffect } from "react";
import { BookOpen, ExternalLink, X, Bookmark, FileText, AlertCircle } from "lucide-react";

type Props = {
  isOpen?: boolean;
  page?: number | null;
  onClose?: () => void;
  showButton?: boolean;
};

export function ReferentielModal({
  isOpen: externalIsOpen,
  page: externalPage,
  onClose: externalOnClose,
  showButton = true,
}: Props) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(2);

  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  useEffect(() => {
    if (externalPage !== undefined && externalPage !== null) {
      setCurrentPage(externalPage);
    }
  }, [externalPage]);

  function handleClose() {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  }

  const SHORTCUTS = [
    { label: "Sommaire", page: 2 },
    { label: "Finalités & Enjeux", page: 18 },
    { label: "Volet 1 : FMTT (Atelier & Démarche)", page: 22 },
    { label: "Volet 2 : Numérique (Médias & Code)", page: 24 },
    { label: "Les 5 Visées du Tronc Commun", page: 26 },
    { label: "Glossaire : Matière / Matériau", page: 99 },
    { label: "Glossaire : Traces & Identité Num.", page: 100 },
    { label: "Logigrammes & Algorithmique", page: 101 },
  ];

  const pdfUrl = `/docs/refFMTTN.pdf#page=${currentPage}`;

  return (
    <>
      {/* Floating / Nav Button */}
      {showButton && (
        <button
          onClick={() => {
            if (isControlled && externalOnClose) {
              // Controlled from parent
            } else {
              setInternalIsOpen(true);
            }
          }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 hover:border-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20 cursor-pointer"
          title="Ouvrir le référentiel officiel FMTTN"
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Référentiel FMTTN</span>
        </button>
      )}

      {/* Full Modal Viewer */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 md:p-6 animate-fade-in">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-6xl h-[94vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden text-slate-100">
            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 bg-slate-900/95">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>Référentiel FMTTN — Tronc Commun FWB</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Page {currentPage} / 103
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Formation Manuelle, Technique, Technologique et Numérique (P1 à S3)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/docs/refFMTTN.pdf#page=${currentPage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors font-bold shadow-md shadow-indigo-600/30"
                  title="Ouvrir le PDF dans un nouvel onglet de votre navigateur"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ouvrir dans un onglet séparé (Pleine Page)</span>
                </a>

                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Page Jump Bar */}
            <div className="px-4 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs scrollbar-thin">
              <span className="flex items-center gap-1 text-slate-400 shrink-0 font-medium text-[11px]">
                <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                Repères Didactiques :
              </span>
              {SHORTCUTS.map((s) => (
                <button
                  key={s.page}
                  onClick={() => setCurrentPage(s.page)}
                  className={`px-2.5 py-1 rounded-lg transition-colors shrink-0 text-xs font-medium border cursor-pointer ${
                    currentPage === s.page
                      ? "bg-emerald-600/40 text-emerald-200 border-emerald-500"
                      : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/60"
                  }`}
                >
                  {s.label} <span className="text-[10px] text-emerald-400 font-mono">(p.{s.page})</span>
                </button>
              ))}
            </div>

            {/* Dual Embed: Object with fallback to Iframe & Direct Download/Open */}
            <div className="flex-1 w-full bg-slate-950 relative flex flex-col">
              <object
                key={`obj-${currentPage}`}
                data={pdfUrl}
                type="application/pdf"
                className="w-full h-full flex-1"
              >
                <iframe
                  key={`ifr-${currentPage}`}
                  src={pdfUrl}
                  className="w-full h-full border-none flex-1"
                  title="Visualiseur Référentiel FMTTN"
                >
                  <div className="p-8 text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
                    <p className="text-slate-300">
                      Votre navigateur ne permet pas l'aperçu PDF direct dans cette fenêtre.
                    </p>
                    <a
                      href={`/docs/refFMTTN.pdf#page=${currentPage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Ouvrir le référentiel dans un nouvel onglet</span>
                    </a>
                  </div>
                </iframe>
              </object>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
