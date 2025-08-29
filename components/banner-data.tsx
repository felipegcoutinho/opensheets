import { getUserName } from "@/app/actions/users/fetch_users";
import { money_values } from "@/app/fonts/font";
import { UseDates } from "@/hooks/use-dates";
import Banner from "./banner-card";
import { AnimatedShinyText } from "./magicui/animated-shiny-text";
import { HyperText } from "./magicui/hyper-text";

export default async function BannerData() {
  const { currentDate, friendlyDate } = UseDates();

  const userName = await getUserName();
  const shortUserName = userName?.split(" ")[0];

  return (
    <Banner className="bg-accent py-12">
      <div className="flex flex-col">
        <span className={`${money_values.className} text-xl font-bold`}>
          Olá, {shortUserName}! 👋
        </span>
        <HyperText className="text-muted-foreground text-sm capitalize">
          {friendlyDate(currentDate)}
        </HyperText>
      </div>
    </Banner>
  );
}
