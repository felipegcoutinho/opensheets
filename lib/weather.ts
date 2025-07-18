import { cache } from "react";

interface LocationWeather {
  city: string;
  temperature: number;
}

export const getLocationWeather = cache(async (ip: string | null): Promise<LocationWeather | null> => {
  try {
    const locationUrl = ip ? `https://ipapi.co/${ip}/json/` : "https://ipapi.co/json/";
    const locationRes = await fetch(locationUrl, { next: { revalidate: 86400 } });
    if (!locationRes.ok) return null;
    const locationData = await locationRes.json();
    const { city, latitude, longitude } = locationData;
    if (!city || latitude === undefined || longitude === undefined) return null;
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
