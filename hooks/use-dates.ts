export interface MonthOption {
  value: string;
  label: string;
}

export interface UseDatesReturn {
  currentDate: Date;
  currentYear: number;
  currentMonthName: string;
  formatted_current_month: string;
  optionsMeses: string[];
  optionsAnos: string[];
  diasDaSemana: string[];
  getPreviousMonth: (currentMonth: string) => string;
  getLastSixMonths: (currentMonth: string) => string[];
  DateFormat: (dateString: string) => string;
  friendlyDate: (date: Date) => string;
  getGreeting: () => string;
  getMonthOptions: () => MonthOption[];
}

export function UseDates(): UseDatesReturn {
  // Lista dos nomes dos meses
  const optionsMeses: string[] = [
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
  const optionsAnos: string[] = [
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
  const diasDaSemana: string[] = [
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

  // Formata o mês atual no formato "Mês-Ano"
  const formatted_current_month = `${currentMonthName}-${currentYear}`;

  function DateFormat(dateString: string): string {
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

  function friendlyDate(date: Date): string {
    const dayOfWeek = diasDaSemana[date.getDay()];
    const day = date.getDate();
    const month = optionsMeses[date.getMonth()];
    const year = date.getFullYear();
    return `${dayOfWeek}, ${day} de ${month} de ${year}`;
  }

  function getGreeting(): string {
    const currentHour = currentDate.getHours();
    const greeting =
      currentHour >= 5 && currentHour < 12
        ? "Bom dia"
        : currentHour >= 12 && currentHour < 18
          ? "Boa tarde"
          : "Boa noite";
    return greeting;
  }

  const getPreviousMonth = (currentMonth: string): string => {
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

  const getLastSixMonths = (currentMonth: string): string[] => {
    const [monthName, year] = currentMonth.split("-");
    const startIndex = optionsMeses.findIndex(
      (m) => m.toLowerCase() === monthName.toLowerCase(),
    );

    const months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(Number(year), startIndex - i, 1);
      const month = optionsMeses[date.getMonth()];
      const yearFormatted = date.getFullYear();
      months.push(`${month}-${yearFormatted}`);
    }

    return months;
  };

  const getMonthOptions = (): MonthOption[] => {
    const options: MonthOption[] = [];
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
    formatted_current_month,
    optionsMeses,
    optionsAnos,
    diasDaSemana,
    getPreviousMonth,
    getLastSixMonths,
    DateFormat,
    friendlyDate,
    getGreeting,
    getMonthOptions,
  };
}
