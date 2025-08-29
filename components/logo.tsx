"use client";

import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src={"/new_logo.svg"}
      alt="OpenSheets Logo"
      width={150}
      height={30}
      className="brightness-0 dark:brightness-0 dark:invert"
    />
  );
}
