import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FMTTN Escape — Mission Tronc Commun",
    short_name: "FMTTN Escape",
    description: "Escape Game Pédagogique sur le Référentiel FMTTN du Tronc Commun (FWB)",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f1d",
    theme_color: "#10b981",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
