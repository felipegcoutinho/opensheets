import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { UseDates } from "@/hooks/use-dates";
import {
  deleteAccount,
  getAccount,
  getSumAccountExpense,
  getSumAccountIncome,
} from "@actions/accounts";
import Image from "next/image";
import Link from "next/link";
import CreateAccount from "./modal/create-accounts";
import UpdateCard from "./modal/update-accounts";

async function PageAccount(props) {
  const searchParams = await props.searchParams;
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getAccountMap = await getAccount();

  const accountData = await Promise.all(
    getAccountMap.map(async (item) => {
      const accountExpense = await getSumAccountExpense(month, item.id);
      const sumAccountIncome = await getSumAccountIncome(month, item.id);
      return {
        ...item,
        saldo: sumAccountIncome - accountExpense,
      };
    }),
  );

  return (
    <div className="w-full">
      <CreateAccount />

      <div className="mt-4 grid gap-4 lg:grid-cols-4">
        {accountData.length !== 0 ? (
          accountData.map((item) => (
            <Card key={item.id}>
              <CardContent className="space-y-4 p-6">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={`/logos/${item.logo_image}`}
                      className="rounded shadow-lg"
                      width={45}
                      height={45}
                      alt={item.logo_image}
                    />

                    {item.descricao}
                  </div>
                </CardTitle>

                <p className="text-sm text-neutral-500">
                  Saldo <Numbers number={item.saldo} />
                </p>
              </CardContent>

              <CardFooter className="flex justify-between bg-neutral-100 px-6 py-1 dark:bg-neutral-700">
                <Button className="p-0 font-bold" variant="link">
                  <Link
                    href={`/dashboard/conta/${item.id}/${item.descricao.toLowerCase()}`}
                  >
                    extrato
                  </Link>
                </Button>

                <UpdateCard
                  itemId={item.id}
                  itemContaId={item.contas?.id}
                  itemDescricao={item.descricao}
                  itemTipoConta={item.tipo_conta}
                  itemAnotacao={item.anotacao}
                  itemLogo={item.logo_image}
                />

                <form action={deleteAccount}>
                  <Button
                    className="p-0"
                    variant="link"
                    value={item.id}
                    name="excluir"
                  >
                    excluir
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ))
        ) : (
          <EmptyCard height={100} width={100} />
        )}
      </div>
    </div>
  );
}

export default PageAccount;
