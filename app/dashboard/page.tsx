import Numbers from "@/components/Numbers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseDates } from "@/hooks/UseDates";
import { Suspense } from "react";
import CardComponent from "../../components/card-component";
import {
  getBillsByResponsavel,
  getExpense,
  getExpenseBill,
  getExpenseByCategory,
  getIncome,
  getIncomeByCategory,
  getInvoiceList,
  getLastPrevious,
} from "../actions/dashboards";
import { BIllsList } from "./bills-list";
import Category from "./category";
import { ConditionList } from "./condition-list";
import CountList from "./count-list";
import Invoice from "./invoice-list";
import { PaymentList } from "./payment-list";

export default async function page({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const { getPreviousMonth } = UseDates();
  const previousMonth = getPreviousMonth(month);

  // Obter dados do mês atual
  const receitas = await getIncome(month);
  const despesas = await getExpense(month); // Despesas cartão de crédito
  const despesasBoletos = await getExpenseBill(month); // Despesas boletos
  const despesasTotal = despesas + despesasBoletos; // Despesas totais

  // Obter dados do mês anterior
  const receitasAnterior = await getIncome(previousMonth);
  const despesasAnterior = await getExpense(previousMonth);
  const despesasBoletosAnterior = await getExpenseBill(previousMonth);
  const despesasTotalAnterior = despesasAnterior + despesasBoletosAnterior;

  // Calcular balanços
  const balanco = receitas - despesasTotal;
  const saldoAnterior = await getLastPrevious(month);
  const balancoAnterior = receitasAnterior - despesasTotalAnterior;

  // Calcular previsões
  const previsto = saldoAnterior + receitas - despesasTotal;
  const invoices = await getInvoiceList(month);

  // Obter dados por categoria
  const expenseByCategory = await getExpenseByCategory(month);
  const incomeByCategory = await getIncomeByCategory(month);

  const invoiceCard = await getInvoiceList(month);
  const invoiceBill = await getBillsByResponsavel(month);

  return (
    <Suspense fallback={<span>Carregando...</span>}>
      <h2 className="p-2 text-2xl font-bold">Visão Geral</h2>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Receitas</CardDescription>
            <CardTitle className="text-2xl">
              <Numbers number={receitas} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              anterior <Numbers number={receitasAnterior} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Despesas</CardDescription>
            <CardTitle className="text-2xl">
              <Numbers number={despesasTotal} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              anterior <Numbers number={despesasTotalAnterior} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Balanço</CardDescription>
            <CardTitle className="text-2xl">
              <Numbers number={balanco} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              anterior <Numbers number={balancoAnterior} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Previsto</CardDescription>
            <CardTitle className="text-2xl">
              <Numbers number={previsto} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              anterior <Numbers number={saldoAnterior} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-2 mb-10">
        <CardComponent title="Faturas" subtitle="Total de faturas">
          <Invoice month={month} data={invoiceCard} />
        </CardComponent>

        <CardComponent title="Boletos" subtitle="Total de boletos">
          <BIllsList month={month} data={invoiceBill} />
        </CardComponent>

        <div className="flex flex-col gap-2">
          <ConditionList month={month} />
          <PaymentList month={month} />
        </div>

        <Category data={incomeByCategory} title="Receitas por Categorias" />
        <Category data={expenseByCategory} title="Despesas por Categorias" />
        <CountList month={month} />
      </div>
    </Suspense>
  );
}
