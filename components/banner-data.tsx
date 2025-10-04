import { getUserName } from "@/app/actions/users/fetch_users";
import { UseDates } from "@/hooks/use-dates";
import Banner from "./banner-card";
import { HyperText } from "./hyper-text";

export default async function BannerData() {
  const { currentDate, friendlyDate } = UseDates();

  const userName = await getUserName();
  const shortUserName = userName?.split(" ")[0];

  return (
    <Banner className="bg-banner-background text-banner-foreground py-12">
      <div className="relative z-10 flex flex-col">
        <span className="text-2xl">Olá, {shortUserName}! 👋</span>
        <HyperText className="text-sm">{friendlyDate(currentDate)}</HyperText>
      </div>
    </Banner>
  );
}
