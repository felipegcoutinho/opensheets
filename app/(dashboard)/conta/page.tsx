import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import {
  getSumAccountExpense,
  getSumAccountIncome,
} from "@/app/actions/transactions/fetch_transactions";
import EmptyCard from "@/components/empty-card";
import { PaymentMethodLogo } from "@/components/logos-on-table";
import MoneyValues from "@/components/money-values";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { getMonth } from "@/hooks/get-month";
import Link from "next/link";
import CreateAccount from "./modal/create-accounts";
import UpdateCard from "./modal/update-accounts";

async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);
  const getAccountMap = await getAccount();

  const accountData = await Promise.all(
    getAccountMap.map(async (item) => {
      const accountExpense = await getSumAccountExpense(item.id);
      const sumAccountIncome = await getSumAccountIncome(item.id);
      return {
        ...item,
        saldo: sumAccountIncome - accountExpense,
      };
    }),
  );

  return (
    <div className="w-full">
      <CreateAccount />

      <div className="grid gap-4 lg:grid-cols-3">
        {accountData.length !== 0 ? (
          accountData.map((item) => (
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

                <UpdateCard
                  itemId={item.id}
                  itemContaId={item.contas?.id}
                  itemDescricao={item.descricao}
                  itemTipoConta={item.tipo_conta}
                  itemAnotacao={item.anotacao}
                  itemLogo={item.logo_image}
                  itemIsIgnored={item.is_ignored}
                />
              </CardFooter>
            </Card>
          ))
        ) : (
          <EmptyCard />
        )}
      </div>
    </div>
  );
}

export default page;
