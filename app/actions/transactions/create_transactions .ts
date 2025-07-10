"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { parseFormData } from "./parseFormData";
import { gerarTransacoes } from "./gerarTransacoes";
import { uploadImagem } from "./uploadImagem";

export async function addTransaction(formData: FormData) {
  const supabase = createClient();

  // 1. Parse dos dados do formulário
  const dados = await parseFormData(formData);

  // 2. Upload da imagem (se houver)
  const imagem_url = await uploadImagem(formData.get("imagem_url"), supabase);

  // 3. Geração das transações conforme condição (vista, parcelado ou recorrente)
  const transacoes = gerarTransacoes(dados, imagem_url);

  // 4. Inserção no banco de dados
  if (transacoes.length > 0) {
    const { error } = await supabase.from("transacoes").insert(transacoes);
    if (error) {
      console.error("Erro ao adicionar transações:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/transacoes");
    return { success: true };
  } else {
    console.warn("Nenhuma transação foi gerada para ser inserida.");
    return { success: false, error: "Nenhuma transação gerada." };
  }
}
