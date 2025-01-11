import Utils from "@/app/dashboard/utils";
import { UseDates } from "@/hooks/use-dates";
import Banner from "./banner-card";
import Numbers from "./numbers";

export default async function BannerData() {
  const {
    currentDate,
    fliendlyDate,
    getGreeting,
    currentMonthName,
    currentYear,
  } = UseDates();

  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const { saldo, userName } = await Utils(defaultPeriodo);

  return (
    <Banner>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base">{fliendlyDate(currentDate)}</p>
          <p className="text-xl font-bold">
            {getGreeting()}, {userName}
          </p>
        </div>

        <div className="text-right">
          <p>Saldo Atual</p>
          <p className="text-2xl">
            <Numbers value={saldo} />
          </p>
        </div>
      </div>
    </Banner>
  );
}
