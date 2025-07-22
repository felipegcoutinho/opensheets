"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ActionResponse,
  BudgetFormData,
  budgetSchema,
} from "../../(dashboard)/orcamentos/modal/form-schema";

function parseMoney(value: FormDataEntryValue | null) {
  if (!value) return 0;
  const str = String(value)
    .replace(/R\$\s?/, "")
    .replace(/\./g, "")
    .replace(/,/, ".");
  return parseFloat(str) || 0;
}

export async function createBudget(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: BudgetFormData = {
    categoria_id: String(formData.get("categoria_id")),
    periodo: String(formData.get("periodo")),
    valor_orcado: String(formData.get("valor_orcado")),
  };

  const validated = budgetSchema.omit({ id: true }).safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();

  const { valor_orcado, periodo, categoria_id } = validated.data;

  const valor = parseMoney(valor_orcado);

  const { data: existing, error: checkError } = await supabase
    .from("orcamentos")
    .select("id")
    .eq("categoria_id", categoria_id)
    .eq("periodo", periodo)
    .maybeSingle();

  if (checkError) {
    console.error("Erro ao verificar orçamento:", checkError);
    return { success: false, message: "Erro ao verificar orçamento" };
  }

  if (existing) {
    return {
      success: false,
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
    return { success: false, message: "Erro ao adicionar orçamento" };
  }

  return { success: true, message: "Orçamento criado com sucesso!" };
}
