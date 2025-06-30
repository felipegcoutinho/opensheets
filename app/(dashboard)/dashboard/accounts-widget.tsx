import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import {
  getSumAccountExpense,
  getSumAccountIncome,
} from "@/app/actions/transactions/fetch_transactions";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { PaymentMethodLogo } from "@/components/payment-method-logo";
import { RiArrowRightUpLine } from "@remixicon/react";
import Link from "next/link";

export default async function AccountWidget({ month }: { month?: string }) {
  const data = await getAccount();

  if (!data || data.length === 0) return <EmptyCard />;

  const sortedData = [...data].sort((a, b) => b.saldo - a.saldo);

  const accountData = await Promise.all(
    data.map(async (item) => {
      const sumAccountIncome = await getSumAccountIncome(month!, item.id);
      const accountExpense = await getSumAccountExpense(month!, item.id);
      return {
        ...item,
        saldo: sumAccountIncome - accountExpense,
      };
    }),
  );

  return (
    <>
      {accountData.map((item) => (
        <div
          key={item.id}
          className="border-border/50 flex items-center justify-between border-b py-2"
        >
          <div className="flex items-center gap-3">
            <PaymentMethodLogo
              url_name={`/logos/${item.logo_image}`}
              width={40}
              height={40}
            />
            <div>
              <Link
                className="flex items-center gap-1 hover:underline"
                href={`/conta/${item.id}`}
              >
                {item.descricao}
                <RiArrowRightUpLine className="text-muted-foreground h-3 w-3" />
              </Link>
              <p className="text-muted-foreground text-xs">{item.tipo_conta}</p>
            </div>
          </div>

          <div className="text-right">
            <MoneyValues value={item.saldo} />
          </div>
        </div>
      ))}
    </>
  );
}
