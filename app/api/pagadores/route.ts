import { getPagadores } from "@/app/actions/pagadores/fetch_pagadores";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getPagadores();
  return NextResponse.json({ data });
}
