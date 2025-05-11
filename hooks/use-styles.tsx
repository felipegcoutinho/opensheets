import {
  Check,
  CalendarClockIcon,
  RefreshCw,
  Banknote,
  Barcode,
  CreditCard,
} from "lucide-react";
import Image from "next/image";

function UseStyles() {
  function getButtonVariant(tipoTransacao: string) {
    switch (tipoTransacao) {
      case "receita":
        return "receita";
      case "despesa":
        return "despesa";
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
      parcelado: <CalendarClockIcon size={14} />,
      recorrente: <RefreshCw size={14} />,
      vista: <Check size={14} />,
    };

    return icons[condicao] || null;
  }

  function getPaymentIcon(pagamento: string) {
    const icons = {
      dinheiro: <Banknote size={14} />,
      "cartão de crédito": <CreditCard size={14} />,
      pix: (
        <Image src="/logos/pix_lucide.svg" alt="Pix" width={14} height={14} />
      ),
      boleto: <Barcode size={14} />,
      credito: <Banknote size={14} />,
      "cartão de débito": <CreditCard size={14} />,
    };

    return icons[pagamento] || null;
  }

  return {
    getButtonVariant,
    getResponsavelClass,
    getConditionIcon,
    getPaymentIcon,
  };
}

export default UseStyles;
