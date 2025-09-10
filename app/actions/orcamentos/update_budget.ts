"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ActionResponse,
  BudgetFormData,
  budgetSchema,
} from "../../(dashboard)/orcamento/modal/form-schema";

function parseMoney(value: FormDataEntryValue | null) {
  if (!value) return 0;
  const str = String(value)
    .replace(/R\$\s?/, "")
    .replace(/\./g, "")
    .replace(/,/, ".");
  return parseFloat(str) || 0;
}

export async function updateBudget(
  _prev: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: BudgetFormData = {
    id: String(formData.get("id")),
    categoria_id: String(formData.get("categoria_id")),
    periodo: String(formData.get("periodo")),
    valor_orcado: String(formData.get("valor_orcado")),
  };

  const validated = budgetSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();

  const { id, valor_orcado, periodo, categoria_id } = validated.data;

  const valor = parseMoney(valor_orcado);

  const { error } = await supabase
    .from("orcamentos")
    .update({ valor_orcado: valor, periodo, categoria_id })
    .eq("id", id);

  revalidatePath("/orcamentos");

  if (error) {
    console.error("Erro ao atualizar orçamento:", error);
    return { success: false, message: "Erro ao atualizar orçamento" };
  }

  return { success: true, message: "Orçamento atualizado com sucesso!" };
}
