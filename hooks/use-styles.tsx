import { Check, CalendarClockIcon, RefreshCw } from "lucide-react";

function UseStyles() {
  function getButtonVariant(tipoTransacao: string) {
    switch (tipoTransacao) {
      case "receita":
        return "receita";
      case "despesa":
        return "despesa";
      case "Investimento":
        return "invest";
      default:
        return undefined;
    }
  }

  function getResponsavelClass(responsavel: string) {
    if (responsavel === "você") return "text-blue-600 dark:text-blue-400";
    if (responsavel === "sistema")
      return "text-neutral-600 dark:text-neutral-300";
    return "text-orange-600 dark:text-orange-400";
  }

  function getConditionIcon(condicao: string) {
    const icons = {
      parcelado: <CalendarClockIcon size={12} />,
      recorrente: <RefreshCw size={12} />,
      vista: <Check size={12} />,
    };

    return icons[condicao] || null;
  }

  return {
    getButtonVariant,
    getResponsavelClass,
    getConditionIcon,
  };
}

export default UseStyles;
