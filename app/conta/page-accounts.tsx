import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getAccount } from "../actions/accounts";
import { deleteCards } from "../actions/cards";
import CreateAccount from "./modal/create-accounts";
import UpdateCard from "./modal/update-accounts";

async function PageAccount({ month }) {
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
            {/* <CardContent>
              <p className="text-sm">Fecha dia {item.dt_fechamento}</p>
              <p className="text-sm">Vence dia {item.dt_vencimento}</p>
              <p className="text-sm">Cartão {item.tipo}</p>
            </CardContent> */}
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
