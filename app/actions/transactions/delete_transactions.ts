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

export async function bulkDeleteTransactions(
  _prev: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const idsValue = formData.get("ids");
  if (typeof idsValue !== "string" || idsValue.trim() === "") {
    return {
      success: false,
      message: "Nenhum lançamento selecionado para remoção.",
    };
  }

  const ids = idsValue
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!ids.length) {
    return {
      success: false,
      message: "Nenhum lançamento selecionado para remoção.",
    };
  }

  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("lancamentos")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("Erro ao remover lançamentos em massa:", error);
      return {
        success: false,
        message: "Erro ao remover lançamentos selecionados.",
      };
    }

    revalidatePath("/lancamentos");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Lançamentos removidos com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao remover lançamentos em massa:", error);
    return {
      success: false,
      message: "Erro ao remover lançamentos selecionados.",
    };
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
