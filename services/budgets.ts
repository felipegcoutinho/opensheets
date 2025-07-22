import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export interface BudgetFormData {
  id?: string;
  valor_orcado: string;
  periodo: string;
  categoria_id: string;
}

export interface ActionResponse<T = BudgetFormData> {
  success: boolean;
  message: string;
  errors?: { [K in keyof T]?: string[] };
}

const moneyRegex = /^\d+(,\d{1,2})?$/;

export const budgetSchema = z.object({
  id: z.string().optional(),
  valor_orcado: z.string().regex(moneyRegex, "Valor inválido"),
  periodo: z.string().min(1, "Período é obrigatório"),
  categoria_id: z.string().min(1, "Categoria é obrigatória"),
});

function parseMoney(value: string): number {
  return parseFloat(value.replace(/\./g, "").replace(/,/, ".")) || 0;
}

export async function addBudget(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: BudgetFormData = {
    valor_orcado: String(formData.get("valor_orcado")),
    periodo: String(formData.get("periodo")),
    categoria_id: String(formData.get("categoria_id")),
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
  const valor = parseMoney(validated.data.valor_orcado);

  const { error } = await supabase.from("orcamentos").insert({
    valor_orcado: valor,
    periodo: validated.data.periodo,
    categoria_id: validated.data.categoria_id,
  });

  revalidatePath("/orcamentos");

  if (error) {
    console.error("Erro ao adicionar orçamento:", error);
    return { success: false, message: "Erro ao adicionar Orçamento" };
  }

  return { success: true, message: "Orçamento criado com sucesso!" };
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
    return { success: false, message: "Erro ao atualizar Orçamento" };
  }

  return { success: true, message: "Orçamento atualizado com sucesso!" };
}

export async function deleteBudget(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const excluir = formData.get("excluir");
  const supabase = createClient();

  try {
    await supabase.from("orcamentos").delete().eq("id", excluir);
    revalidatePath("/orcamentos");
    return { success: true, message: "Orçamento removido!" };
  } catch (error) {
    console.error("Erro ao deletar orçamento:", error);
    return { success: false, message: "Erro ao remover Orçamento" };
  }
}
