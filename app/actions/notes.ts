"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getNotes(month) {
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("anotacoes")
    .select(`id, descricao, periodo, anotacao`)
    .eq("periodo", month)
    .order("descricao", { ascending: true });
  return notes;
}

export async function addNotes(formData: FormData) {
  const { descricao, periodo, anotacao } = Object.fromEntries(
    formData.entries(),
  );

  const supabase = await createClient();
  await supabase.from("anotacoes").insert({ descricao, periodo, anotacao });
  revalidatePath("/anotacoes");
}

export async function deleteNotes(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = await createClient();
  await supabase.from("anotacoes").delete().eq("id", excluir);
  revalidatePath("/anotacoes");
}

export async function updateNotes(formData: FormData) {
  const { id, descricao, periodo, anotacao } = Object.fromEntries(
    formData.entries(),
  );

  const supabase = await createClient();
  await supabase
    .from("anotacoes")
    .update({ id, descricao, periodo, anotacao })
    .eq("id", id);
  revalidatePath("/anotacoes");
}
