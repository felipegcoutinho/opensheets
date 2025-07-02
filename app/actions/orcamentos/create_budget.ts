"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

function parseMoney(value: FormDataEntryValue | null) {
  if (!value) return 0;
  const str = String(value)
    .replace(/R\$\s?/, "")
    .replace(/\./g, "")
    .replace(/,/, ".");
  return parseFloat(str) || 0;
}

export async function createBudget(prev: unknown, formData: FormData) {
  const supabase = createClient();

  const { valor_orcado, periodo, categoria_id } = Object.fromEntries(
    formData.entries(),
  );

  const valor = parseMoney(valor_orcado);

  const { data: existing, error: checkError } = await supabase
    .from("orcamentos")
    .select("id")
    .eq("categoria_id", categoria_id)
    .eq("periodo", periodo)
    .maybeSingle();

  if (checkError) {
    console.error("Erro ao verificar orçamento:", checkError);
    return { message: "Erro ao verificar orçamento" };
  }

  if (existing) {
    return {
      message: "Já existe orçamento para esta categoria e período",
    };
  }

  const { error } = await supabase.from("orcamentos").insert({
    valor_orcado: valor,
    periodo,
    categoria_id,
  });

  revalidatePath("/orcamentos");

  if (error) {
    console.error("Erro ao adicionar orçamento:", error);
    return { message: "Erro ao adicionar orçamento" };
  }
}
