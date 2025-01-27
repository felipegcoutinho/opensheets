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

  const userNameSplit = userName.split(" ")[0];

  return (
    <Banner>
      <div className="flex items-center justify-between">
        <div className="py-6">
          <p className="text-color-6 text-2xl font-bold">
            Olá, {userNameSplit}! 👋
          </p>
          <p className="text-muted-foreground">
            Hoje é{" "}
            <span className="lowercase">{fliendlyDate(currentDate)}.</span>
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
