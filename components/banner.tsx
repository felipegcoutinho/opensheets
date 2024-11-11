import { UseDates } from "@/hooks/use-dates";
import {
  getSumAccountExpensePaid,
  getSumAccountIncomePaid,
} from "@actions/accounts";
import { getSumBillsExpensePaid } from "@actions/bills";
import CardBanner from "./card-banner";
import GetUserName from "./get-username";
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

  const [sumAccountIncome, sumAccountExpense, sumBillsExpense] =
    await Promise.all([
      getSumAccountIncomePaid(defaultPeriodo),
      getSumAccountExpensePaid(defaultPeriodo),
      getSumBillsExpensePaid(defaultPeriodo),
    ]);

  const saldo = sumAccountIncome - sumAccountExpense - sumBillsExpense;

  {
    /* <p className="inline-block bg-gradient-to-r from-alt_green to-alt_yellow bg-clip-text text-transparent">
            {currentMonthName} {currentYear}
          </p> */
  }

  return (
    <CardBanner>
      <div className="flex items-center space-x-4">
        <div>
          <p className="text-sm text-neutral-800 dark:text-neutral-300">
            {fliendlyDate(currentDate)}
          </p>

          <p className="text-xl font-bold">
            {getGreeting()}, <GetUserName />
          </p>
        </div>
      </div>
      <div className="flex space-x-2 text-black dark:text-white">
        <div className="text-right">
          Saldo Atual
          <div className="text-2xl font-bold">
            <Numbers number={saldo} />
          </div>
        </div>
      </div>
    </CardBanner>
  );
}
