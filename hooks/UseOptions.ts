export default function UseOptions() {
  const optionsMeses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  const optionsAnos = ["2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];

  const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const categoriasReceita = [
    { id: 1, name: "Salário" },
    { id: 2, name: "Saldo Inicial" },
    { id: 3, name: "Investimentos" },
    { id: 4, name: "Vendas" },
    { id: 5, name: "Prêmios" },
    { id: 6, name: "Presente" },
    { id: 7, name: "PLR" },
    { id: 8, name: "Reembolso" },
    { id: 9, name: "Outros" },
  ];

  const categoriasDespesa = [
    { id: 1, name: "Alimentação" },
    { id: 2, name: "Assinaturas" },
    { id: 3, name: "Restaurantes" },
    { id: 4, name: "Compras" },
    { id: 5, name: "Cuidados pessoais" },
    { id: 6, name: "Educação" },
    { id: 7, name: "Empréstimos" },
    { id: 8, name: "Lazer e hobbies" },
    { id: 9, name: "Mercado" },
    { id: 10, name: "Moradia" },
    { id: 11, name: "Outros" },
    { id: 12, name: "Roupas" },
    { id: 13, name: "Saúde" },
    { id: 14, name: "Transporte" },
    { id: 15, name: "Viagem" },
  ];

  return {
    categoriasDespesa,
    categoriasReceita,
    optionsMeses,
    optionsAnos,
    diasDaSemana,
  };
}
