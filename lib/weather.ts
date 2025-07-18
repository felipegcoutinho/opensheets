import { cache } from "react";

interface LocationWeather {
  city: string;
  temperature: number;
}

export const getLocationWeather = cache(async (
  headersList: Headers,
): Promise<LocationWeather | null> => {
  try {
    const cityHeader = headersList.get("x-vercel-ip-city");
    const latHeader = headersList.get("x-vercel-ip-latitude");
    const lonHeader = headersList.get("x-vercel-ip-longitude");

    let city = cityHeader ? decodeURIComponent(cityHeader) : undefined;
    let latitude = latHeader ? parseFloat(latHeader) : undefined;
    let longitude = lonHeader ? parseFloat(lonHeader) : undefined;

    if (latitude === undefined || longitude === undefined || !city) {
      const ip =
        headersList.get("x-forwarded-for")?.split(",")[0] ||
        headersList.get("x-real-ip") ||
        headersList.get("cf-connecting-ip") ||
        headersList.get("x-vercel-forwarded-for") ||
        null;

      const locationUrl = ip
        ? `https://ipapi.co/${ip}/json/`
        : "https://ipapi.co/json/";
      const locationRes = await fetch(locationUrl, {
        next: { revalidate: 86400 },
      });
      if (!locationRes.ok) return null;
      const locationData = await locationRes.json();
      city = decodeURIComponent(locationData.city);
      latitude = locationData.latitude;
      longitude = locationData.longitude;
    }

    if (!city || latitude === undefined || longitude === undefined)
      return null;

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius`,
      { next: { revalidate: 1800 } },
    );
    if (!weatherRes.ok) return null;
    const weatherData = await weatherRes.json();
    const temperature = weatherData?.current_weather?.temperature;
    if (temperature === undefined || temperature === null) return null;
    return { city, temperature: Math.round(temperature) };
  } catch {
    return null;
  }
});
