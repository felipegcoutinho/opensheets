"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ActionResponse,
  CategoryFormData,
  categorySchema,
} from "../../(dashboard)/categoria/modal/form-schema";

export async function updateCategory(
  _prev: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: CategoryFormData = {
    id: String(formData.get("id")),
    nome: String(formData.get("nome")),
    tipo_categoria: String(formData.get("tipo_categoria")),
    icone: String(formData.get("icone")),
  };

  const validated = categorySchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  // Regra de proteção: impedir edição da categoria especial "pagamentos" de "despesa"
  try {
    const { data: current, error: fetchErr } = await supabase
      .from("categorias")
      .select("id, nome, tipo_categoria")
      .eq("id", validated.data.id)
      .single();

    if (!fetchErr && current) {
      const nomeAtual = String(current.nome || "").trim().toLowerCase();
      const tipoAtual = String(current.tipo_categoria || "").trim().toLowerCase();
      if (nomeAtual === "pagamentos" && tipoAtual === "despesa") {
        return {
          success: false,
          message: "A categoria 'pagamentos' de despesa não pode ser editada.",
        };
      }
    }
  } catch (e) {
    // Se falhar a verificação, mantém o fluxo normal; erros reais serão tratados no update
  }
  const { error } = await supabase
    .from("categorias")
    .update(validated.data)
    .eq("id", validated.data.id);

  revalidatePath("/categorias");

  if (error) {
    console.error("Erro ao atualizar categoria:", error);
    return { success: false, message: "Erro ao atualizar Categoria" };
  }

  return { success: true, message: "Categoria atualizada com sucesso!" };
}
