"use client";

import clsx from "clsx";
import { ArrowDownUpIcon, BadgeCentIcon, CreditCard, File, Home, NotebookPenIcon, PiggyBank, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function LinkOnHeader({ user }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (!user || isHomePage) {
    return null;
  }

  const links = [
    { href: "/dashboard", Icon: Home, name: "Home" },
    { href: "/transacao", Icon: ArrowDownUpIcon, name: "Transações" },
    { href: "/boleto", Icon: File, name: "Boletos" },
    { href: "/cartao", Icon: CreditCard, name: "Cartões" },
    { href: "/conta", Icon: PiggyBank, name: "Contas" },
    { href: "/responsavel", Icon: Users, name: "Responsáveis" },
    { href: "/anotacao", Icon: NotebookPenIcon, name: "Anotações" },
  ];

  if (user.email === "coutinho@outlook.com") {
    links.push({ href: "/investimentos", Icon: BadgeCentIcon, name: "Investimentos" });
  }

  return (
    <>
      {links.map(({ href, Icon, name }) => (
        <Link key={href} href={href}>
          <LinkNavButton Icon={Icon} LinkName={name} isActive={pathname === href} />
        </Link>
      ))}
    </>
  );
}

export default LinkOnHeader;

export function LinkNavButton({ Icon, LinkName, isActive }) {
  return (
    <span
      className={clsx(
        "flex items-center gap-1 transition-colors duration-200",
        isActive ? "text-emerald-600 dark:text-orange-600" : "text-neutral-900 hover:text-orange-600 dark:text-white"
      )}
    >
      <Icon size={16} />
      <span>{LinkName}</span>
    </span>
  );
}
