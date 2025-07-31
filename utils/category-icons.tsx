import {
  RiBookLine,
  RiBrushLine,
  RiCameraLine,
  RiCarLine,
  RiCoinsLine,
  RiComputerLine,
  RiFlowerLine,
  RiFootballLine,
  RiGamepadLine,
  RiGiftLine,
  RiHeart2Line,
  RiHome2Line,
  RiMedicineBottleLine,
  RiMoneyDollarCircleLine,
  RiMovie2Line,
  RiPlaneLine,
  RiRestaurant2Line,
  RiShoppingBasketLine,
  RiSmartphoneLine,
  RiTShirt2Line,
} from "@remixicon/react";

type IconOption = {
  value: string;
  label: string;
  icon: React.ElementType;
};

export const categoryIconOptions: IconOption[] = [
  { value: "shopping", label: "Compras", icon: RiShoppingBasketLine },
  { value: "food", label: "Alimentação", icon: RiRestaurant2Line },
  { value: "car", label: "Transporte", icon: RiCarLine },
  { value: "home", label: "Casa", icon: RiHome2Line },
  { value: "salary", label: "Salário", icon: RiMoneyDollarCircleLine },
  { value: "entertainment", label: "Entretenimento", icon: RiMovie2Line },
  { value: "education", label: "Educação", icon: RiBookLine },
  { value: "games", label: "Jogos", icon: RiGamepadLine },
  { value: "health", label: "Saúde", icon: RiHeart2Line },
  { value: "gift", label: "Presentes", icon: RiGiftLine },
  { value: "travel", label: "Viagem", icon: RiPlaneLine },
  { value: "clothes", label: "Roupas", icon: RiTShirt2Line },
  { value: "electronics", label: "Eletrônicos", icon: RiComputerLine },
  { value: "mobile", label: "Celular", icon: RiSmartphoneLine },
  { value: "sports", label: "Esportes", icon: RiFootballLine },
  { value: "savings", label: "Poupança", icon: RiCoinsLine },
  { value: "camera", label: "Fotografia", icon: RiCameraLine },
  { value: "medicine", label: "Remédios", icon: RiMedicineBottleLine },
  { value: "art", label: "Arte", icon: RiBrushLine },
  { value: "garden", label: "Jardinagem", icon: RiFlowerLine },
];

export const categoryIconsMap = Object.fromEntries(
  categoryIconOptions.map((o) => [o.value, o.icon]),
) as Record<string, React.ElementType>;
