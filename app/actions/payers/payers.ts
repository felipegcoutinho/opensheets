"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addPayers(prevState: unknown, formData: FormData) {
  const supabase = createClient();

  const { nome, email, foto, status, anotacao } = Object.fromEntries(
    formData.entries(),
  );

  const { error } = await supabase
    .from("pagadores")
    .insert({ nome, email, foto, status, anotacao });

  if (error) {
    console.error("Erro ao adicionar pagador:", error);
    return { message: "Erro ao adicionar pagador!" };
  }

  revalidatePath("/pagador");
}

export async function updatePayers(prevState: unknown, formData: FormData) {
  const supabase = createClient();

  const { id, nome, email, foto, status, anotacao } = Object.fromEntries(
    formData.entries(),
  );

  const { error } = await supabase
    .from("pagadores")
    .update({ id, nome, email, foto, status, anotacao })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar pagador:", error);
    return { message: "Erro ao atualizar pagador!" };
  }

  revalidatePath("/pagador");
}

export async function deletePayers(prevState: unknown, formData: FormData) {
  const supabase = createClient();

  const excluir = formData.get("excluir");
  const { error } = await supabase.from("pagadores").delete().eq("id", excluir);

  if (error) {
    console.error("Erro ao excluir pagador:", error);
    return { message: "Erro ao excluir pagador!" };
  }

  if (error) throw error;

  return { message: "Pagador excluído com sucesso!" };

  revalidatePath("/pagador");
}
