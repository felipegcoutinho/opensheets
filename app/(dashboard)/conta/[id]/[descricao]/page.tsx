import DetailsTransactions from "@/app/(dashboard)/lancamentos/modal/details-transactions";
import { getAccountDetails } from "@/app/services/contas";
import {
  getAccountInvoice,
  getSumAccountExpense,
  getSumAccountIncome,
} from "@/app/services/transacoes";
import MoneyValues from "@/components/money-values";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UseDates } from "@/hooks/use-dates";
import UseStyles from "@/hooks/use-styles";
import { CalendarClockIcon, Check, RefreshCw } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

// Component para exibir as informações da conta
const AccountInfo = ({ item, sumAccountIncome, accountExpense, saldo }) => (
  <Card className="mt-4 flex w-full items-center gap-10 px-8 py-6">
    <Image
      quality={100}
      src={`/logos/${item.logo_image}`}
      className="rounded-full shadow-lg"
      width={60}
      height={60}
      alt={`Logo da conta ${item.descricao}`}
      priority
    />

    <div className="leading-relaxed">
      <p>Conta {item.tipo_conta}</p>
    </div>

    <AccountBalance
      income={sumAccountIncome}
      expense={accountExpense}
      balance={saldo}
    />
  </Card>
);

// Componente separado para exibir saldos
const AccountBalance = ({ income, expense, balance }) => (
  <div className="leading-relaxed">
    <BalanceItem label="Receitas" value={income} />
    <BalanceItem label="Despesas" value={expense} />
    <BalanceItem label="Saldo" value={balance} />
  </div>
);

const BalanceItem = ({ label, value }) => (
  <>
    <p className="text-muted-foreground text-xs">{label}</p>
    <p>
      <MoneyValues value={value} />
    </p>
  </>
);

// Componente da tabela de Lançamentos
const TransactionTable = ({
  transactions,
  dateFormatter,
  getResponsavelClass,
}) => {
  const getTransactionIcon = (condicao) => {
    const icons = {
      parcelado: <CalendarClockIcon size={12} />,
      recorrente: <RefreshCw size={12} />,
      vista: <Check size={12} />,
    };
    return icons[condicao] || null;
  };

  const { getButtonVariant } = UseStyles();

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Lançamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Transação</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Condição</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-muted-foreground">
                  {dateFormatter(item.data_compra)}
                </TableCell>

                <TableCell>
                  <span className="font-bold capitalize">{item.descricao}</span>
                  {item.condicao === "parcelado" && (
                    <span className="px-1 text-xs text-neutral-400">
                      {`${item.parcela_atual} de ${item.qtde_parcela}`}
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  <Button
                    size="sm"
                    variant={getButtonVariant(item.tipo_transacao)}
                  >
                    {item.tipo_transacao}
                  </Button>
                </TableCell>

                <TableCell>
                  <MoneyValues value={item.valor} />
                </TableCell>

                <TableCell>
                  <span className="flex items-center gap-1">
                    {getTransactionIcon(item.condicao)}
                    <span className="capitalize">{item.condicao}</span>
                  </span>
                </TableCell>

                <TableCell>{item.forma_pagamento}</TableCell>

                <TableCell>
                  <span className={` ${getResponsavelClass(item.responsavel)}`}>
                    {item.responsavel}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="lowercase">{item.categorias?.nome}</span>
                </TableCell>

                <TableCell>
                  <DetailsTransactions
                    itemId={item.id}
                    itemPeriodo={item.periodo}
                    itemNotas={item.anotacao}
                    itemDate={item.data_compra}
                    itemDescricao={item.descricao}
                    itemCategoriaId={item.categorias?.nome}
                    itemCondicao={item.condicao}
                    itemResponsavel={item.responsavel}
                    itemTipoTransacao={item.tipo_transacao}
                    itemValor={item.valor}
                    itemFormaPagamento={item.forma_pagamento}
                    itemQtdeParcelas={item.qtde_parcela}
                    itemRecorrencia={item.recorrencia}
                    itemQtdeRecorrencia={item.qtde_recorrencia}
                    itemConta={item.contas?.descricao}
                    itemPaid={item.realizado}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Função utilitária para classes de responsável
const useResponsavelClass = () => {
  return (responsavel) => {
    const classes = {
      você: "text-blue-600",
      sistema: "text-neutral-600",
      default: "text-orange-600",
    };
    return classes[responsavel] || classes.default;
  };
};

// Componente principal da página
export default async function AccountPage({ searchParams, params }) {
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const search = await searchParams;
  const { id } = await params;
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = search?.periodo ?? defaultPeriodo;

  // Fetch paralelo dos dados
  const [accountDetails, transactionInvoice, sumIncome, sumExpense] =
    await Promise.all([
      getAccountDetails(id),
      getAccountInvoice(month, id),
      getSumAccountIncome(month, id),
      getSumAccountExpense(month, id),
    ]);

  const saldo = sumIncome - sumExpense;
  const getResponsavelClass = useResponsavelClass();

  return (
    <>
      {accountDetails?.map((item) => (
        <AccountInfo
          key={item.id}
          item={item}
          sumAccountIncome={sumIncome}
          accountExpense={sumExpense}
          saldo={saldo}
        />
      ))}

      <Suspense fallback={<div>Carregando Lançamentos...</div>}>
        <TransactionTable
          transactions={transactionInvoice}
          dateFormatter={DateFormat}
          getResponsavelClass={getResponsavelClass}
        />
      </Suspense>
    </>
  );
}
