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
  return {
    getButtonVariant,
  };
}

export default UseStyles;
