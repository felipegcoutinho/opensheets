"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCategories(prevState: unknown, formData: FormData) {
  const supabase = createClient();

  const { nome, tipo_categoria } = Object.fromEntries(formData.entries());

  const { error } = await supabase
    .from("categorias")
    .insert({ nome, tipo_categoria });

  revalidatePath("/categorias");

  if (error) {
    console.error("Erro ao adicionar categoria:", error);
    return { message: "Erro ao adicionar categoria!" };
  }

  return { message: "Categoria adicionada com sucesso!" };

  revalidatePath("/categorias");
}

// export async function deleteCategories(prevState: unknown, formData: FormData) {
//   const supabase = createClient();

//   const excluir = formData.get("excluir");

//   const { error } = await supabase
//     .from("categorias")
//     .delete()
//     .eq("id", excluir);

//   if (error) {
//     console.error("Erro ao excluir categoria:", error);
//     return { message: "Erro ao excluir categoria!" };
//   }

//   return { message: "Categoria excluída com sucesso!" };

//   revalidatePath("/categorias");
// }

export async function deleteCategories(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("categorias").delete().eq("id", id);

  if (error) {
    console.error("Erro ao excluir categoria:", error);
    return { message: "Erro ao excluir categoria!" };
  }

  return { message: "Categoria excluída com sucesso!" };

  redirect("/categorias");
}

export async function updateCategories(prevState: unknown, formData: FormData) {
  const supabase = createClient();

  const { id, nome, tipo_categoria } = Object.fromEntries(formData.entries());

  const { error } = await supabase
    .from("categorias")
    .update({ id, nome, tipo_categoria })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar categoria:", error);
    return { message: "Erro ao atualizar categoria!" };
  }

  return { message: "Categoria atualizada com sucesso!" };

  revalidatePath("/categorias");
}
