import localFont from "next/font/local";
import { Roboto, Fira_Sans, Geist } from "next/font/google";

const openRunde = localFont({
  src: [
    {
      path: "../fonts/OpenRunde-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/OpenRunde-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/OpenRunde-Bold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const firaSans = Fira_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const geist = Geist({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export { openRunde, roboto, firaSans, geist };
