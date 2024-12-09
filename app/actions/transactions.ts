"use server";
import { createClient } from "@/utils/supabase/server";
import { addMonths, format, parse } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { revalidatePath } from "next/cache";

export async function getTransaction(month) {
  const supabase = createClient();

  const { data: transacao, error } = await supabase
    .from("transacoes")
    .select(
      `id, data_compra, periodo, descricao, tipo_transacao, categoria , imagem_url, realizado, condicao, 
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual, recorrencia,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image)`,
    )
    .order("created_at", { ascending: false })
    .eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar transações:", error);
    return [];
  }

  return transacao;
}

export async function addTransaction(formData: FormData) {
  const {
    data_compra,
    descricao,
    tipo_transacao,
    periodo,
    categoria,
    imagem_url,
    realizado,
    condicao,
    forma_pagamento,
    anotacao,
    responsavel,
    valor,
    qtde_parcela,
    parcela_atual,
    recorrencia,
    qtde_recorrencia,
    cartao_id,
    conta_id,
    segundo_responsavel,
    dividir_lancamento,
  } = Object.fromEntries(formData.entries());

  const supabase = createClient();
  const transacoes = [];

  // Upload da imagem, se houver
  let imageUrl = null;
  const imageFile = formData.get("imagem_url"); // Campo de imagem no formulário

  // Upload da imagem, se houver
  if (imageFile && imageFile instanceof File && imageFile.name) {
    // Verifica se o arquivo tem um nome válido
    const fileName = `${Date.now()}_${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("comprovantes")
      .upload(`${fileName}`, imageFile, {
        upsert: true, // Sobrescreve arquivos com o mesmo nome, se necessário
      });

    if (uploadError) {
      console.error("Erro ao fazer upload da imagem:", uploadError);
    } else {
      // Gerar uma Signed URL para acesso temporário ao arquivo
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("comprovantes")
          .createSignedUrl(`${fileName}`, 31536000); // URL válida por 1 ano

      if (signedUrlError) {
        console.error("Erro ao gerar Signed URL:", signedUrlError);
      } else {
        imageUrl = signedUrlData.signedUrl;
      }
    }
  }

  function adicionarTransacao(valor, responsavel, periodo, parcela_atual) {
    transacoes.push({
      data_compra,
      descricao,
      tipo_transacao,
      periodo,
      categoria,
      imagem_url: imageUrl,
      realizado,
      condicao,
      forma_pagamento,
      anotacao,
      responsavel,
      valor,
      qtde_parcela,
      parcela_atual,
      recorrencia,
      qtde_recorrencia,
      cartao_id,
      conta_id,
      dividir_lancamento,
    });
  }

  if (condicao === "Vista") {
    if (dividir_lancamento === "on") {
      adicionarTransacao(valor / 2, responsavel, periodo, null);
      adicionarTransacao(valor / 2, segundo_responsavel, periodo, null);
    } else {
      adicionarTransacao(valor, responsavel, periodo, null);
    }
  } else if (condicao === "Parcelado") {
    const parcelas = parseInt(qtde_parcela, 10);
    const valorTotal = parseFloat(valor);
    const valorParcela = parseFloat((valorTotal / parcelas).toFixed(2));
    const valorUltimaParcela = parseFloat(
      (valorTotal - valorParcela * (parcelas - 1)).toFixed(2),
    );

    const [mesInicial, anoInicial] = periodo.split("-");
    const dataInicial = parse(
      `01-${mesInicial}-${anoInicial}`,
      "dd-MMMM-yyyy",
      new Date(),
      { locale: ptBR },
    );

    for (let i = 0; i < parcelas; i++) {
      const dataParcela = addMonths(dataInicial, i);
      const mesParcela = format(dataParcela, "MMMM", { locale: ptBR });
      const anoParcela = dataParcela.getFullYear();
      const periodoParcela = `${mesParcela}-${anoParcela}`;
      const parcelaAtual = i + 1;
      const valorAtual = i === parcelas - 1 ? valorUltimaParcela : valorParcela;

      if (dividir_lancamento === "on") {
        adicionarTransacao(
          valorAtual / 2,
          responsavel,
          periodoParcela,
          parcelaAtual,
        );
        adicionarTransacao(
          valorAtual / 2,
          segundo_responsavel,
          periodoParcela,
          parcelaAtual,
        );
      } else {
        adicionarTransacao(
          valorAtual,
          responsavel,
          periodoParcela,
          parcelaAtual,
        );
      }
    }
  } else if (condicao === "Recorrente") {
    const quantidadeRecorrencias = parseInt(qtde_recorrencia, 10);

    const [mesInicial, anoInicial] = periodo.split("-");
    const dataInicial = parse(
      `01-${mesInicial}-${anoInicial}`,
      "dd-MMMM-yyyy",
      new Date(),
      { locale: ptBR },
    );

    for (let i = 0; i < quantidadeRecorrencias; i++) {
      const dataRecorrente = addMonths(dataInicial, i);
      const mesRecorrente = format(dataRecorrente, "MMMM", { locale: ptBR });
      const anoRecorrente = dataRecorrente.getFullYear();
      const periodoRecorrente = `${mesRecorrente}-${anoRecorrente}`;

      if (dividir_lancamento === "on") {
        adicionarTransacao(valor / 2, responsavel, periodoRecorrente, null);
        adicionarTransacao(
          valor / 2,
          segundo_responsavel,
          periodoRecorrente,
          null,
        );
      } else {
        adicionarTransacao(valor, responsavel, periodoRecorrente, null);
      }
    }
  }

  try {
    await supabase.from("transacoes").insert(transacoes);
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error adding transaction:", error);
  }
}

export async function deleteTransaction(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();
  await supabase.from("transacoes").delete().eq("id", excluir);
  revalidatePath("/dashboard");
}

export async function updateTransaction(formData: FormData) {
  const {
    id,
    data_compra,
    descricao,
    tipo_transacao,
    periodo,
    categoria,
    realizado,
    condicao,
    forma_pagamento,
    anotacao,
    responsavel,
    valor,
    qtde_parcela,
    parcela_atual,
    recorrencia,
    qtde_recorrencia,
    cartao_id,
    conta_id,
  } = Object.fromEntries(formData.entries());

  const supabase = createClient();

  let imageUrl = formData.get("imagem_url"); // Pode ser um arquivo ou string existente
  const imageFile = formData.get("imagem_url"); // Novo arquivo no formulário

  // Atualizar a imagem, se houver novo upload
  if (imageFile instanceof File) {
    const fileName = `${Date.now()}_${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("comprovantes")
      .upload(`${fileName}`, imageFile, {
        upsert: true,
      });

    if (uploadError) {
      console.error("Erro ao fazer upload da imagem:", uploadError);
    } else {
      // Gerar uma Signed URL para o arquivo atualizado
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("comprovantes")
          .createSignedUrl(`${fileName}`, 31536000); // 1 ano

      if (signedUrlError) {
        console.error("Erro ao gerar Signed URL:", signedUrlError);
      } else {
        imageUrl = signedUrlData.signedUrl; // Atualizar URL da imagem
      }
    }
  }

  try {
    // Atualizar transação no banco de dados
    await supabase
      .from("transacoes")
      .update({
        data_compra,
        descricao,
        tipo_transacao,
        periodo,
        categoria,
        imagem_url: imageUrl, // Atualizar URL da imagem
        realizado,
        condicao,
        forma_pagamento,
        anotacao,
        responsavel,
        valor,
        qtde_parcela,
        parcela_atual,
        recorrencia,
        qtde_recorrencia,
        cartao_id,
        conta_id,
      })
      .eq("id", id);

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
  }
}
