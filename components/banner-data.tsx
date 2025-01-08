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

  // Fazendo a chamada para a API de geolocalização
  const locationResponse = await fetch(
    "https://opensheets-beta.felipecoutinho.com/api/geo",
    {
      method: "GET",
    },
  );
  const locationText = await locationResponse.text();
  const location = locationText.replace(/<[^>]*>?/gm, ""); // Remove as tags HTML

  return (
    <Banner>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">{fliendlyDate(currentDate)}</p>
          <p className="text-xl font-bold">
            {getGreeting()}, {userName}
          </p>
          <p className="text-sm">{location}</p> {/* Mostra a localização */}
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
