"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateCategories(prevState: unknown, formData: FormData) {
  const supabase = createClient();

  const { id, nome, tipo_categoria, usado_para_calculos } = Object.fromEntries(
    formData.entries(),
  );

  const { error } = await supabase
    .from("categorias")
    .update({ id, nome, tipo_categoria, usado_para_calculos })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar categoria:", error);
    return { message: "Erro ao atualizar categoria!" };
  }

  return { message: "Categoria atualizada com sucesso!" };

  revalidatePath("/categorias");
}
