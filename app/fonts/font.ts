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
      path: "../fonts/ItauText-XBold.woff2",
      weight: "800",
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

const waldernburg = localFont({
  src: [
    {
      path: "../fonts/Waldenburg-Regular-subset.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Waldenburg-Bold-subset.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

const default_font = sofascore;
const money_values = waldernburg;
const title_font = oswald;

export { default_font, money_values, title_font };
