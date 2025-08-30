import { Inter, Oswald } from "next/font/google";
import localFont from "next/font/local";

const oswald = Oswald({
  weight: ["500"],
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const itau = localFont({
  src: [
    {
      path: "../fonts/ItauTextPro_Rg.woff2",
      weight: "400",
    },
  ],
});

const itau_bold = localFont({
  src: [
    {
      path: "../fonts/ItauTextPro_Bd.woff2",
      weight: "400",
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

const default_font = itau;
const money_values = itau_bold;

export { default_font, money_values, oswald };
