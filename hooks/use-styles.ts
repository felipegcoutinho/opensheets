function UseStyles() {
  function getButtonVariant(tipoTransacao) {
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
  function getResponsavelClass(responsavel) {
    if (responsavel === "você") return "text-blue-600 dark:text-blue-400";
    if (responsavel === "sistema")
      return "text-neutral-600 dark:text-neutral-300";
    return "text-orange-600 dark:text-orange-400";
  }

  return {
    getButtonVariant,
    getResponsavelClass,
  };
}

export default UseStyles;
