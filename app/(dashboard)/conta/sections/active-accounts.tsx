import {
  getAccount,
} from "@/app/actions/accounts/fetch_accounts";
import {
  getSumAccountExpenseToDate,
  getSumAccountIncomeToDate,
} from "@/app/actions/transactions/fetch_transactions";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import PaymentMethodLogo from "@/components/payment-method-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import UpdateCard from "../modal/update-accounts";

export default async function ActiveAccountsSection({ month }: { month: string }) {
  const contasAtivas = (await getAccount()).filter((item) => item.status === "ativo");

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
    <div className="grid gap-4 lg:grid-cols-3">
      {accountData.map((item) => (
        <Card key={item.id} className="p-2">
          <CardContent className="space-y-4 p-4">
            <CardTitle className="flex items-center justify-between">
              <PaymentMethodLogo
                url_name={`/logos/${item.logo_image}`}
                descricao={item.descricao}
                width={50}
                height={50}
              />
            </CardTitle>

            <p className="text-muted-foreground text-sm">
              Saldo <MoneyValues value={item.saldo} />
            </p>
          </CardContent>

          <CardFooter className="flex justify-between px-4">
            <Button className="p-0" variant="link">
              <Link href={`/conta/${item.id}`}>extrato</Link>
            </Button>

            <UpdateCard item={item} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

