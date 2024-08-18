import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UseDates } from "@/hooks/UseDates";
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
            <TableHead>Descrição</TableHead>
            <TableHead>Data de Vencimento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Condição</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {getBillsMap?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-bold">{item.descricao}</TableCell>
              <TableCell>{DateFormat(item.dt_vencimento)}</TableCell>
              <TableCell>{Number(item.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
              <TableCell className={`${item.status_pagamento === "Pago" ? "text-green-500" : "text-orange-500"}`}>{item.status_pagamento}</TableCell>
              <TableCell>{item.responsavel}</TableCell>
              <TableCell>{item.categoria}</TableCell>
              <TableCell>{item.condicao}</TableCell>

              <TableCell className="flex gap-2">
                <UpdateBills
                  itemId={item.id}
                  itemDescricao={item.descricao}
                  itemPeriodo={item.periodo}
                  itemDtVencimento={item.dt_vencimento}
                  itemStatusPagamento={item.status_pagamento}
                  itemResponsavel={item.responsavel}
                  itemSegundoResponsavel={item.segundo_responsavel}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default PageBills;
