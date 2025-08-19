import {
  getSumAccountExpense,
  getSumAccountIncome,
  getSumAccountExpenseToDate,
  getSumAccountIncomeToDate,
} from "@/app/actions/transactions/fetch_transactions";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import PaymentMethodLogo from "@/components/payment-method-logo";
import { RiArrowRightSFill } from "@remixicon/react";
import Link from "next/link";

export default async function AccountWidget({
  month,
  data,
  previstoAnterior,
}: {
  month: string;
  data: any;
  previstoAnterior: number;
}) {
  if (!data || data.length === 0) return <EmptyCard />;

  const sortedData = [...data].sort((a, b) => b.saldo - a.saldo);

  const accountData = await Promise.all(
    data.map(async (item) => {
      const [incomeToDate, expenseToDate] = await Promise.all([
        getSumAccountIncomeToDate(month!, item.id),
        getSumAccountExpenseToDate(month!, item.id),
      ]);

      return {
        ...item,
        saldo: incomeToDate - expenseToDate,
      };
    }),
  );

  return (
    <>
      {accountData.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b border-dashed py-2 last:border-0"
        >
          <div className="flex items-center gap-1">
            <PaymentMethodLogo
              url_name={`/logos/${item.logo_image}`}
              width={40}
              height={40}
            />
            <div>
              <Link
                className="flex items-center font-medium hover:underline"
                href={`/conta/${item.id}`}
              >
                {item.descricao}
                <RiArrowRightSFill className="text-muted-foreground h-3 w-3" />
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
