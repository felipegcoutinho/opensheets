"use client";

import { UseDates } from "@/hooks/use-dates";
import clsx from "clsx";
import {
  ArrowDownUpIcon,
  BadgeCentIcon,
  CreditCard,
  File,
  Home,
  NotebookPenIcon,
  PiggyBank,
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
      path: "/transacao",
    },
    {
      href: `/dashboard/boleto?periodo=${month}`,
      Icon: File,
      name: "boletos",
      path: "/boleto",
    },
    {
      href: `/dashboard/cartao`,
      Icon: CreditCard,
      name: "cartões",
      path: "/cartao",
    },
    {
      href: `/dashboard/conta`,
      Icon: PiggyBank,
      name: "contas",
      path: "/conta",
    },
    {
      href: `/dashboard/responsavel?periodo=${month}`,
      Icon: Users,
      name: "responsáveis",
      path: "/responsavel",
    },
    {
      href: `/dashboard/anotacao?periodo=${month}`,
      Icon: NotebookPenIcon,
      name: "anotações",
      path: "/anotacao",
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
        "flex items-center gap-1 rounded p-1 transition-colors duration-700",
        isActive
          ? "font-bold text-black underline decoration-alt_violet decoration-2 underline-offset-8 dark:bg-transparent dark:text-alt_violet dark:decoration-alt_green"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800", // Estilo para link inativo
      )}
    >
      <Icon size={12} />
      {LinkName}
    </div>
  );
}
