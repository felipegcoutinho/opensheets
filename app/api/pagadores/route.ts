import { getActivePayers } from "@/app/actions/pagadores/fetch_pagadores";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getActivePayers();
    const payload = (data || [])
      .filter((p) => !!p?.nome)
      .map((p) => ({
        id: p.id as string,
        nome: p.nome as string,
        role: p.role as string | null,
        foto: p.foto as string | null,
      }));
    return NextResponse.json({ data: payload });
  } catch (error) {
    console.error("Erro ao buscar pagadores:", error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
