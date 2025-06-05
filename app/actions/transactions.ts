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
    qtde_recorrencia,
    cartao_id,
    categoria_id,
    conta_id,
    segundo_responsavel,
    dividir_lancamento,
  } = formEntries as { [k: string]: string | undefined };

  const valorNumerico = parseFloat(valor || "0");
  const parcelas = parseInt(qtde_parcela || "1", 10);
  const recorrencias = parseInt(qtde_recorrencia || "1", 10);

  const [mesNomeInicial, anoInicialString] = (periodo || "").split("-");
  let dataInicial: Date;
  if (mesNomeInicial && anoInicialString) {
    try {
      dataInicial = parse(
        `01-${mesNomeInicial}-${anoInicialString}`,
        "dd-MMMM-yyyy",
        new Date(),
        { locale: ptBR },
      );
      if (isNaN(dataInicial.getTime())) {
        throw new Error("Data inicial inválida após o parse do período.");
      }
    } catch (e) {
      console.error("Erro ao fazer parse do período inicial:", periodo, e);
      throw new Error(
        `Período inicial inválido: ${periodo}. Formato esperado: MMMM-yyyy (ex: maio-2025)`,
      );
    }
  } else {
    console.error(
      "Período inicial não fornecido ou em formato incorreto:",
      periodo,
    );
    throw new Error(
      "Período inicial é obrigatório e deve estar no formato MMMM-yyyy.",
    );
  }

  let diaVencimentoOriginal: number | null = null;
  if (data_vencimento && typeof data_vencimento === "string") {
    const dataVencOriginalUTC = new Date(data_vencimento + "T00:00:00Z");
    if (!isNaN(dataVencOriginalUTC.getTime())) {
      diaVencimentoOriginal = dataVencOriginalUTC.getUTCDate();
    } else {
      console.warn(`Data de vencimento original inválida: ${data_vencimento}`);
    }
  }

  const imageUrl = await uploadImagem(formData.get("imagem_url"), supabase);

  function adicionar(
    valorUnitario: number,
    respAtual: string | undefined,
    periodoAtual: string,
    dataCompraAtual: string | null,
    dataVencimentoAtual: string | null,
    parcelaAtualNum: number | null = null,
  ) {
    transacoes.push({
      data_compra: dataCompraAtual,
      data_vencimento: dataVencimentoAtual,
      descricao,
      tipo_transacao,
      periodo: periodoAtual,
      imagem_url: imageUrl,
      realizado: realizado === "on" || realizado === "true",
      condicao,
      forma_pagamento,
      anotacao,
      responsavel: respAtual,
      valor: valorUnitario,
      qtde_parcela: parcelas > 1 ? parcelas : null,
      parcela_atual: parcelaAtualNum,
      qtde_recorrencia:
        recorrencias > 1 && condicao === "recorrente" ? recorrencias : null,
      cartao_id: cartao_id || null,
      categoria_id: categoria_id || null,
      conta_id: conta_id || null,
      dividir_lancamento: dividir_lancamento === "on",
    });
  }

  function gerarDatasParaIteracao(offsetMeses: number): {
    periodo: string;
    dataVencimento: string | null;
  } {
    const dataBaseCalculo = addMonths(dataInicial, offsetMeses);
    const mesCalculado = dataBaseCalculo.getMonth(); // 0-11
    const anoCalculado = dataBaseCalculo.getFullYear();

    let dataVencimentoCalculada: string | null = null;
    if (diaVencimentoOriginal !== null) {
      let novaDataVencimento = new Date(
        Date.UTC(anoCalculado, mesCalculado, diaVencimentoOriginal),
      );
      if (novaDataVencimento.getUTCMonth() !== mesCalculado) {
        novaDataVencimento = new Date(
          Date.UTC(anoCalculado, mesCalculado + 1, 0),
        );
      }
      dataVencimentoCalculada = novaDataVencimento.toISOString().split("T")[0];
    } else if (
      offsetMeses === 0 &&
      data_vencimento &&
      typeof data_vencimento === "string"
    ) {
      dataVencimentoCalculada = data_vencimento;
    }

    return {
      periodo: format(dataBaseCalculo, "MMMM-yyyy", { locale: ptBR }),
      dataVencimento: dataVencimentoCalculada,
    };
  }

  function dividirEAdicionar(
    valorParaDividir: number,
    parcelaNum: number | null,
    periodoAtual: string,
    dataCompraOriginalParaTodasIteracoes: string | null,
    dataVencimentoAtual: string | null,
  ) {
    const valorAjustado = parseFloat(valorParaDividir.toFixed(2));
    if (dividir_lancamento === "on" && segundo_responsavel) {
      const valorDividido = parseFloat((valorAjustado / 2).toFixed(2));
      adicionar(
        valorDividido,
        responsavel,
        periodoAtual,
        dataCompraOriginalParaTodasIteracoes,
        dataVencimentoAtual,
        parcelaNum,
      );
      adicionar(
        valorAjustado - valorDividido,
        segundo_responsavel,
        periodoAtual,
        dataCompraOriginalParaTodasIteracoes,
        dataVencimentoAtual,
        parcelaNum,
      );
    } else {
      adicionar(
        valorAjustado,
        responsavel,
        periodoAtual,
        dataCompraOriginalParaTodasIteracoes,
        dataVencimentoAtual,
        parcelaNum,
      );
    }
  }

  const dataCompraOriginalInput = data_compra || null; // A data de compra do formulário

  if (condicao === "vista") {
    dividirEAdicionar(
      valorNumerico,
      null,
      periodo as string,
      dataCompraOriginalInput, // Passa a data de compra original
      data_vencimento || null,
    );
  } else if (condicao === "parcelado") {
    const valorParcelaBase = valorNumerico / parcelas;
    for (let i = 0; i < parcelas; i++) {
      const parcelaAtualNumero = i + 1;
      const {
        periodo: periodoDaParcela,
        // dataCompra: dataCompraDaParcela, // Não vamos usar esta
        dataVencimento: dataVencimentoDaParcela,
      } = gerarDatasParaIteracao(i);

      let valorDaParcelaAtual: number;
      if (i === parcelas - 1) {
        // Ajuste para a última parcela para evitar problemas de arredondamento
        const valorTotalPagoAnteriormente =
          parseFloat(valorParcelaBase.toFixed(2)) * (parcelas - 1);
        valorDaParcelaAtual = valorNumerico - valorTotalPagoAnteriormente;
      } else {
        valorDaParcelaAtual = valorParcelaBase;
      }

      dividirEAdicionar(
        valorDaParcelaAtual,
        parcelaAtualNumero,
        periodoDaParcela,
        dataCompraOriginalInput,
        dataVencimentoDaParcela,
      );
    }
  } else if (condicao === "recorrente") {
    for (let i = 0; i < recorrencias; i++) {
      const {
        periodo: periodoDaRecorrencia,
        // dataCompra: dataCompraDaRecorrencia, // Não vamos usar esta
        dataVencimento: dataVencimentoDaRecorrencia,
      } = gerarDatasParaIteracao(i);

      dividirEAdicionar(
        valorNumerico,
        null,
        periodoDaRecorrencia,
        dataCompraOriginalInput,
        dataVencimentoDaRecorrencia,
      );
    }
  }

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

export async function togglePagamento(id: number, realizadoAtual: boolean) {
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
