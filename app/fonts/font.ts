import { Bebas_Neue, Gabarito, Inter } from "next/font/google";
import localFont from "next/font/local";

const uiSans = localFont({
  src: [
    {
      path: "../fonts/ui-sans-v9-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ui-sans-v9-medium.woff2",
      weight: "500",
      style: "normal",
    },
    { path: "../fonts/ui-sans-v9-bold.woff2", weight: "600", style: "normal" },
  ],
});

const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "700"],
  fallback: ["monospace"],
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  fallback: ["monospace"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  fallback: ["monospace"],
});

export { bebasNeue, gabarito, inter, uiSans };
