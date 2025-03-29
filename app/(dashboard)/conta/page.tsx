import {
  deleteAccount,
  getSumAccountExpense,
  getSumAccountIncome,
} from "@/actions/accounts";
import { getAccount } from "@/app/services/contas";
import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { getPeriodo } from "@/hooks/periodo";
import Image from "next/image";
import Link from "next/link";
import CreateAccount from "./modal/create-accounts";
import UpdateCard from "./modal/update-accounts";

async function PageAccount(props) {
  const month = await getPeriodo(props);

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

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {accountData.length !== 0 ? (
          accountData.map((item) => (
            <Card key={item.id}>
              <CardContent className="space-y-4 p-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      quality={100}
                      src={`/logos/${item.logo_image}`}
                      className="rounded-full shadow-lg"
                      width={45}
                      height={45}
                      alt="Logo da conta"
                    />

                    {item.descricao}
                  </div>
                </CardTitle>

                <p className="text-sm text-neutral-500 dark:text-neutral-300">
                  Saldo <Numbers value={item.saldo} />
                </p>
              </CardContent>

              <CardFooter className="flex justify-between px-6 py-1 text-black backdrop-blur-xs">
                <Button className="p-0" variant="link">
                  <Link
                    href={`/conta/${item.id}/${item.descricao.toLowerCase()}`}
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
