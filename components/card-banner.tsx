"use client";
import { usePathname } from "next/navigation";
import { Card } from "./ui/card";

function CardBanner({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) {
    return null;
  }
  return (
    <Card className="h-32 p-6 bg-violet-200 ring-0 w-full">
      <div className="flex justify-between items-center">{children}</div>
    </Card>
  );
}

export default CardBanner;
