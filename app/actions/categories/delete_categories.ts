"use server";

import { createClient } from "@/utils/supabase/server";

export async function deleteCategories(id: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("categorias").delete().eq("id", id);

  if (error) {
    console.error("Erro ao excluir categoria:", error);
    return { message: "Erro ao excluir categoria!" };
  }

  return { message: "Categoria excluída com sucesso!" };

  redirect("/categorias");
}
