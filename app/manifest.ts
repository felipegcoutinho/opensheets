import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "opensheets",
    short_name: "opensheets",
    description:
      "Aplicação para finanças pessoais, com o objetivo de ajudar a organizar e controlar suas finanças.",
    start_url: "/login",
    background_color: "#ffffff",
    theme_color: "#C080F8",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
