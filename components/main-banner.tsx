import { getSumAccountExpensePaid, getSumAccountIncomePaid } from "@/app/actions/accounts";
import { getSumBillsExpensePaid } from "@/app/actions/bills";
import { UseDates } from "@/hooks/UseDates";
import { createClient } from "@/utils/supabase/server";
import CardBanner from "./card-banner";
import DataName from "./data-name";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default async function Banner() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  const first_name = data.user.user_metadata.first_name;
  const last_name = data.user.user_metadata.last_name;
  const displayName = `${first_name} ${last_name}`;

  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const sumAccountExpense = await getSumAccountExpensePaid(defaultPeriodo);
  const sumAccountIncome = await getSumAccountIncomePaid(defaultPeriodo);
  const sumBillsIncome = await getSumBillsExpensePaid(defaultPeriodo);

  const saldo = sumAccountIncome - sumAccountExpense - sumBillsIncome;

  const { currentDate, fliendlyDate, getGreeting } = UseDates();

  return (
    <CardBanner>
      <div className="flex flex-col">
        <span className="text-sm">{fliendlyDate(currentDate)}</span>

        <span className="text-xl">
          {getGreeting()}, <DataName />
        </span>

        <span>{data?.user.email}</span>
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-right">
              Saldo Atual
              <p className="text-2xl font-bold"> {Number(saldo).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Saldo das contas somadas</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </CardBanner>
  );
}
