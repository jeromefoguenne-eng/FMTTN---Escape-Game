import type { Metadata } from "next";
import { Poppins, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { VisitTracker } from "@/components/analytics/VisitTracker";
import { PrivacyNotice } from "@/components/layout/PrivacyNotice";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "L'Arche FMTTN — Escape Game Didactique Intergalactique",
  description:
    "Sauvez les passagers de l'Arche spatiale grâce aux compétences du Tronc Commun FMTTN (Formation Manuelle, Technique, Technologique et Numérique - FWB).",
  keywords: ["FMTTN", "Tronc Commun", "FWB", "Escape Game", "Didactique", "Formation Enseignants", "Technologie", "Numérique"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} ${orbitron.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <VisitTracker />
          {children}
          <PrivacyNotice />
        </ThemeProvider>
      </body>
    </html>
  );
}
