export default function UseOptions() {
  const optionsMeses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  const optionsAnos = ["2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];

  const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const categoriasReceita = [
    { id: 1, name: "Investimentos" },
    { id: 2, name: "PLR" },
    { id: 3, name: "Prêmios" },
    { id: 4, name: "Presente" },
    { id: 5, name: "Reembolso" },
    { id: 6, name: "Salário" },
    { id: 7, name: "Saldo Anterior" },
    { id: 8, name: "Vendas" },
    { id: 9, name: "Outros" },
  ];

  const categoriasDespesa = [
    { id: 1, name: "Alimentação" },
    { id: 2, name: "Assinaturas" },
    { id: 3, name: "Bares" },
    { id: 4, name: "Compras" },
    { id: 5, name: "Cuidados pessoais" },
    { id: 6, name: "Educação" },
    { id: 7, name: "Empréstimos" },
    { id: 8, name: "Lazer e hobbies" },
    { id: 9, name: "Mercado" },
    { id: 10, name: "Moradia" },
    { id: 11, name: "Outros" },
    { id: 12, name: "Pagamentos" },
    { id: 13, name: "Restaurantes" },
    { id: 14, name: "Roupas" },
    { id: 15, name: "Saúde" },
    { id: 16, name: "Terceiros" },
    { id: 17, name: "Trabalho" },
    { id: 18, name: "Transporte" },
    { id: 19, name: "Viagem" },
  ];

  return {
    categoriasDespesa,
    categoriasReceita,
    optionsMeses,
    optionsAnos,
    diasDaSemana,
  };
}
