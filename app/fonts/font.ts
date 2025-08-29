import {
  Barlow_Condensed,
  Encode_Sans_Condensed,
  Gabarito,
  Geist,
  Geist_Mono,
  IBM_Plex_Sans,
  Inter,
  Roboto_Condensed,
} from "next/font/google";
import localFont from "next/font/local";

const ibm_plex = IBM_Plex_Sans({
  weight: ["500", "700"],
  subsets: ["latin"],
});

const encode = Encode_Sans_Condensed({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
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

const sofascore = localFont({
  src: [
    {
      path: "../fonts/SofaSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/SofaSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

const sofascore_mono = localFont({
  src: [
    {
      path: "../fonts/SofascoreMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

const default_font = itau;
const money_values = encode;

export { default_font, money_values };
