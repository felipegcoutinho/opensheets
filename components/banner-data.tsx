import { getUserName } from "@/app/actions/users/fetch_users";
import { UseDates } from "@/hooks/use-dates";
import Banner from "./banner-card";

export default async function BannerData() {
  const { currentDate, friendlyDate } = UseDates();

  const userName = await getUserName();

  return (
    <Banner className="bg-contrast-foreground/10">
      <div className="flex items-center justify-between py-6">
        <div>
          <p className="text-xl font-bold">Olá, {userName.split(" ")[0]}! 👋</p>
          <p className="text-muted-foreground">
            <span>{friendlyDate(currentDate)}.</span>
          </p>
        </div>
      </div>
    </Banner>
  );
}
