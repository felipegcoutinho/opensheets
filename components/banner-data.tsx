import Utils from "@/app/(dashboard)/dashboard/utils";
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

  const { saldo, userName } = await Utils(`${currentMonthName}-${currentYear}`);

  return (
    <Banner>
      <div className="flex items-center justify-between py-6">
        <div>
          <p className="text-xl">Olá, {userName.split(" ")[0]}! 👋</p>
          <p className="text-muted-foreground">
            <span>{fliendlyDate(currentDate)}.</span>
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
