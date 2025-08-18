import {
  RiAppStoreLine,
  RiArrowDownCircleLine,
  RiArrowLeftRightLine,
  RiArrowUpCircleLine,
  RiBankLine,
  RiBearSmileLine,
  RiBeerLine,
  RiBillLine,
  RiBook2Line,
  RiBriefcase4Line,
  RiBriefcaseLine,
  RiBrushLine,
  RiCameraLine,
  RiCarLine,
  RiCashLine,
  RiCoinsLine,
  RiComputerLine,
  RiExchangeFundsLine,
  RiFlowerLine,
  RiFootballLine,
  RiFootprintLine,
  RiFundsLine,
  RiGameLine,
  RiGamepadLine,
  RiGiftLine,
  RiGooglePlayLine,
  RiGovernmentLine,
  RiGroup2Line,
  RiHandHeartLine,
  RiHeart2Line,
  RiHome2Line,
  RiHomeHeartLine,
  RiLightbulbLine,
  RiLuggageCartLine,
  RiMedicineBottleLine,
  RiMickeyLine,
  RiMoneyDollarCircleLine,
  RiMovie2Line,
  RiNetflixLine,
  RiPercentLine,
  RiPlaneLine,
  RiQuestionLine,
  RiRefundLine,
  RiRestaurantLine,
  RiScissors2Line,
  RiShakeHandsLine,
  RiShieldCheckLine,
  RiShoppingBag4Line,
  RiShoppingBasketLine,
  RiShoppingCartLine,
  RiSmartphoneLine,
  RiSpotifyLine,
  RiStockLine,
  RiSuitcase3Line,
  RiSwapLine,
  RiTaxiLine,
  RiTeamLine,
  RiToolsLine,
  RiTShirt2Line,
  RiUserHeartLine,
  RiWallet3Line,
  RiWifiLine,
} from "@remixicon/react";

type IconOption = {
  value: string;
  icon: React.ElementType;
};

export const categoryIconOptions: IconOption[] = [
  // Grupo: Arrow (ações financeiras)
  { value: "income", icon: RiArrowUpCircleLine },
  { value: "expense", icon: RiArrowDownCircleLine },
  { value: "arrow-left-right", icon: RiArrowLeftRightLine },

  // Grupo: Bank
  { value: "bank", icon: RiBankLine },

  // Grupo: Animais / Estilo de vida
  { value: "pets", icon: RiBearSmileLine },

  // Grupo: Bebidas
  { value: "beer", icon: RiBeerLine },

  // Grupo: Contas / Pagamentos
  { value: "bills", icon: RiBillLine },

  // Grupo: Educação / Leitura
  { value: "education", icon: RiBook2Line },

  // Grupo: Trabalho / Negócios / Profissão
  { value: "work", icon: RiBriefcase4Line },
  { value: "briefcase", icon: RiBriefcaseLine },
  { value: "suitcase", icon: RiSuitcase3Line },

  // Grupo: Arte / Hobbies
  { value: "art", icon: RiBrushLine },

  // Grupo: Câmera / Mídia
  { value: "camera", icon: RiCameraLine },

  // Grupo: Transporte
  { value: "car", icon: RiCarLine },
  { value: "taxi", icon: RiTaxiLine },
  { value: "travel", icon: RiPlaneLine },
  { value: "luggage", icon: RiLuggageCartLine },

  // Grupo: Finanças
  { value: "savings", icon: RiCoinsLine },
  { value: "cash", icon: RiCashLine },
  { value: "wallet", icon: RiWallet3Line },
  { value: "funds", icon: RiFundsLine },
  { value: "refund", icon: RiRefundLine },
  { value: "percent", icon: RiPercentLine },
  { value: "exchange-funds", icon: RiExchangeFundsLine },
  { value: "swap", icon: RiSwapLine },
  { value: "salary", icon: RiMoneyDollarCircleLine },
  { value: "investments", icon: RiStockLine },

  // Grupo: Tecnologia / Eletrônicos
  { value: "electronics", icon: RiComputerLine },

  // Grupo: Natureza / Jardim
  { value: "garden", icon: RiFlowerLine },

  // Grupo: Esportes
  { value: "sports", icon: RiFootballLine },
  { value: "footprint", icon: RiFootprintLine },

  // Grupo: Jogos
  { value: "games", icon: RiGamepadLine },
  { value: "game", icon: RiGameLine },
  { value: "mickey", icon: RiMickeyLine },

  // Grupo: Presentes / Eventos
  { value: "gift", icon: RiGiftLine },

  // Grupo: Governo / Impostos
  { value: "taxes", icon: RiGovernmentLine },

  // Grupo: Doações / Caridade
  { value: "donation", icon: RiHandHeartLine },

  // Grupo: Saúde
  { value: "health", icon: RiHeart2Line },
  { value: "medicine", icon: RiMedicineBottleLine },

  // Grupo: Moradia
  { value: "home", icon: RiHome2Line },
  { value: "home-heart", icon: RiHomeHeartLine },

  // Grupo: Utilidades / Energia
  { value: "utilities", icon: RiLightbulbLine },

  // Grupo: Alimentação
  { value: "food", icon: RiRestaurantLine },

  // Grupo: Estética / Beleza
  { value: "beauty", icon: RiScissors2Line },
  { value: "clothing", icon: RiTShirt2Line },

  // Grupo: Seguros / Proteção
  { value: "insurance", icon: RiShieldCheckLine },

  // Grupo: Compras
  { value: "shopping", icon: RiShoppingBasketLine },
  { value: "shopping-bag", icon: RiShoppingBag4Line },
  { value: "shopping-cart", icon: RiShoppingCartLine },

  // Grupo: Internet / Conectividade
  { value: "internet", icon: RiWifiLine },

  // Grupo: Manutenção
  { value: "maintenance", icon: RiToolsLine },

  // Grupo: Aplicativos / Plataformas
  { value: "mobile", icon: RiSmartphoneLine },
  { value: "app", icon: RiAppStoreLine },
  { value: "play-store", icon: RiGooglePlayLine },

  // Grupo: Streaming / Mídia
  { value: "spotify", icon: RiSpotifyLine },
  { value: "netflix", icon: RiNetflixLine },

  // Grupo: Relacionamentos
  { value: "partnership", icon: RiShakeHandsLine },
  { value: "people", icon: RiUserHeartLine },
  { value: "group", icon: RiGroup2Line },
  { value: "team", icon: RiTeamLine },

  // Grupo: Diversos
  { value: "entertainment", icon: RiMovie2Line },
  { value: "question", icon: RiQuestionLine },
];

export const categoryIconsMap = Object.fromEntries(
  categoryIconOptions.map((o) => [o.value, o.icon]),
) as Record<string, React.ElementType>;
