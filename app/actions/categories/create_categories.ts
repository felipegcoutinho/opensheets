"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCategories(prevState: unknown, formData: FormData) {
  const supabase = createClient();

  const { nome, tipo_categoria, usado_para_calculos } = Object.fromEntries(
    formData.entries(),
  );

  const { error } = await supabase
    .from("categorias")
    .insert({ nome, tipo_categoria, usado_para_calculos });

  revalidatePath("/categorias");

  if (error) {
    console.error("Erro ao adicionar categoria:", error);
    return { message: "Erro ao adicionar categoria!" };
  }

  return { message: "Categoria adicionada com sucesso!" };

  revalidatePath("/categorias");
}
