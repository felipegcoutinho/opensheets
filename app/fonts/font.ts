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
    {
      path: "../fonts/SharpGroteskMedium.woff2",
      weight: "500",
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
    {
      path: "../fonts/OpenRunde-Bold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
});

export { AtlasGrotesk, openRunde, uiSans };
