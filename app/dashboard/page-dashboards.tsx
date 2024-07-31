import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseDates } from "@/hooks/UseDates";
import Link from "next/link";
import { getExpense, getExpenseBill, getIncome, getIncomeInitialBalance, getInvoiceList } from "../actions/dashboards";
import InvoicePayment from "../cartao/invoice-payment";

async function PageDashboards({ month }) {
  const { getPreviousMonth, getPreviousTwoMonth } = UseDates();
  const previousMonth = getPreviousMonth(month);
  const previousTwoMonth = getPreviousTwoMonth(month);

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
  const saldoAnterior = await getIncomeInitialBalance(month);
  const balancoAnterior = receitasAnterior - despesasTotalAnterior;

  // Calcular previsões
  const previsto = saldoAnterior + receitas - despesasTotal;

  const invoices = await getInvoiceList(month);

  return (
    <>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Receitas</CardDescription>
            <CardTitle className="text-4xl">{receitas}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">{receitasAnterior}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Despesas</CardDescription>
            <CardTitle className="text-4xl">{despesasTotal}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">{despesasTotalAnterior}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Balanço</CardDescription>
            <CardTitle className="text-4xl">{balanco}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">{balancoAnterior}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Previsto</CardDescription>
            <CardTitle className="text-4xl">{previsto}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">{saldoAnterior}</div>
          </CardContent>
        </Card>
      </div>
      <div>
        {invoices.map((item) => (
          <Card className="flex gap-2 mt-2" key={item.cartao_id}>
            <Link href={`/cartao/${item.cartao_id}/${item.descricao.toLowerCase()}`}>{item.descricao}</Link>
            <div>{item.total_valor}</div>
            <div>{item.status_pagamento}</div>
            <div>{item.dt_vencimento}</div>
            <InvoicePayment month={month} paramsId={item.cartao_id} />
          </Card>
        ))}
      </div>
    </>
  );
}

export default PageDashboards;
