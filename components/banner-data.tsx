import { getUserName } from "@/app/actions/users/fetch_users";
import { UseDates } from "@/hooks/use-dates";
import Banner from "./banner-card";
import { HyperText } from "./hyper-text";

const basePatterns = [" .-'", " _.-'", " `-._", " `-._", " .-'", " _.-'"];

const asciiBackdrop = Array.from({ length: 48 }, (_, row) => {
  const motif = basePatterns[row % basePatterns.length];
  return motif.repeat(48).slice(0, 192);
}).join("\n");

export default async function BannerData() {
  const { currentDate, friendlyDate } = UseDates();

  const userName = await getUserName();
  const shortUserName = userName?.split(" ")[0];

  return (
    <Banner className="bg-banner-background text-banner-foreground relative overflow-hidden py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden"
      >
        <pre className="text-banner-foreground/20 h-full w-full leading-4 whitespace-pre">
          {asciiBackdrop}
        </pre>
      </div>
      <div className="relative flex flex-col">
        <span className="text-2xl">Olá, {shortUserName}! 👋</span>
        <HyperText className="text-sm">{friendlyDate(currentDate)}</HyperText>
      </div>
    </Banner>
  );
}
