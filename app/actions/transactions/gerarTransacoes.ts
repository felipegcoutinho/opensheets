import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { DadosFormulario } from "./parseFormData";

interface Transacao {
  data_compra: string | null;
  data_vencimento: string | null;
  descricao?: string;
  tipo_transacao?: string;
  periodo: string;
  imagem_url: string | null;
  realizado?: boolean;
  condicao?: string;
  forma_pagamento?: string;
  anotacao?: string;
  pagador_id?: string | null;
  // quando dividido, geramos duas transações separadas, cada uma com seu pagador_id
  valor: number;
  qtde_parcela: number | null;
  parcela_atual: number | null;
  qtde_recorrencia: number | null;
  cartao_id?: string | null;
  categoria_id?: string | null;
  conta_id?: string | null;
  dividir_lancamento: boolean;
}

export function gerarTransacoes(
  dados: DadosFormulario,
  imagem_url: string | null,
): Transacao[] {
  const transacoes: Transacao[] = [];

  function gerarDatasParaIteracao(offsetMeses: number): {
    periodo: string;
    dataVencimento: string | null;
  } {
    const dataBase = addMonths(dados.dataInicial, offsetMeses);
    const mes = dataBase.getMonth();
    const ano = dataBase.getFullYear();

    let vencimento: string | null = null;
    if (dados.dataVencimento) {
      let nova = new Date(
        Date.UTC(ano, mes, dados.dataVencimento.getUTCDate()),
      );
      if (nova.getUTCMonth() !== mes) {
        nova = new Date(Date.UTC(ano, mes + 1, 0));
      }
      vencimento = nova.toISOString().split("T")[0];
    }

    return {
      periodo: format(dataBase, "MMMM-yyyy", { locale: ptBR }),
      dataVencimento: vencimento,
    };
  }

  function adicionar(
    valor: number,
    pagador_id?: string | null,
    periodo?: string,
    vencimento?: string | null,
    parcela?: number | null,
  ) {
    transacoes.push({
      data_compra: dados.dataCompra,
      data_vencimento: vencimento ?? null,
      descricao: dados.descricao,
      tipo_transacao: dados.tipo_transacao,
      periodo: periodo || dados.periodo,
      imagem_url,
      realizado: dados.realizado,
      condicao: dados.condicao,
      forma_pagamento: dados.forma_pagamento,
      anotacao: dados.anotacao,
      pagador_id: pagador_id || null,
      valor,
      qtde_parcela: dados.parcelas > 1 ? dados.parcelas : null,
      parcela_atual: parcela ?? null,
      qtde_recorrencia:
        dados.condicao === "recorrente" && dados.recorrencias > 1
          ? dados.recorrencias
          : null,
      cartao_id: dados.cartao_id || null,
      categoria_id: dados.categoria_id || null,
      conta_id: dados.conta_id || null,
      dividir_lancamento: dados.dividir_lancamento,
    });
  }

  function dividirEAdicionar(
    valor: number,
    parcela: number | null,
    periodo: string,
    vencimento: string | null,
  ) {
    const arredondado = parseFloat(valor.toFixed(2));
    if (dados.dividir_lancamento && dados.segundo_pagador_id) {
      const metade = parseFloat((arredondado / 2).toFixed(2));
      const outraMetade = parseFloat((arredondado - metade).toFixed(2));
      adicionar(metade, dados.pagador_id || null, periodo, vencimento, parcela);
      adicionar(
        outraMetade,
        dados.segundo_pagador_id || null,
        periodo,
        vencimento,
        parcela,
      );
    } else {
      adicionar(
        arredondado,
        dados.pagador_id || null,
        periodo,
        vencimento,
        parcela,
      );
    }
  }

  if (dados.condicao === "vista") {
    dividirEAdicionar(
      dados.valorNumerico,
      null,
      dados.periodo,
      dados.dataVencimento?.toISOString().split("T")[0] || null,
    );
  } else if (dados.condicao === "parcelado") {
    const base = dados.valorNumerico / dados.parcelas;
    for (let i = 0; i < dados.parcelas; i++) {
      const parcelaAtual = i + 1;
      const { periodo, dataVencimento } = gerarDatasParaIteracao(i);
      const valor =
        i === dados.parcelas - 1
          ? dados.valorNumerico -
            parseFloat(base.toFixed(2)) * (dados.parcelas - 1)
          : base;
      dividirEAdicionar(valor, parcelaAtual, periodo, dataVencimento);
    }
  } else if (dados.condicao === "recorrente") {
    for (let i = 0; i < dados.recorrencias; i++) {
      const { periodo, dataVencimento } = gerarDatasParaIteracao(i);
      dividirEAdicionar(dados.valorNumerico, null, periodo, dataVencimento);
    }
  }

  return transacoes;
}
