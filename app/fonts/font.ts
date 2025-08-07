import { IBM_Plex_Sans, Inter } from "next/font/google";
import localFont from "next/font/local";

const ibmPlex = IBM_Plex_Sans({
  weight: ["500", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const itau = localFont({
  src: [
    {
      path: "../fonts/ItauTextPro_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ItauTextPro_Bd.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export { ibmPlex, inter, itau };
