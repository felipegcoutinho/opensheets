import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

// const ibmPlex = IBM_Plex_Sans({
//   weight: ["500", "700"],
//   subsets: ["latin"],
// });

const default_font = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const money_values = Geist_Mono({
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

export { default_font, money_values };
