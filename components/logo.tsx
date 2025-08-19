"use client";

import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src={"/new_logo.svg"}
      alt="OpenSheets Logo"
      width={140}
      height={30}
      className="dark:brightness-0 dark:invert"
    />
  );
}
