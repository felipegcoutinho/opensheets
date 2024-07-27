import { getCardsDetails, getTransactionInvoice } from "@/app/actions/cards_actions";
import { addFaturas, deleteFaturas, getFaturas } from "@/app/actions/invoices_actions";
import DatePicker from "@/app/components/date-picker";
import Header from "@/app/components/header";
import { UseDates } from "@/app/hooks/UseDates";
import DetailsTransactions from "@/app/transacoes/details-transactions";
import { Button, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";

export default async function page({ params, searchParams }) {
  const { currentMonthName, currentYear } = UseDates();

  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const month = searchParams?.periodo ?? defaultPeriodo;

  const getCardsMap = await getCardsDetails(params.id);

  const getTransactionInvoiceMap = await getTransactionInvoice(month, params.id);

  const fatura_status = await getFaturas(month, params.id);

  return (
    <>
      <Header month={month} />

      <DatePicker />

      <div className="flex justify-start w-full">
        {getCardsMap?.map((item) => (
          <div className={`bg-${item.cor_padrao}-200 flex gap-8 `} key={item.id}>
            <div className={`bg-${item.cor_padrao}-200`}>
              <p className="font-bold">{item.descricao}</p>
              <p>{item.status}</p>
              <p>Data de Vencimento: {item.dt_vencimento}</p>
              <p>Data de fechamento: {item.dt_fechamento}</p>
              <p>Bandeira: {item.bandeira}</p>
              <p>{item.status_pagamento}</p>
            </div>
            <div className={`bg-${item.cor_padrao}-200 p-6`}>
              <p>Anotação: {item.anotacao}</p>
              <p>Limite: {item.limite}</p>
              <p>Tipo: {item.tipo}</p>
              <p>Conta: {item.contas.descricao}</p>
            </div>
          </div>
        ))}
      </div>

      {fatura_status && fatura_status.length > 0 ? (
        fatura_status.map(
          (item) =>
            item.status_pagamento === "Pago" && (
              <>
                <div className="bg-green-400 p-4 rounded-lg" key={item.id}>
                  <p>{item.status_pagamento}</p>
                </div>

                <form action={deleteFaturas}>
                  <input type="hidden" name="excluir" value={item.id} />

                  <select hidden name="status_pagamento" defaultValue={"Pendente"} placeholder="pagar">
                    <option value="Pendente">Pendente</option>
                  </select>

                  <input type="hidden" name="periodo" defaultValue={month} />
                  <input type="hidden" name="id_cartao" defaultValue={params.id} />

                  <Button type="submit" color="orange" className="mt-6">
                    Atualizar status para Pendente
                  </Button>
                </form>
              </>
            )
        )
      ) : (
        <>
          <div className="bg-orange-600 text-white p-4 rounded-lg">
            <p>Pendente</p>
          </div>

          <form action={addFaturas}>
            <select hidden name="status_pagamento" defaultValue={"Pago"} placeholder="pagar">
              <option value="Pago">Pagar</option>
            </select>

            <input type="hidden" name="periodo" defaultValue={month} />
            <input type="hidden" name="id_cartao" defaultValue={params.id} />

            <Button type="submit" color="green" className="mt-6">
              Pagar
            </Button>
          </form>
        </>
      )}

      <Table className="mt-6 w-full">
        <TableHead>
          <TableRow className="border-b text-xs">
            <TableHeaderCell>Data</TableHeaderCell>
            <TableHeaderCell>Descrição</TableHeaderCell>
            <TableHeaderCell>Transação</TableHeaderCell>
            <TableHeaderCell>Condição</TableHeaderCell>
            <TableHeaderCell>Pagamento</TableHeaderCell>
            <TableHeaderCell>Categoria</TableHeaderCell>
            <TableHeaderCell>Responsável</TableHeaderCell>
            <TableHeaderCell>Valor</TableHeaderCell>
            <TableHeaderCell>Conta/Cartão</TableHeaderCell>
            <TableHeaderCell className="text-center">Ações</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="mt-20">
          {getTransactionInvoiceMap?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.data_compra}</TableCell>
              <TableCell>
                {item.descricao}
                <span className="text-neutral-400 text-xs px-1">
                  {item.condicao === "Parcelado" && `${item.parcela_atual} de ${item.qtde_parcela}`}
                </span>
              </TableCell>
              <TableCell>{item.tipo_transacao}</TableCell>
              <TableCell>{item.condicao}</TableCell>
              <TableCell>{item.forma_pagamento}</TableCell>
              <TableCell>{item.categoria}</TableCell>
              <TableCell>{item.responsavel}</TableCell>
              <TableCell>{item.valor}</TableCell>
              <TableCell className="p-1 text-center">
                <DetailsTransactions />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
