import { getCategoria } from "@/app/actions/cards";
import Numbers from "@/components/numbers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UseDates } from "@/hooks/use-dates";
import DetailsTransactions from "../../modal/details-transactions";

async function Page({ params, searchParams }) {
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  // Função para capitalizar a primeira letra
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Capitalizando a primeira letra de params.categoria
  const categoria = capitalizeFirstLetter(decodeURIComponent(params.categoria));
  const tipoTransacao = capitalizeFirstLetter(
    decodeURIComponent(params.tipo_transacao),
  );

  const getCategoriaMap = await getCategoria(month, categoria, tipoTransacao);

  return (
    <>
      <h1 className="my-6">Categoria | {categoria}</h1>
      <Table>
        <TableHeader>
          <TableRow className="border-b text-xs">
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Transação</TableHead>
            <TableHead>Condição</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {getCategoriaMap?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-bold">
                {DateFormat(item.data_compra)}
              </TableCell>
              <TableCell>
                {item.descricao}
                <span className="px-1 text-xs text-neutral-400">
                  {item.condicao === "Parcelado" &&
                    `${item.parcela_atual} de ${item.qtde_parcela}`}
                </span>
              </TableCell>
              <TableCell
                className={
                  item.tipo_transacao === "Receita"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {item.tipo_transacao}
              </TableCell>
              <TableCell>{item.condicao}</TableCell>
              <TableCell>{item.forma_pagamento}</TableCell>
              <TableCell>{item.categoria}</TableCell>
              <TableCell>{item.responsavel}</TableCell>
              <TableCell>
                <Numbers number={item.valor} />
              </TableCell>
              <TableCell className="flex gap-2 text-center">
                <DetailsTransactions
                  itemId={item.id}
                  itemPeriodo={item.periodo}
                  itemNotas={item.anotacao}
                  itemDate={item.data_compra}
                  itemDescricao={item.descricao}
                  itemCategoria={item.categoria}
                  itemCondicao={item.condicao}
                  itemResponsavel={item.responsavel}
                  itemTipoTransacao={item.tipo_transacao}
                  itemValor={item.valor}
                  itemFormaPagamento={item.forma_pagamento}
                  itemQtdeParcelas={item.qtde_parcela}
                  itemParcelaAtual={item.parcela_atual}
                  itemRecorrencia={item.recorrencia}
                  itemQtdeRecorrencia={item.qtde_recorrencia}
                  itemCartao={item.cartoes?.descricao}
                  itemPaid={item.realizado}
                  itemConta={item.contas?.descricao}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default Page;
