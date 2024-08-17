import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseDates } from "@/hooks/UseDates";
import { getExpense, getExpenseBill, getIncome, getInvoiceList, getLastPrevious } from "../actions/dashboards";
import { BIllsList } from "./bills-list";
import { ConditionList } from "./condition-list";
import CountList from "./count-list";
import { InvoiceList } from "./invoices-list";
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

  return (
    <>
      <h2 className="p-4 text-2xl font-bold tracking-tight first:mt-0">Overview</h2>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Receitas</CardDescription>
            <CardTitle className="text-4xl">{Number(receitas).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              anterior {Number(receitasAnterior).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Despesas</CardDescription>
            <CardTitle className="text-4xl">{Number(despesasTotal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              anterior {Number(despesasTotalAnterior).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Balanço</CardDescription>
            <CardTitle className="text-4xl">{Number(balanco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              anterior {Number(balancoAnterior).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Previsto</CardDescription>
            <CardTitle className="text-4xl">{Number(previsto).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              anterior {Number(saldoAnterior).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-2 gap-2 mb-10">
        <InvoiceList month={month} />
        <BIllsList month={month} />

        <div className="flex flex-col gap-2">
          <ConditionList month={month} />
          <PaymentList month={month} />
        </div>

        <CountList month={month} />
      </div>
    </>
  );
}
