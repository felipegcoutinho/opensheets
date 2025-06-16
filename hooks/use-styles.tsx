import {
  RiMoneyDollarCircleLine,
  RiBarcodeLine,
  RiTimeLine,
  RiCheckLine,
  RiBankCardLine,
  RiRefreshLine,
} from "@remixicon/react";
import Image from "next/image";

export interface AccountRow {
  contas?: { descricao?: string; logo_image?: string };
  cartoes?: { descricao?: string; logo_image?: string };
}

export interface UseStylesReturn {
  getBadgeStyle: (tipoTransacao: string) => "receita" | "despesa" | undefined;
  getResponsableStyle: (responsavel: string) => "voce" | "sistema" | "outros";
  getConditionIcon: (condicao: string) => JSX.Element | null;
  getPaymentIcon: (pagamento: string) => JSX.Element | null;
  getDescricao: (row: AccountRow) => string | undefined;
  getLogo: (row: AccountRow) => string | undefined;
}

function UseStyles(): UseStylesReturn {
  function getBadgeStyle(tipoTransacao: string): "receita" | "despesa" | undefined {
    switch (tipoTransacao) {
      case "receita":
        return "receita";
      case "despesa":
        return "despesa";
    }
  }

  function getResponsableStyle(responsavel: string): "voce" | "sistema" | "outros" {
    switch (responsavel) {
      case "você":
        return "voce";
      case "sistema":
        return "sistema";
      default:
        return "outros";
    }
  }

  function getConditionIcon(condicao: string): JSX.Element | null {
    const icons = {
      parcelado: <RiTimeLine size={15} />,
      recorrente: <RiRefreshLine size={15} />,
      vista: <RiCheckLine size={15} />,
    };

    return icons[condicao] || null;
  }

  function getPaymentIcon(pagamento: string): JSX.Element | null {
    const icons = {
      dinheiro: <RiMoneyDollarCircleLine size={15} />,
      "cartão de crédito": <RiBankCardLine size={15} />,
      pix: (
        <Image
          src="/logos/pix_lucide.svg"
          alt="Pix"
          className="dark:invert"
          width={15}
          height={15}
        />
      ),
      boleto: <RiBarcodeLine size={15} />,
      credito: <RiMoneyDollarCircleLine size={15} />,
      "cartão de débito": <RiBankCardLine size={15} />,
    };

    return icons[pagamento] || null;
  }

  function getDescricao(row: AccountRow): string | undefined {
    const contaDescricao = row.contas?.descricao;
    const cartaoDescricao = row.cartoes?.descricao;
    return contaDescricao ?? cartaoDescricao;
  }

  function getLogo(row: AccountRow): string | undefined {
    const contaLogo = row.contas?.logo_image;
    const cartaoLogo = row.cartoes?.logo_image;
    return contaLogo ?? cartaoLogo;
  }

  return {
    getBadgeStyle,
    getResponsableStyle,
    getConditionIcon,
    getPaymentIcon,
    getDescricao,
    getLogo,
  };
}

export default UseStyles;
