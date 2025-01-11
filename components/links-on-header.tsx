"use client";

import { UseDates } from "@/hooks/use-dates";
import clsx from "clsx";
import {
  ArrowDownUpIcon,
  BadgeCentIcon,
  CreditCard,
  File,
  Home,
  Landmark,
  NotebookPenIcon,
  Users,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function LinkOnHeader({ user }) {
  const { currentMonthName, currentYear } = UseDates();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHomePage = pathname === "/";

  let month =
    searchParams.get("periodo") || `${currentMonthName}-${currentYear}`;

  if (!user || isHomePage) return null;

  const links = [
    {
      href: `/dashboard?periodo=${month}`,
      Icon: Home,
      name: "dashboard",
      path: "/dashboard",
    },
    {
      href: `/dashboard/transacao?periodo=${month}`,
      Icon: ArrowDownUpIcon,
      name: "transações",
      path: "/dashboard/transacao",
    },
    {
      href: `/dashboard/boleto?periodo=${month}`,
      Icon: File,
      name: "boletos",
      path: "/dashboard/boleto",
    },
    {
      href: `/dashboard/cartao`,
      Icon: CreditCard,
      name: "cartões",
      path: "/dashboard/cartao",
    },
    {
      href: `/dashboard/conta`,
      Icon: Landmark,
      name: "contas",
      path: "/dashboard/conta",
    },
    {
      href: `/dashboard/responsavel?periodo=${month}`,
      Icon: Users,
      name: "responsáveis",
      path: "/dashboard/responsavel",
    },
    {
      href: `/dashboard/anotacao?periodo=${month}`,
      Icon: NotebookPenIcon,
      name: "anotações",
      path: "/dashboard/anotacao",
    },
  ];

  if (user.email === "coutinho@outlook.com") {
    links.push({
      href: `/dashboard/investimentos`,
      Icon: BadgeCentIcon,
      name: "investimentos",
      path: "/investimentos",
    });
  }

  return (
    <>
      {links.map(({ href, Icon, name, path }) => (
        <Link key={href} href={href}>
          <LinkNavButton
            Icon={Icon}
            LinkName={name}
            isActive={pathname === path}
          />
        </Link>
      ))}
    </>
  );
}

export default LinkOnHeader;

export function LinkNavButton({ Icon, LinkName, isActive }) {
  return (
    <div
      className={clsx(
        "flex items-center px-1 text-base transition-colors duration-700",
        isActive
          ? "text-blue-600 dark:text-orange-400"
          : "text-neutral-600 hover:text-blue-600 dark:text-neutral-300 dark:hover:bg-neutral-800",
      )}
    >
      {/* <Icon size={12} /> */}
      {LinkName}
    </div>
  );
}
