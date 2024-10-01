import {
  getSumAccountExpensePaid,
  getSumAccountIncomePaid,
} from "@/app/actions/accounts";
import { getSumBillsExpensePaid } from "@/app/actions/bills";
import { UseDates } from "@/hooks/use-dates";
import { createClient } from "@/utils/supabase/server";
import CardBanner from "./card-banner";
import GetUserName from "./data-name";
import Numbers from "./numbers";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default async function Banner() {
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  const sumAccountIncome = await getSumAccountIncomePaid(defaultPeriodo);
  const sumAccountExpense = await getSumAccountExpensePaid(defaultPeriodo);
  const sumBillsExpense = await getSumBillsExpensePaid(defaultPeriodo);

  const saldo = sumAccountIncome - sumAccountExpense - sumBillsExpense;

  const { currentDate, fliendlyDate, getGreeting } = UseDates();

  return (
    <CardBanner>
      <div className="flex flex-col">
        <span className="text-sm">{fliendlyDate(currentDate)}</span>

        <span className="text-xl">
          {getGreeting()}, <GetUserName />
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
