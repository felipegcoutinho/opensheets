import { NextResponse } from "next/server";
import { getDescriptionsList } from "@/app/services/transacoes";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") || "";
  const data = await getDescriptionsList(month);
  return NextResponse.json({ data });
}
