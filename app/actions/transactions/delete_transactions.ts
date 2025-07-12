"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteTransaction(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();
  await supabase.from("transacoes").delete().eq("id", excluir);

  revalidatePath("/dashboard");
}

export async function removeImage(transactionId: number, imageUrl: string) {
  const supabase = createClient();

  // Extrair o caminho correto do arquivo
  const filePath = decodeURIComponent(
    imageUrl.split("/comprovantes/")[1].split("?")[0],
  );

  // 1. Excluir a imagem do storage
  const { error: deleteError } = await supabase.storage
    .from("comprovantes") // Nome do bucket
    .remove([filePath]);

  if (deleteError) {
    console.error("Erro ao excluir imagem do storage:", deleteError);
    throw new Error("Erro ao excluir imagem do armazenamento");
  }

  // 2. Limpar o campo imagem_url na tabela transacoes
  const { error: updateError } = await supabase
    .from("transacoes")
    .update({ imagem_url: null }) // Define como null
    .eq("id", transactionId); // Filtra pela transação

  if (updateError) {
    console.error("Erro ao limpar o campo imagem_url na tabela:", updateError);
    throw new Error("Erro ao limpar o campo imagem_url");
  }

  console.log("Imagem removida com sucesso!");
}
