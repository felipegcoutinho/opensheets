import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export interface CategoryFormData {
  id?: string;
  nome: string;
  tipo_categoria: string;
  usado_para_calculos?: string | boolean;
}

export interface ActionResponse<T = CategoryFormData> {
  success: boolean;
  message: string;
  errors?: { [K in keyof T]?: string[] };
}

export const categorySchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo_categoria: z.string().min(1, "Tipo é obrigatório"),
  usado_para_calculos: z.union([z.string(), z.boolean()]).optional(),
});

export async function addCategory(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: CategoryFormData = {
    nome: String(formData.get("nome")),
    tipo_categoria: String(formData.get("tipo_categoria")),
    usado_para_calculos: formData.get("usado_para_calculos") || "false",
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
  const { error } = await supabase.from("categorias").insert({
    nome: validated.data.nome,
    tipo_categoria: validated.data.tipo_categoria,
    usado_para_calculos: validated.data.usado_para_calculos === "true" || validated.data.usado_para_calculos === true,
  });

  revalidatePath("/categorias");

  if (error) {
    console.error("Erro ao adicionar categoria:", error);
    return { success: false, message: "Erro ao adicionar Categoria" };
  }

  return { success: true, message: "Categoria adicionada com sucesso!" };
}

export async function updateCategory(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: CategoryFormData = {
    id: String(formData.get("id")),
    nome: String(formData.get("nome")),
    tipo_categoria: String(formData.get("tipo_categoria")),
    usado_para_calculos: formData.get("usado_para_calculos") || "false",
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
    .update({
      nome: validated.data.nome,
      tipo_categoria: validated.data.tipo_categoria,
      usado_para_calculos: validated.data.usado_para_calculos === "true" || validated.data.usado_para_calculos === true,
    })
    .eq("id", validated.data.id);

  revalidatePath("/categorias");

  if (error) {
    console.error("Erro ao atualizar categoria:", error);
    return { success: false, message: "Erro ao atualizar Categoria" };
  }

  return { success: true, message: "Categoria atualizada com sucesso!" };
}

export async function deleteCategory(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const excluir = formData.get("excluir");
  const supabase = createClient();

  try {
    await supabase.from("categorias").delete().eq("id", excluir);
    revalidatePath("/categorias");
    return { success: true, message: "Categoria removida!" };
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return { success: false, message: "Erro ao remover Categoria" };
  }
}
