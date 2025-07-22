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

export async function updateBudget(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: BudgetFormData = {
    id: String(formData.get("id")),
    valor_orcado: String(formData.get("valor_orcado")),
    periodo: String(formData.get("periodo")),
    categoria_id: String(formData.get("categoria_id")),
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
  const valor = parseMoney(validated.data.valor_orcado);

  const { error } = await supabase
    .from("orcamentos")
    .update({
      valor_orcado: valor,
      periodo: validated.data.periodo,
      categoria_id: validated.data.categoria_id,
    })
    .eq("id", validated.data.id);

  revalidatePath("/orcamentos");

  if (error) {
    console.error("Erro ao atualizar orçamento:", error);
    return { success: false, message: "Erro ao atualizar orçamento" };
  }

  return { success: true, message: "Orçamento atualizado com sucesso!" };
}
