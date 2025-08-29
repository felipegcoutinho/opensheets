import {
  RiBankCardLine,
  RiBarcodeLine,
  RiCheckLine,
  RiMoneyDollarCircleLine,
  RiPixLine,
  RiRefreshLine,
  RiTimeLine,
} from "@remixicon/react";

function UseStyles() {
  function getBadgeStyle(tipoTransacao: string) {
    switch (tipoTransacao) {
      case "receita":
        return "receita";
      case "despesa":
        return "despesa";
    }
  }

  // Cores padronizadas para o formato do payer-badge
  function getTransactionBadgeColor(tipoTransacao?: string) {
    switch (tipoTransacao) {
      case "receita":
        return "bg-green-500";
      case "despesa":
        return "bg-red-500";
      default:
        return "bg-neutral-500";
    }
  }

  function getPayerRoleBadgeColor(roleOrName?: string) {
    switch (roleOrName) {
      case "principal":
        return "bg-blue-500";
      case "sistema":
        return "bg-neutral-500";
      // "terceiros" e quaisquer outros perfis
      default:
        return "bg-orange-500";
    }
  }

  function getSystemBadgeColor() {
    return "bg-neutral-500";
  }

  function getResponsableStyle(roleOrName?: string) {
    switch (roleOrName) {
      case "principal":
        return "principal";
      case "sistema":
        return "sistema";
      default:
        return "outros";
    }
  }

  function getConditionIcon(condicao: string) {
    const icons = {
      parcelado: <RiTimeLine size={15} />,
      recorrente: <RiRefreshLine size={15} />,
      vista: <RiCheckLine size={15} />,
    };

    return icons[condicao] || null;
  }

  function getPaymentIcon(pagamento: string) {
    const icons = {
      dinheiro: <RiMoneyDollarCircleLine size={15} />,
      "cartão de crédito": <RiBankCardLine size={15} />,
      pix: <RiPixLine size={15} />,
      boleto: <RiBarcodeLine size={15} />,
      credito: <RiMoneyDollarCircleLine size={15} />,
      "cartão de débito": <RiBankCardLine size={15} />,
    };

    return icons[pagamento] || null;
  }

  function getDescricao(row) {
    const contaDescricao = row.contas?.descricao;
    const cartaoDescricao = row.cartoes?.descricao;
    return contaDescricao ?? cartaoDescricao;
  }

  function getLogo(row) {
    const contaLogo = row.contas?.logo_image;
    const cartaoLogo = row.cartoes?.logo_image;
    return contaLogo ?? cartaoLogo;
  }

  return {
    getBadgeStyle,
    getTransactionBadgeColor,
    getPayerRoleBadgeColor,
    getSystemBadgeColor,
    getResponsableStyle,
    getConditionIcon,
    getPaymentIcon,
    getDescricao,
    getLogo,
  };
}

export default UseStyles;
