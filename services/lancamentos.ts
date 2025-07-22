import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { parseFormData, DadosFormulario } from "@/app/actions/transactions/parseFormData";
import { gerarTransacoes } from "@/app/actions/transactions/gerarTransacoes";
import { uploadImagem } from "@/app/actions/transactions/uploadImagem";

export interface TransactionFormData {
  id?: string;
  data_compra?: string;
  data_vencimento?: string;
  descricao?: string;
  tipo_transacao: string;
  periodo: string;
  realizado?: string;
  condicao: string;
  forma_pagamento: string;
  anotacao?: string;
  responsavel: string;
  valor: string;
  qtde_parcela?: string;
  parcela_atual?: string;
  qtde_recorrencia?: string;
  cartao_id?: string;
  categoria_id: string;
  conta_id?: string;
  segundo_responsavel?: string;
  dividir_lancamento?: string;
  imagem_url?: string;
}

export interface ActionResponse<T = TransactionFormData> {
  success: boolean;
  message: string;
  errors?: { [K in keyof T]?: string[] };
}

export const transactionSchema = z.object({
  id: z.string().optional(),
  data_compra: z.string().optional(),
  data_vencimento: z.string().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  tipo_transacao: z.string().min(1, "Tipo é obrigatório"),
  periodo: z.string().min(1, "Período é obrigatório"),
  realizado: z.string().optional(),
  condicao: z.string().min(1, "Condição é obrigatória"),
  forma_pagamento: z.string().min(1, "Forma de pagamento é obrigatória"),
  anotacao: z.string().optional(),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  valor: z.string().min(1, "Valor é obrigatório"),
  qtde_parcela: z.string().optional(),
  parcela_atual: z.string().optional(),
  qtde_recorrencia: z.string().optional(),
  cartao_id: z.string().optional(),
  categoria_id: z.string().min(1, "Categoria é obrigatória"),
  conta_id: z.string().optional(),
  segundo_responsavel: z.string().optional(),
  dividir_lancamento: z.string().optional(),
  imagem_url: z.string().optional(),
});

function parseMoney(value: string): number {
  return parseFloat(value.replace(/\./g, "").replace(/,/, ".")) || 0;
}

export async function addTransaction(formData: FormData): Promise<ActionResponse> {
  const supabase = createClient();

  // Validate and parse base data
  const entries = Object.fromEntries(formData.entries());
  const validated = transactionSchema.omit({ id: true }).safeParse(entries);
  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  // Use existing helpers to generate records
  const dados: DadosFormulario = await parseFormData(formData);
  const imagem_url = await uploadImagem(formData.get("imagem_url"), supabase);
  const transacoes = gerarTransacoes(dados, imagem_url);

  if (transacoes.length === 0) {
    return { success: false, message: "Nenhuma transação gerada." };
  }

  const { error } = await supabase.from("transacoes").insert(transacoes);
  revalidatePath("/lancamentos");
  revalidatePath("/dashboard");

  if (error) {
    console.error("Erro ao adicionar transação:", error);
    return { success: false, message: "Erro ao adicionar Lançamento" };
  }

  return { success: true, message: "Lançamento adicionado com sucesso!" };
}

export async function updateTransaction(formData: FormData): Promise<ActionResponse> {
  const supabase = createClient();
  const entries = Object.fromEntries(formData.entries());
  const validated = transactionSchema.safeParse(entries);
  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  let imageUrl = validated.data.imagem_url as string | undefined;
  const imageFile = formData.get("imagem_url");
  if (imageFile && imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await uploadImagem(imageFile, supabase);
  }

  const valor = parseMoney(validated.data.valor);

  const { error } = await supabase
    .from("transacoes")
    .update({
      data_compra: validated.data.data_compra || null,
      data_vencimento: validated.data.data_vencimento || null,
      descricao: validated.data.descricao,
      tipo_transacao: validated.data.tipo_transacao,
      periodo: validated.data.periodo,
      imagem_url: imageUrl,
      realizado: validated.data.realizado === "true",
      condicao: validated.data.condicao,
      forma_pagamento: validated.data.forma_pagamento,
      anotacao: validated.data.anotacao,
      responsavel: validated.data.responsavel,
      valor,
      qtde_parcela: validated.data.qtde_parcela,
      parcela_atual: validated.data.parcela_atual,
      qtde_recorrencia: validated.data.qtde_recorrencia,
      cartao_id: validated.data.cartao_id,
      categoria_id: validated.data.categoria_id,
      conta_id: validated.data.conta_id,
      dividir_lancamento: validated.data.dividir_lancamento === "true",
    })
    .eq("id", validated.data.id);

  revalidatePath("/lancamentos");
  revalidatePath("/dashboard");

  if (error) {
    console.error("Erro ao atualizar transação:", error);
    return { success: false, message: "Erro ao atualizar Lançamento" };
  }

  return { success: true, message: "Lançamento atualizado com sucesso!" };
}

export async function deleteTransaction(formData: FormData): Promise<ActionResponse> {
  const excluir = formData.get("excluir");
  const supabase = createClient();
  try {
    await supabase.from("transacoes").delete().eq("id", excluir);
    revalidatePath("/lancamentos");
    revalidatePath("/dashboard");
    return { success: true, message: "Lançamento removido!" };
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    return { success: false, message: "Erro ao remover Lançamento" };
  }
}

export async function removeImage(
  transactionId: number,
  imageUrl: string,
): Promise<ActionResponse> {
  const supabase = createClient();

  const filePath = decodeURIComponent(imageUrl.split("/comprovantes/")[1].split("?")[0]);

  const { error: deleteError } = await supabase.storage
    .from("comprovantes")
    .remove([filePath]);

  if (deleteError) {
    console.error("Erro ao excluir imagem do storage:", deleteError);
    return { success: false, message: "Erro ao excluir imagem" };
  }

  const { error: updateError } = await supabase
    .from("transacoes")
    .update({ imagem_url: null })
    .eq("id", transactionId);

  if (updateError) {
    console.error("Erro ao limpar campo imagem_url:", updateError);
    return { success: false, message: "Erro ao atualizar transação" };
  }

  return { success: true, message: "Imagem removida com sucesso!" };
}
