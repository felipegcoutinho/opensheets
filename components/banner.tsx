import { getSumAccountExpensePaid, getSumAccountIncomePaid } from "@/app/actions/accounts";
import { getSumBillsExpensePaid } from "@/app/actions/bills";
import { UseDates } from "@/hooks/use-dates";
import { createClient } from "@/utils/supabase/server";
import CardBanner from "./card-banner";
import DataName from "./data-name";
import Numbers from "./numbers";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default async function Banner() {
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  const sumAccountExpense = await getSumAccountExpensePaid(defaultPeriodo);
  const sumAccountIncome = await getSumAccountIncomePaid(defaultPeriodo);
  const sumBillsIncome = await getSumBillsExpensePaid(defaultPeriodo);

  const saldo = sumAccountIncome - sumAccountExpense - sumBillsIncome;

  const { currentDate, fliendlyDate, getGreeting } = UseDates();

  return (
    <CardBanner>
      <div className="flex flex-col text-white">
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
              <p className="text-2xl font-bold">
                <Numbers number={saldo} />
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent>Saldo das contas</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </CardBanner>
  );
}
