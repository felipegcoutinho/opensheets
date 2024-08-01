import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UseDates } from "@/hooks/UseDates";
import Link from "next/link";
import { getAccount } from "../actions/accounts";
import { deleteCards } from "../actions/cards";
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
        {getAccountMap?.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">{item.descricao}</CardTitle>
              <CardDescription>{item.tipo_conta}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Saldo R$ 2.000,00 </p>
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
                <form action={deleteCards}>
                  <Button className="p-0" variant="link" value={item.id} name="excluir">
                    excluir
                  </Button>
                </form>
                <Button className="p-0" variant="link">
                  <Link href={`/conta/${item.id}/${item.descricao.toLowerCase()}`}>extrato</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PageAccount;
