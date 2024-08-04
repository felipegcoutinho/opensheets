import { getSumAccountExpensePaid, getSumAccountIncomePaid } from "@/app/actions/accounts";
import { UseDates } from "@/hooks/UseDates";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import CardBanner from "./card-banner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default async function Banner() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();

  const displayName = "Felipe Coutinho";
  if (error) {
    return null;
  }

  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const accountExpense = await getSumAccountExpensePaid(defaultPeriodo);
  const sumAccountIncome = await getSumAccountIncomePaid(defaultPeriodo);

  return (
    <CardBanner>
      <div>
        <p>Olá, {displayName}</p>
        <p>{data?.user.id}</p>
        <p>{data?.user.email}</p>
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <p>
              Saldo atual ({defaultPeriodo}): R$ {sumAccountIncome - accountExpense}
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p>Saldo das contas somadas</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </CardBanner>
  );
}
