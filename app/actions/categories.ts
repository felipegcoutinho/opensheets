"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCategories(formData: FormData) {
  const { nome, tipo_categoria, icone } = Object.fromEntries(
    formData.entries(),
  );

  const supabase = createClient();
  await supabase.from("categorias").insert({ nome, tipo_categoria, icone });
  revalidatePath("/ajustes");
}

export async function deleteCategoria(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();
  await supabase.from("categorias").delete().eq("id", excluir);
  revalidatePath("/ajustes");
}

export async function updateCategoria(formData: FormData) {
  const { id, nome, tipo_categoria, icone } = Object.fromEntries(
    formData.entries(),
  );

  const supabase = createClient();
  await supabase
    .from("categorias")
    .update({ id, nome, tipo_categoria, icone })
    .eq("id", id);
  revalidatePath("/ajustes");
}
