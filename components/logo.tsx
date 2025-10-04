"use client";

import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src={"/logo.png"}
      alt="OpenSheets Logo"
      width={180}
      height={60}
      className="brightness-0 dark:brightness-0 dark:invert"
    />
  );
}
