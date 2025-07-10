"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

export default function Logo() {
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";

  return (
    <Image
      src={"/new_logo.svg"}
      alt="OpenSheets Logo"
      width={180}
      height={50}
      className="dark:brightness-0 dark:invert"
    />
  );
}
