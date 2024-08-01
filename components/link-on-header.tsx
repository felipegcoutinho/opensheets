"use client";

import { ArrowDownUpIcon, CreditCard, FileSpreadsheetIcon, Home, NotebookPenIcon, PiggyBank, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function LinkOnHeader({ user }) {
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  if (!user || isHomePage) {
    return null;
  }

  const searchParams = useSearchParams();

  const month = searchParams.get("periodo");

  return (
    <>
      <p className="font-bold text-lg">Opensheets</p>

      <Link href={`/dashboard?periodo=${month}`}>
        <LinkNavButton Icon={Home} LinkName="Home" />
      </Link>

      <Link href={`/transacao?periodo=${month}`}>
        <LinkNavButton Icon={ArrowDownUpIcon} LinkName="Transações" />
      </Link>

      <Link href={`/boleto?periodo=${month}`}>
        <LinkNavButton Icon={FileSpreadsheetIcon} LinkName="Boletos" />
      </Link>

      <Link href={`/cartao?periodo=${month}`}>
        <LinkNavButton Icon={CreditCard} LinkName="Cartões" />
      </Link>

      <Link href="/conta?periodo=${month}">
        <LinkNavButton Icon={PiggyBank} LinkName="Contas" />
      </Link>

      <Link href={`/responsavel?periodo=${month}`}>
        <LinkNavButton Icon={Users} LinkName="Responsáveis" />
      </Link>

      <Link href="/anotacao?periodo=${month}">
        <LinkNavButton Icon={NotebookPenIcon} LinkName="Anotações" />
      </Link>
    </>
  );
}

export default LinkOnHeader;

export function LinkNavButton({ Icon, LinkName }) {
  return (
    <span className="flex items-center gap-1">
      <Icon size={14} /> {LinkName}
    </span>
  );
}
