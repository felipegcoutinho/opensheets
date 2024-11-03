import Numbers from "@/components/numbers";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UseDates } from "@/hooks/use-dates";
import { getCategoria } from "@actions/cards";
import DetailsTransactions from "@dashboard/transacao/modal/details-transactions";
import { CalendarClockIcon, Check, RefreshCw } from "lucide-react";

async function Page(props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
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
      <h1 className="mt-6 text-xl">Categoria | {tipoTransacao}</h1>
      <h2 className="mb-6 mt-2">
        <Badge className="text-sm">{categoria}</Badge>
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-b text-xs">
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Transação</TableHead>
            <TableHead>Condição</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Categoria</TableHead>
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
              <TableCell>
                <Badge
                  variant={
                    item.tipo_transacao === "Receita"
                      ? "defaultGreen"
                      : "defaultRed"
                  }
                >
                  {item.tipo_transacao}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-1">
                  {item.condicao === "Parcelado" && (
                    <CalendarClockIcon size={12} />
                  )}
                  {item.condicao === "Recorrente" && <RefreshCw size={12} />}
                  {item.condicao === "Vista" && <Check size={12} />}

                  <span className="capitalize"> {item.condicao}</span>
                </span>
              </TableCell>
              <TableCell>{item.forma_pagamento}</TableCell>

              <TableCell className="font-bold text-blue-600">
                {item.responsavel}
              </TableCell>

              <TableCell>
                <Numbers number={item.valor} />
              </TableCell>

              <TableCell>{item.categoria}</TableCell>

              <TableCell className="flex text-center">
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
