import Utils from "@/app/(dashboard)/dashboard/utils";
import { getUserName } from "@/app/actions/users";
import MoneyValues from "@/components/money-values";
import { UseDates } from "@/hooks/use-dates";
import Banner from "./banner-card";

export default async function BannerData() {
  const { currentDate, fliendlyDate, currentMonthName, currentYear } =
    UseDates();

  const { saldo } = await Utils(`${currentMonthName}-${currentYear}`);

  const userName = await getUserName();

  return (
    <Banner>
      <div className="flex items-center justify-between py-6">
        <div>
          <p className="text-2xl font-bold">
            Olá, {userName.split(" ")[0]}! 👋
          </p>
          <p className="text-muted-foreground">
            <span>{fliendlyDate(currentDate)}.</span>
          </p>
        </div>
        <div className="text-right">
          <p>Saldo Atual</p>
          <p className="text-2xl">
            <MoneyValues value={saldo} />
          </p>
        </div>
      </div>
    </Banner>
  );
}
