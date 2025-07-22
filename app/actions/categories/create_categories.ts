"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ActionResponse,
  CategoryFormData,
  categorySchema,
} from "../../(dashboard)/categorias/modal/form-schema";

export async function createCategory(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: CategoryFormData = {
    nome: String(formData.get("nome")),
    tipo_categoria: String(formData.get("tipo_categoria")),
    usado_para_calculos: String(formData.get("usado_para_calculos") || ""),
  };

  const validated = categorySchema.omit({ id: true }).safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  const { error } = await supabase.from("categorias").insert(validated.data);

  revalidatePath("/categorias");

  if (error) {
    console.error("Erro ao adicionar categoria:", error);
    return { success: false, message: "Erro ao adicionar categoria!" };
  }

  return { success: true, message: "Categoria adicionada com sucesso!" };
}
