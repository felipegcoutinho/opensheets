import { getUserName } from "@/app/actions/users/fetch_users";
import { money_values } from "@/app/fonts/font";
import { UseDates } from "@/hooks/use-dates";
import Banner from "./banner-card";

export default async function BannerData() {
  const { currentDate, friendlyDate } = UseDates();

  const userName = await getUserName();
  const shortUserName = userName?.split(" ")[0];

  return (
    <Banner className="from-primary/[0.06] bg-gradient-to-r via-purple-50 to-sky-400/[0.06] py-12">
      <div className="flex flex-col">
        <span className={`${money_values.className} text-xl font-bold`}>
          Olá, {shortUserName}! 👋
        </span>
        <span className="text-muted-foreground">
          {friendlyDate(currentDate)}
        </span>
      </div>
    </Banner>
  );
}
