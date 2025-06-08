import { IBM_Plex_Sans, Inter, Roboto_Flex } from "next/font/google";

const roboto_flex = Roboto_Flex({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const ibmPlex = IBM_Plex_Sans({
  weight: ["500", "700"],
  subsets: ["latin"],
});

export { roboto_flex, inter, ibmPlex };
