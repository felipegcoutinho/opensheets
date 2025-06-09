import { NextResponse } from "next/server";
import { getResponsaveisList } from "@/app/services/transacoes";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") || "";
  const data = await getResponsaveisList(month);
  return NextResponse.json({ data });
}
