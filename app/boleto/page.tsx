import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UseDates } from "@/hooks/use-dates";
import { Check, RefreshCw } from "lucide-react";
import { getAccount } from "../actions/accounts";
import { getBills } from "../actions/bills";
import CreateBills from "./modal/create-bills";
import DeleteBills from "./modal/delete-bills";
import UpdateBills from "./modal/update-bills";

async function PageBills({ searchParams }) {
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getBillsMap = await getBills(month);
  const getAccountMap = await getAccount();

  return (
    <div className="mt-4 w-full">
      <CreateBills getAccountMap={getAccountMap} />

      <Table className="mt-6">
        <TableHeader>
          <TableRow className="border-b text-xs">
            <TableHead>Data de Vencimento</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Condição</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getBillsMap?.length !== 0 ? (
            getBillsMap?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{DateFormat(item.dt_vencimento)}</TableCell>
                <TableCell className="font-bold capitalize">
                  {item.descricao}
                </TableCell>
                <TableCell>
                  <Numbers number={item.valor} />
                </TableCell>
                <TableCell>
                  <CardTitle className="text-md flex items-center gap-1 capitalize">
                    {item.status_pagamento === "Pago" ? (
                      <Button className="h-6" variant="success" type="button">
                        Pago
                      </Button>
                    ) : (
                      <Button className="h-6" variant="warning" type="button">
                        Pendente
                      </Button>
                    )}
                  </CardTitle>
                </TableCell>
                <TableCell>
                  <CardTitle
                    className={`text-md flex items-center gap-1 capitalize ${item.responsavel === "Você" ? "text-blue-600" : "text-orange-500"}`}
                  >
                    <div
                      className={`h-2 w-2 rounded-none ${item.responsavel === "Você" ? "bg-blue-600" : "bg-orange-500"} `}
                    />
                    {item.responsavel}
                  </CardTitle>
                </TableCell>
                <TableCell>{item.categoria}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1">
                    {item.condicao === "Recorrente" && <RefreshCw size={12} />}
                    {item.condicao === "Vista" && <Check size={12} />}

                    <span className="capitalize">{item.condicao}</span>
                  </span>
                </TableCell>

                <TableCell className="flex gap-2">
                  <UpdateBills
                    itemId={item.id}
                    itemDescricao={item.descricao}
                    itemPeriodo={item.periodo}
                    itemDtVencimento={item.dt_vencimento}
                    itemStatusPagamento={item.status_pagamento}
                    itemResponsavel={item.responsavel}
                    itemCategoria={item.categoria}
                    itemValor={item.valor}
                    itemDtPagamento={item.dt_pagamento}
                    itemAnotacao={item.anotacao}
                    itemCondicao={item.condicao}
                    itemQtdeRecorrencia={item.qtde_recorrencia}
                    getAccountMap={getAccountMap}
                    itemContaId={item.contas?.id}
                  />

                  <DeleteBills itemId={item.id} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                <EmptyCard width={100} height={100} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default PageBills;
