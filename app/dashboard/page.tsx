import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseDates } from "@/hooks/UseDates";
import { getExpense, getExpenseBill, getIncome, getIncomeInitialBalance, getInvoiceList } from "../actions/dashboards";

async function PageDashboards({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

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
            <div className="text-xs text-muted-foreground">anterior R$ {receitasAnterior}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Despesas</CardDescription>
            <CardTitle className="text-4xl">{despesasTotal}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">anterior R$ {despesasTotalAnterior}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Balanço</CardDescription>
            <CardTitle className="text-4xl">{balanco}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">anterior R$ {balancoAnterior}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Previsto</CardDescription>
            <CardTitle className="text-4xl">{previsto}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">anterior R$ {saldoAnterior}</div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2  mb-10">
        {/* <InvoiceList month={month} /> */}
        <Card className="space-y-4 p-6">
          <div className="flex items-center gap-4 bg-slate-200 rounded-lg p-4" key="01">
            <Avatar className="h-9 w-9">
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-lg font-medium leading-none">Nubank</p>
              <Button variant="link">Pagar</Button>
              <p className="text-sm text-muted-foreground">Dia 10</p>
              {/* <InvoicePayment month={month} paramsId={item.cartao_id} /> */}
            </div>
            <div className="ml-auto font-bold text-2xl">R$ 111</div>
          </div>
          <div className="flex items-center gap-4 bg-slate-200 rounded-lg p-4" key="01">
            <Avatar className="h-9 w-9">
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-lg font-medium leading-none">Nubank</p>
              <Button variant="link">Pagar</Button>
              <p className="text-sm text-muted-foreground">Dia 10</p>
              {/* <InvoicePayment month={month} paramsId={item.cartao_id} /> */}
            </div>
            <div className="ml-auto font-bold text-2xl">R$ 111</div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default PageDashboards;
