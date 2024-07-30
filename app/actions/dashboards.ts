"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getIncome(month) {
  "use server";
  const cookiestore = cookies();
  const supabase = createClient(cookiestore);

  const { data: income, error } = await supabase.from("transacoes").select("valor").eq("tipo_transacao", "Receita").eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar receitas:", error);
    return null;
  }

  const totalIncome = income.reduce((sum, transaction) => sum + parseFloat(transaction.valor), 0);

  return totalIncome;
}

export async function getExpense(month) {
  "use server";
  const cookiestore = cookies();
  const supabase = createClient(cookiestore);

  const { data: expense, error } = await supabase.from("transacoes").select("valor").eq("tipo_transacao", "Despesa").eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar despesas:", error);
    return null;
  }

  const totalExpense = expense.reduce((sum, transaction) => sum + parseFloat(transaction.valor), 0);

  return totalExpense;
}

export async function getExpenseBill(month) {
  "use server";
  const cookiestore = cookies();
  const supabase = createClient(cookiestore);

  const { data: expensebills, error } = await supabase.from("boletos").select("valor").eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar despesas:", error);
    return null;
  }

  const totalExpensebills = expensebills.reduce((sum, transaction) => sum + parseFloat(transaction.valor), 0);

  return totalExpensebills;
}

export async function getExpensePaid(month) {
  "use server";
  const cookiestore = cookies();
  const supabase = createClient(cookiestore);

  const { data: expense_paid, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Despesa")
    .neq("forma_pagamento", "Cartão de Crédito")
    .eq("periodo", month)
    .eq("efetivado", true);

  if (error) {
    console.error("Erro ao buscar despesas:", error);
    return null;
  }

  const totalExpensePaid = expense_paid.reduce((sum, transaction) => sum + parseFloat(transaction.valor), 0);

  return totalExpensePaid;
}

export async function getExpenseBillPaid(month) {
  "use server";
  const cookiestore = cookies();
  const supabase = createClient(cookiestore);

  const { data: expensebills_paid, error } = await supabase.from("boletos").select("valor").eq("periodo", month).eq("status_pagamento", "Pago");

  if (error) {
    console.error("Erro ao buscar despesas:", error);
    return null;
  }

  const totalExpensebillsPaid = expensebills_paid.reduce((sum, transaction) => sum + parseFloat(transaction.valor), 0);

  return totalExpensebillsPaid;
}

export async function getInvoicesPaid(month) {
  "use server";
  const cookiestore = cookies();
  const supabase = createClient(cookiestore);

  const { data: getInvoicesPaid, error } = await supabase.from("faturas").select("status_pagamento, valor");

  if (error) {
    console.error("Erro ao buscar despesas:", error);
    return null;
  }

  const totalExpensePaid = getInvoicesPaid.reduce((sum, transaction) => sum + parseFloat(transaction.valor), 0);

  return totalExpensePaid;
}

export async function getInvoiceList(month) {
  "use server";
  const cookiestore = cookies();
  const supabase = createClient(cookiestore);

  const { data: invoiceList, error } = await supabase.rpc("getinvoicelists", { month });

  if (error) {
    console.error("Erro ao buscar despesas:", error);
    return null;
  }

  return invoiceList;
}

// export async function getLimiteDisponivelCartoes() {
//   "use server";
//   const cookiestore = cookies();
//   const supabase = createClient(cookiestore);

//   // Fazer uma consulta para obter os limites dos cartões e as despesas totais agrupadas por cartão
//   const { data: cartoes, error } = await supabase
//     .from("cartoes")
//     .select(`id, limite, transacoes!inner(cartao_id,valor)`)
//     .eq("transacoes.tipo_transacao", "Despesa");

//   if (error) {
//     console.error("Erro ao buscar dados dos cartões e transações:", error);
//     return null;
//   }

//   // Calcular o limite disponível para cada cartão
//   const limitesDisponiveis = cartoes.map((cartao) => {
//     const totalDespesas = cartao.transacoes.reduce((sum, transacao) => sum + parseFloat(transacao.valor), 0);
//     const limiteDisponivel = parseFloat(cartao.limite) - totalDespesas;
//     return {
//       cartao_id: cartao.id,
//       limite_disponivel: limiteDisponivel,
//     };
//   });

//   return limitesDisponiveis;
// }

// export async function getInvoiceList(month) {
//   "use server";
//   const cookiestore = cookies();
//   const supabase = createClient(cookiestore);

//   const { data: invoiceList, error } = await supabase
//     .from("transacoes")
//     .select("valor, cartoes (descricao)")
//     .eq("forma_pagamento", "Cartão de Crédito")
//     .eq("periodo", month);

//   if (error) {
//     console.error("Erro ao buscar despesas:", error);
//     return null;
//   }

//   return invoiceList;
// }
