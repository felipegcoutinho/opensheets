import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

function SidebarIcon() {
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";

  return (
    <Link href="#" className="flex items-center">
      <Image
        src={
          darkMode ? "/sidebar_icon_logo_dark.svg" : "/sidebar_icon_logo.svg"
        }
        alt="OpenSheets Logo"
        width={200}
        height={50}
      />
    </Link>
  );
}

export default SidebarIcon;
