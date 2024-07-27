export function UseDates() {
  // Lista dos nomes dos meses
  const optionsMeses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  // Lista dos anos
  const optionsAnos = ["2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];

  // Lista dos nomes dos dias da semana
  const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  // Obtém a data atual
  const currentDate = new Date();

  // Obtém o ano atual
  const currentYear = currentDate.getFullYear();

  // Obtém o nome do mês atual
  const currentMonthName = optionsMeses[currentDate.getMonth()];

  const getPreviousMonth = (currentMonth) => {
    const [monthName, year] = currentMonth.split("-");
    const monthIndex = optionsMeses.findIndex((m) => m.toLowerCase() === monthName.toLowerCase());

    // Cria a data com o mês atual e ano fornecido
    const date = new Date(year, monthIndex, 1);

    // Define a data para o mês anterior
    date.setMonth(date.getMonth() - 1);

    const previousMonth = optionsMeses[date.getMonth()];
    const previousYear = date.getFullYear();

    return `${previousMonth}-${previousYear}`;
  };

  const getPreviousTwoMonth = (currentMonth) => {
    const [monthName, year] = currentMonth.split("-");
    const monthIndex = optionsMeses.findIndex((m) => m.toLowerCase() === monthName.toLowerCase());

    // Cria a data com o mês atual e ano fornecido
    const date = new Date(year, monthIndex, 1);

    // Define a data para o mês anterior
    date.setMonth(date.getMonth() - 2);

    const previousMonth = optionsMeses[date.getMonth()];
    const previousYear = date.getFullYear();

    return `${previousMonth}-${previousYear}`;
  };

  return { currentDate, currentYear, currentMonthName, optionsMeses, optionsAnos, diasDaSemana, getPreviousMonth, getPreviousTwoMonth };
}
