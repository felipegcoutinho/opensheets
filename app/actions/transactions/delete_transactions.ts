"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "../../(dashboard)/lancamento/modal/form-schema";

export async function deleteTransaction(
  _prev: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const excluir = formData.get("excluir");
  const supabase = createClient();
  try {
    await supabase.from("lancamentos").delete().eq("id", excluir);
    revalidatePath("/lancamentos");
    revalidatePath("/dashboard");
    return { success: true, message: "Lançamento removido com sucesso!" };
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    return { success: false, message: "Erro ao remover Lançamento" };
  }
}

export async function removeImage(transactionId: number, imageUrl: string) {
  const supabase = createClient();
  const filePath = decodeURIComponent(
    imageUrl.split("/comprovantes/")[1].split("?")[0],
  );
  const { error: deleteError } = await supabase.storage
    .from("comprovantes")
    .remove([filePath]);
  if (deleteError) {
    console.error("Erro ao excluir imagem do storage:", deleteError);
    throw new Error("Erro ao excluir imagem do armazenamento");
  }
  const { error: updateError } = await supabase
    .from("lancamentos")
    .update({ imagem_url: null })
    .eq("id", transactionId);
  if (updateError) {
    console.error("Erro ao limpar o campo imagem_url na tabela:", updateError);
    throw new Error("Erro ao limpar o campo imagem_url");
  }
  console.log("Imagem removida com sucesso!");
}
