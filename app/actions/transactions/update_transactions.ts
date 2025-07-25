"use server";
import { createClient } from "@/utils/supabase/server";
import { ActionResponse } from "../../(dashboard)/lancamento/modal/form-schema";

export async function updateTransaction(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const supabase = createClient();
  const {
    id,
    data_compra,
    data_vencimento,
    descricao,
    tipo_transacao,
    periodo,
    realizado,
    condicao,
    forma_pagamento,
    anotacao,
    responsavel,
    valor,
    qtde_parcela,
    parcela_atual,
    qtde_recorrencia,
    cartao_id,
    categoria_id,
    conta_id,
    segundo_responsavel,
    dividir_lancamento,
    imagem_url_atual, // URL da imagem existente
  } = Object.fromEntries(formData.entries());

  let imageUrl = imagem_url_atual; // Use o URL existente como padrão
  const imageFile = formData.get("imagem_url"); // Novo arquivo enviado

  // Verificar se há um novo arquivo de imagem
  if (imageFile && imageFile instanceof File && imageFile.size > 0) {
    const fileName = `${Date.now()}_${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("comprovantes")
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error("Erro ao fazer upload da imagem:", uploadError);
      throw new Error("Erro ao fazer upload da imagem");
    } else {
      // Gerar URL assinada para a nova imagem
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("comprovantes")
          .createSignedUrl(fileName, 31536000);

      if (signedUrlError) {
        console.error("Erro ao gerar Signed URL:", signedUrlError);
        throw new Error("Erro ao gerar URL assinada");
      }

      imageUrl = signedUrlData.signedUrl;
    }
  }

  // Atualizar a transação no banco de dados
  try {
    await supabase
      .from("transacoes")
      .update({
        data_compra,
        data_vencimento,
        descricao,
        tipo_transacao,
        periodo,
        imagem_url: imageUrl,
        realizado,
        condicao,
        forma_pagamento,
        anotacao,
        responsavel,
        valor,
        qtde_parcela,
        parcela_atual,
        qtde_recorrencia,
        cartao_id,
        categoria_id,
        conta_id,
        segundo_responsavel,
        dividir_lancamento,
      })
      .eq("id", id);

    console.log("Transação atualizada com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar a transação:", error);
    throw error;
  }
}

export async function togglePagamento(id: number, realizadoAtual: boolean) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transacoes")
    .update({ realizado: !realizadoAtual })
    .eq("id", id);
  if (error) {
    console.error("Erro ao atualizar status de pagamento:", error);
    return { error };
  }
  return { data };
}

export async function payBills(id: number, realizadoAtual: boolean) {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("transacoes")
    .update({ realizado: !realizadoAtual })
    .eq("id", id);
  if (error) {
    console.error("Erro ao pagar boletos:", error);
    return null;
  }
  return data;
}
