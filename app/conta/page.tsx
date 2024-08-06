import CardColor, { ColorDot } from "@/components/card-color";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { UseDates } from "@/hooks/UseDates";
import Link from "next/link";
import { deleteAccount, getAccount, getSumAccountExpense, getSumAccountIncome } from "../actions/accounts";
import CreateAccount from "./modal/create-accounts";
import UpdateCard from "./modal/update-accounts";

async function PageAccount({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getAccountMap = await getAccount();

  return (
    <div className="mt-4 w-full">
      <CreateAccount />

      <div className="grid grid-cols-4 gap-4 mt-4">
        {getAccountMap?.map(async (item) => {
          const accountExpense = await getSumAccountExpense(month, item.id);
          const sumAccountIncome = await getSumAccountIncome(month, item.id);

          return (
            <CardColor aparencia={item.aparencia} id={item.id}>
              <CardHeader>
                <ColorDot aparencia={item.aparencia} descricao={item.descricao} />
                <CardDescription>{item.tipo_conta}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Saldo {sumAccountIncome - accountExpense}</p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4">
                  <UpdateCard
                    itemId={item.id}
                    itemContaId={item.contas?.id}
                    itemDescricao={item.descricao}
                    itemTipoConta={item.tipo_conta}
                    itemAnotacao={item.anotacao}
                    itemAparencia={item.aparencia}
                  />
                  <form action={deleteAccount}>
                    <Button className="p-0" variant="link" value={item.id} name="excluir">
                      excluir
                    </Button>
                  </form>
                  <Button className="p-0" variant="link">
                    <Link href={`/conta/${item.id}/${item.descricao.toLowerCase()}`}>extrato</Link>
                  </Button>
                </div>
              </CardFooter>
            </CardColor>
          );
        })}
      </div>
    </div>
  );
}

export default PageAccount;
