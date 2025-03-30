export function UseDates() {
  // Lista dos nomes dos meses
  const optionsMeses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  // Lista dos anos
  const optionsAnos = [
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
    "2031",
    "2032",
    "2033",
    "2034",
    "2035",
  ];

  // Lista dos nomes dos dias da semana
  const diasDaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  // Obtém a data atual
  const currentDate = new Date();

  // Obtém o ano atual
  const currentYear = currentDate.getFullYear();

  // Obtém o nome do mês atual
  const currentMonthName = optionsMeses[currentDate.getMonth()];

  function DateFormat(dateString) {
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    })
      .format(date)
      .replace(".", "")
      .replace(" de", "");
  }

  function fliendlyDate(date) {
    const dayOfWeek = diasDaSemana[date.getDay()];
    const day = date.getDate();
    const month = optionsMeses[date.getMonth()];
    const year = date.getFullYear();
    return `${dayOfWeek}, ${day} de ${month} de ${year}`;
  }

  function getGreeting() {
    const currentHour = currentDate.getHours();
    const greeting =
      currentHour >= 5 && currentHour < 12
        ? "Bom dia"
        : currentHour >= 12 && currentHour < 18
          ? "Boa tarde"
          : "Boa noite";
    return greeting;
  }

  const getPreviousMonth = (currentMonth) => {
    const [monthName, year] = currentMonth.split("-");
    const monthIndex = optionsMeses.findIndex(
      (m) => m.toLowerCase() === monthName.toLowerCase(),
    );

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
    const monthIndex = optionsMeses.findIndex(
      (m) => m.toLowerCase() === monthName.toLowerCase(),
    );

    // Cria a data com o mês atual e ano fornecido
    const date = new Date(year, monthIndex, 1);

    // Define a data para o mês anterior
    date.setMonth(date.getMonth() - 2);

    const previousMonth = optionsMeses[date.getMonth()];
    const previousYear = date.getFullYear();

    return `${previousMonth}-${previousYear}`;
  };

  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();

    for (let i = -2; i <= 2; i++) {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1,
      );
      const month = optionsMeses[newDate.getMonth()];
      const year = newDate.getFullYear();
      const value = `${month}-${year}`;
      options.push({
        value,
        label: `${month.charAt(0).toUpperCase() + month.slice(1)} de ${year}`,
      });
    }

    return options;
  };

  return {
    currentDate,
    currentYear,
    currentMonthName,
    optionsMeses,
    optionsAnos,
    diasDaSemana,
    getPreviousMonth,
    getPreviousTwoMonth,
    DateFormat,
    fliendlyDate,
    getGreeting,
    getMonthOptions,
  };
}
