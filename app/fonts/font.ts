import { Fira_Sans, Gabarito, Inter } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"], weight: ["500", "600"], fallback: ["system-ui", "arial"] });
const gabarito = Gabarito({ subsets: ["latin"] });
const firaSans = Fira_Sans({ subsets: ["latin"], weight: ["400", "600"] });

const uiSans = localFont({
  src: [
    { path: "../fonts/ui-sans-v9-regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ui-sans-v9-medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ui-sans-v9-bold.woff2", weight: "600", style: "normal" },
  ],
});
export { firaSans, gabarito, inter, uiSans };
