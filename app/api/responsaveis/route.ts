import { getResponsaveisList } from "@/app/actions/transactions/fetch_transactions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") || "";
  const data = await getResponsaveisList(month);
  return NextResponse.json({ data });
}
