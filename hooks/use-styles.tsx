import {
  Banknote,
  Barcode,
  CalendarClockIcon,
  Check,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

function UseStyles() {
  function getBadgeStyle(tipoTransacao: string) {
    switch (tipoTransacao) {
      case "receita":
        return "receita";
      case "despesa":
        return "despesa";
    }
  }

  function getResponsableStyle(responsavel: string) {
    switch (responsavel) {
      case "você":
        return "voce";
      case "sistema":
        return "sistema";
      default:
        return "outros";
    }
  }

  function getConditionIcon(condicao: string) {
    const icons = {
      parcelado: <CalendarClockIcon size={15} />,
      recorrente: <RefreshCw size={15} />,
      vista: <Check size={15} />,
    };

    return icons[condicao] || null;
  }

  function getPaymentIcon(pagamento: string) {
    const icons = {
      dinheiro: <Banknote size={15} />,
      "cartão de crédito": <CreditCard size={15} />,
      pix: (
        <Image
          src="/logos/pix_lucide.svg"
          alt="Pix"
          className="dark:invert"
          width={15}
          height={15}
        />
      ),
      boleto: <Barcode size={15} />,
      credito: <Banknote size={15} />,
      "cartão de débito": <CreditCard size={15} />,
    };

    return icons[pagamento] || null;
  }

  return {
    getBadgeStyle,
    getResponsableStyle,
    getConditionIcon,
    getPaymentIcon,
  };
}

export default UseStyles;
