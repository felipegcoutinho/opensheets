import { geolocation } from "@vercel/functions";
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const { city } = geolocation(request);
  return new Response(`<h1>Your location is ${city}</h1>`, {
    headers: { "content-type": "text/html" },
  });
}
