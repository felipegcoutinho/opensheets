"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addNotes(prevState: unknown, formData: FormData) {
  const supabase = createClient();

  const { descricao, periodo, anotacao } = Object.fromEntries(
    formData.entries(),
  );

  const { error } = await supabase
    .from("anotacoes")
    .insert({ descricao, periodo, anotacao });

  if (error) {
    console.error("Erro ao adicionar anotação:", error);
    return { message: "Erro ao adicionar anotação!" };
  }

  revalidatePath("/anotacao");
}

export async function updateNotes(prevState: unknown, formData: FormData) {
  const supabase = createClient();

  const { id, descricao, periodo, anotacao } = Object.fromEntries(
    formData.entries(),
  );

  const { error } = await supabase
    .from("anotacoes")
    .update({ id, descricao, periodo, anotacao })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar anotação:", error);
    return { message: "Erro ao atualizar anotação!" };
  }

  revalidatePath("/anotacao");
}

export async function deleteNotes(prevState: unknown, formData: FormData) {
  const supabase = createClient();

  const excluir = formData.get("excluir");
  const { error } = await supabase.from("anotacoes").delete().eq("id", excluir);

  if (error) {
    console.error("Erro ao excluir anotação:", error);
    return { message: "Erro ao excluir anotação!" };
  }

  if (error) throw error;

  return { message: "Anotação excluída com sucesso!" };

  revalidatePath("/anotacao");
}
