function UseStyles() {
  function getButtonVariant(tipoTransacao) {
    switch (tipoTransacao) {
      case "Receita":
        return "receita";
      case "Despesa":
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
