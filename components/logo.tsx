"use client";

import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src={"/new_logo.svg"}
      alt="OpenSheets Logo"
      width={160}
      height={40}
      className="brightness-0 dark:brightness-0 dark:invert"
    />
  );
}
