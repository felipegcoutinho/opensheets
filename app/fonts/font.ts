import { Gabarito, Geist, Geist_Mono, IBM_Plex_Sans } from "next/font/google";
import localFont from "next/font/local";

const ibm_plex = IBM_Plex_Sans({
  weight: ["500", "700"],
  subsets: ["latin"],
});

const gabarito = Gabarito({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geist_mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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

const default_font = geist;
const money_values = gabarito;

export { default_font, money_values };
