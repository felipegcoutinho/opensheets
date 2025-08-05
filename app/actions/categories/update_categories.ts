"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ActionResponse,
  CategoryFormData,
  categorySchema,
} from "../../(dashboard)/categoria/modal/form-schema";

export async function updateCategory(
  _prev: ActionResponse | null,
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
