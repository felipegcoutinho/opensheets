import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import {
  getSumAccountExpenseToDate,
  getSumAccountIncomeToDate,
} from "@/app/actions/transactions/fetch_transactions";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import UpdateCard from "../modal/update-accounts";
import PaymentMethodLogo from "../../../../components/payment-method-logo";

export default async function ActiveAccountsSection({
  month,
}: {
  month: string;
}) {
  const contasAtivas = ((await getAccount()) ?? []).filter(
    (item) => item.status === "ativo",
  );

  if (!contasAtivas?.length) return <EmptyCard />;

  const accountData = await Promise.all(
    contasAtivas.map(async (item) => {
      const [expenseToDate, incomeToDate] = await Promise.all([
        getSumAccountExpenseToDate(month, item.id),
        getSumAccountIncomeToDate(month, item.id),
      ]);
      return {
        ...item,
        saldo: incomeToDate - expenseToDate,
      };
    }),
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {accountData.map((item) => (
        <Card key={item.id} className="group">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-1">
              <div className="inline-flex items-center justify-center">
                <PaymentMethodLogo
                  url_name={`/logos/${item.logo_image}`}
                  width={42}
                  height={42}
                />
              </div>
              <CardTitle className="capitalize">
                <Link href={`/conta/${item.id}`} className="hover:underline">
                  {item.descricao}
                </Link>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Saldo</div>
            <div className="text-2xl font-semibold">
              <MoneyValues value={item.saldo} />
            </div>
            <div className="text-muted-foreground mt-1 text-xs capitalize">
              Conta {item.tipo_conta}
            </div>

            <div className="mt-6 flex items-center gap-6">
              <UpdateCard item={item} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
