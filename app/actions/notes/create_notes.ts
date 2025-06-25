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
