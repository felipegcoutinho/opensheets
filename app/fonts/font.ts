import { Fira_Code, Fira_Sans } from "next/font/google";
import localFont from "next/font/local";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400"],
  fallback: ["sans-serif"],
});

const firaSansCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
  fallback: ["monospace"],
});

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

const googleSans = localFont({
  src: [
    {
      path: "../fonts/ProductSans-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/ProductSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ProductSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/ProductSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});
export { firaSans, firaSansCode, googleSans, uiSans };
