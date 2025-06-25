"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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
