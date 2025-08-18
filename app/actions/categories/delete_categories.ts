"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "../../(dashboard)/categoria/modal/form-schema";

export async function deleteCategory(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const excluir = formData.get("excluir");
  const supabase = createClient();

  try {
    const { count: transCount, error: transError } = await supabase
      .from("lancamentos")
      .select("id", { count: "exact", head: true })
      .eq("categoria_id", excluir);

    if (transError) {
      console.error(
        "Erro ao verificar lançamentos vinculados à categoria:",
        transError,
      );
      return { success: false, message: "Erro ao remover Categoria" };
    }

    const { count: budgetCount, error: budgetError } = await supabase
      .from("orcamentos")
      .select("id", { count: "exact", head: true })
      .eq("categoria_id", excluir);

    if (budgetError) {
      console.error(
        "Erro ao verificar orçamentos vinculados à categoria:",
        budgetError,
      );
      return { success: false, message: "Erro ao remover Categoria" };
    }

    if ((transCount ?? 0) > 0 || (budgetCount ?? 0) > 0) {
      return {
        success: false,
        message: "Esta categoria já foi utilizada em lançamentos ou orçamentos",
      };
    }

    await supabase.from("categorias").delete().eq("id", excluir);
    revalidatePath("/categorias");
    return { success: true, message: "Categoria removida com sucesso!" };
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    return { success: false, message: "Erro ao remover Categoria" };
  }
}
