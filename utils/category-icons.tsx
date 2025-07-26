import {
  RiShoppingBasketLine,
  RiRestaurant2Line,
  RiCarLine,
  RiHome2Line,
  RiMoneyDollarCircleLine,
  RiMovie2Line,
  RiBookLine,
  RiGamepadLine,
  RiHeart2Line,
  RiGiftLine,
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
];

export const categoryIconsMap = Object.fromEntries(
  categoryIconOptions.map((o) => [o.value, o.icon]),
) as Record<string, React.ElementType>;
