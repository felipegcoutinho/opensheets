"use client";

import { ArrowDownUpIcon, BadgeCentIcon, CreditCard, FileSpreadsheetIcon, Home, NotebookPenIcon, PiggyBank, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function LinkOnHeader({ user }) {
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  if (!user || isHomePage) {
    return null;
  }

  return (
    <>
      <Link href={`/dashboard`}>
        <LinkNavButton Icon={Home} LinkName="Home" />
      </Link>

      <Link href={`/transacao`}>
        <LinkNavButton Icon={ArrowDownUpIcon} LinkName="Transações" />
      </Link>

      <Link href={`/boleto`}>
        <LinkNavButton Icon={FileSpreadsheetIcon} LinkName="Boletos" />
      </Link>

      <Link href={`/cartao`}>
        <LinkNavButton Icon={CreditCard} LinkName="Cartões" />
      </Link>

      <Link href="/conta">
        <LinkNavButton Icon={PiggyBank} LinkName="Contas" />
      </Link>

      <Link href={`/responsavel`}>
        <LinkNavButton Icon={Users} LinkName="Responsáveis" />
      </Link>

      <Link href="/anotacao">
        <LinkNavButton Icon={NotebookPenIcon} LinkName="Anotações" />
      </Link>

      {user.email === "coutinho@outlook.com" && (
        <Link href="/investimentos">
          <LinkNavButton Icon={BadgeCentIcon} LinkName="Investimentos" />
        </Link>
      )}
    </>
  );
}

export default LinkOnHeader;

export function LinkNavButton({ Icon, LinkName }) {
  return (
    <span className="flex items-center gap-1 dark:text-white">
      <Icon size={14} /> {LinkName}
    </span>
  );
}
