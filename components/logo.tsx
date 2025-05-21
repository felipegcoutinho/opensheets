import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";

  return (
    <Link href="#">
      <Image
        src={darkMode ? "/new_logo_dark.svg" : "/new_logo.svg"}
        alt="OpenSheets Logo"
        width={180}
        height={50}
      />
    </Link>
  );
}
