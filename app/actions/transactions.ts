"use server";

import { createClient } from "@/utils/supabase/server";
import { addMonths, format, parse } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { revalidatePath } from "next/cache";

export async function addTransaction(formData: FormData) {
  const supabase = createClient();
  const transacoes = [];

  const formEntries = Object.fromEntries(formData.entries());

  const {
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
  } = formEntries;

  const valorNumerico = parseFloat(valor);
  const parcelas = parseInt(qtde_parcela || "1", 10);
  const recorrencias = parseInt(qtde_recorrencia || "1", 10);
  const [mesInicial, anoInicial] = periodo.split("-");
  const dataInicial = parse(
    `01-${mesInicial}-${anoInicial}`,
    "dd-MMMM-yyyy",
    new Date(),
    { locale: ptBR },
  );

  const imageUrl = await uploadImagem(formData.get("imagem_url"), supabase);

  function adicionar(
    valorUnitario,
    responsavel,
    periodoAtual,
    parcelaAtual = null,
  ) {
    transacoes.push({
      data_compra,
      data_vencimento,
      descricao,
      tipo_transacao,
      periodo: periodoAtual,
      imagem_url: imageUrl,
      realizado,
      condicao,
      forma_pagamento,
      anotacao,
      responsavel,
      valor: valorUnitario,
      qtde_parcela,
      parcela_atual: parcelaAtual,
      qtde_recorrencia,
      cartao_id,
      categoria_id,
      conta_id,
      dividir_lancamento,
    });
  }

  function gerarPeriodo(offset: number): string {
    const data = addMonths(dataInicial, offset);
    return `${format(data, "MMMM", { locale: ptBR })}-${data.getFullYear()}`;
  }

  function dividirValor(
    valor: number,
    parcela: number | null,
    periodo: string,
  ) {
    const v = parseFloat(valor.toFixed(2));
    if (dividir_lancamento === "on") {
      adicionar(v / 2, responsavel, periodo, parcela);
      adicionar(v / 2, segundo_responsavel, periodo, parcela);
    } else {
      adicionar(v, responsavel, periodo, parcela);
    }
  }

  if (condicao === "vista") {
    dividirValor(valorNumerico, null, periodo);
  }

  if (condicao === "parcelado") {
    const valorParcela = parseFloat((valorNumerico / parcelas).toFixed(2));
    const valorUltima = parseFloat(
      (valorNumerico - valorParcela * (parcelas - 1)).toFixed(2),
    );

    for (let i = 0; i < parcelas; i++) {
      const parcelaAtual = i + 1;
      const periodoAtual = gerarPeriodo(i);
      const valorAtual = i === parcelas - 1 ? valorUltima : valorParcela;
      dividirValor(valorAtual, parcelaAtual, periodoAtual);
    }
  }

  if (condicao === "recorrente") {
    for (let i = 0; i < recorrencias; i++) {
      const periodoAtual = gerarPeriodo(i);
      dividirValor(valorNumerico, null, periodoAtual);
    }
  }

  const { error } = await supabase.from("transacoes").insert(transacoes);

  if (error) {
    console.error("Erro ao adicionar transações:", error);
    throw error;
  }

  revalidatePath("/dashboard");
}

// Função auxiliar para upload da imagem
async function uploadImagem(
  imageFile: FormDataEntryValue | null,
  supabase: any,
): Promise<string | null> {
  if (!(imageFile instanceof File) || !imageFile.name) return null;

  const fileName = `${Date.now()}_${imageFile.name}`;
  const { error: uploadError } = await supabase.storage
    .from("comprovantes")
    .upload(fileName, imageFile, { upsert: true });

  if (uploadError) {
    console.error("Erro ao fazer upload:", uploadError);
    return null;
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("comprovantes")
    .createSignedUrl(fileName, 31536000);

  if (signedUrlError) {
    console.error("Erro ao gerar Signed URL:", signedUrlError);
    return null;
  }

  return signedUrlData?.signedUrl || null;
}

export async function deleteTransaction(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();
  await supabase.from("transacoes").delete().eq("id", excluir);
  revalidatePath("/dashboard");
}

export async function updateTransaction(formData: FormData) {
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

export async function removeImage(transactionId, imageUrl) {
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

  // 2. Limpar o campo `imagem_url` na tabela `transacoes`
  const { error: updateError } = await supabase
    .from("transacoes")
    .update({ imagem_url: null }) // Define como `null`
    .eq("id", transactionId); // Filtra pela transação

  if (updateError) {
    console.error("Erro ao limpar o campo imagem_url na tabela:", updateError);
    throw new Error("Erro ao limpar o campo imagem_url");
  }

  console.log("Imagem removida com sucesso!");
}

export async function togglePagamento(id, realizadoAtual) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .update({ realizado: !realizadoAtual })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar status de pagamento:", error.message);
    return { error };
  }

  return { data };
}
