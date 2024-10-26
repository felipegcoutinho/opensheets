import {
  getSumAccountExpensePaid,
  getSumAccountIncomePaid,
} from "@/app/actions/accounts";
import { getSumBillsExpensePaid } from "@/app/actions/bills";
import { UseDates } from "@/hooks/use-dates";
import CardBanner from "./card-banner";
import GetUserName from "./data-name";
import Numbers from "./numbers";

export default async function Banner() {
  const {
    currentMonthName,
    currentYear,
    currentDate,
    fliendlyDate,
    getGreeting,
  } = UseDates();

  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const sumAccountIncome = await getSumAccountIncomePaid(defaultPeriodo);
  const sumAccountExpense = await getSumAccountExpensePaid(defaultPeriodo);
  const sumBillsExpense = await getSumBillsExpensePaid(defaultPeriodo);
  const saldo = sumAccountIncome - sumAccountExpense - sumBillsExpense;

  return (
    <CardBanner>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-xs text-neutral-100 dark:text-neutral-300">
              {fliendlyDate(currentDate)}
            </p>
            <p className="text-precious-pearls text-xl font-bold">
              {getGreeting()}, <GetUserName />
            </p>
          </div>
        </div>
        <div className="text-precious-pearls flex space-x-2">
          <div className="text-right">
            Saldo Atual
            <p className="text-2xl font-bold">
              <Numbers number={saldo} />
            </p>
          </div>
        </div>
      </div>
    </CardBanner>
  );
}
