import UtilitiesDashboard from "@/app/(dashboard)/dashboard/utilities-dashboard";
import { getUserName } from "@/app/actions/users/fetch_users";
import MoneyValues from "@/components/money-values";
import { UseDates } from "@/hooks/use-dates";
import Banner from "./banner-card";

export default async function BannerData() {
  const { currentDate, friendlyDate, formatted_current_month } = UseDates();

  const { saldo } = await UtilitiesDashboard(formatted_current_month);

  const userName = await getUserName();

  return (
    <Banner>
      <div className="flex items-center justify-between py-6">
        <div>
          <p className="text-xl font-bold">Olá, {userName.split(" ")[0]}! 👋</p>
          <p className="text-muted-foreground">
            <span>{friendlyDate(currentDate)}.</span>
          </p>
        </div>
        <div className="text-right">
          <p>Saldo Geral Atual</p>
          <p className="text-2xl">
            <MoneyValues value={saldo} />
          </p>
        </div>
      </div>
    </Banner>
  );
}
