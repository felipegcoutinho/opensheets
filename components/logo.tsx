"use client";

import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src={"/new_logo.svg"}
      alt="OpenSheets Logo"
      width={180}
      height={50}
      className="dark:brightness-0 dark:invert"
      // className="brightness-0 invert"
    />
  );
}
