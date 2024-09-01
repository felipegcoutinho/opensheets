import CardColor, { ColorDot } from "@/components/card-color";
import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
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

  const accountData = await Promise.all(
    getAccountMap.map(async (item) => {
      const accountExpense = await getSumAccountExpense(month, item.id);
      const sumAccountIncome = await getSumAccountIncome(month, item.id);
      return {
        ...item,
        saldo: sumAccountIncome - accountExpense,
      };
    })
  );

  return (
    <div className="mt-4 w-full">
      <CreateAccount />

      <div className="grid grid-cols-4 gap-4 mt-4">
        {accountData.length !== 0 ? (
          accountData.map((item) => (
            <CardColor key={item.id} aparencia={item.aparencia} id={item.id}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <ColorDot aparencia={item.aparencia} descricao={item.descricao} />
                </div>
                <div>
                  <p className="text-sm">
                    Saldo <Numbers number={item.saldo} />
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-zinc-600/10 py-1 px-6 flex justify-between">
                <Button className="p-0" variant="link">
                  <Link href={`/conta/${item.id}/${item.descricao.toLowerCase()}`}>extrato</Link>
                </Button>

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
              </CardFooter>
            </CardColor>
          ))
        ) : (
          <EmptyCard height={100} width={100} />
        )}
      </div>
    </div>
  );
}

export default PageAccount;
