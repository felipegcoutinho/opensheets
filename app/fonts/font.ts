import { Oswald } from "next/font/google";
import localFont from "next/font/local";

const aeonik = localFont({
  src: [
    {
      path: "../fonts/AeonikFono-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
});

const aeonik_extended = localFont({
  src: [
    {
      path: "../fonts/aeonikextended.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

const default_font = aeonik;
const money_values = aeonik;
const title_font = aeonik_extended;

export { default_font, money_values, title_font };
