import { Geist, Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const geist = Geist({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export { geist, roboto };
