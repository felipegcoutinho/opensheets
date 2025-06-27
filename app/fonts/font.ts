import { IBM_Plex_Sans, Inter } from "next/font/google";

const ibmPlex = IBM_Plex_Sans({
  weight: ["500", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export { ibmPlex, inter };
