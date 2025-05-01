import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

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

const AtlasGrotesk = localFont({
  src: [
    {
      path: "../fonts/AtlasGroteskRegularWeb.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/AtlasGroteskMediumWeb.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

const SharpGrotesk = localFont({
  src: [
    {
      path: "../fonts/SharpGroteskMedium.woff2",
      weight: "200",
      style: "normal",
    },
  ],
});

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
    // {
    //   path: "../fonts/OpenRunde-Bold.woff2",
    //   weight: "600",
    //   style: "normal",
    // },
  ],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export { AtlasGrotesk, inter, jetbrains, openRunde, SharpGrotesk, uiSans };
