import { Input } from "@/components/ui/input";
import { useReducer } from "react";

// Configuração da moeda brasileira
const moneyFormatter = Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  currencyDisplay: "symbol",
  currencySign: "standard",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function MoneyInput({ label, placeholder, initialValue = 0, onChange }) {
  const initialFormattedValue = moneyFormatter.format(initialValue);

  const [value, setValue] = useReducer((_: any, next: string) => {
    const digits = next.replace(/\D/g, "");
    return moneyFormatter.format(Number(digits) / 100);
  }, initialFormattedValue);

  function handleChange(formattedValue: string) {
    const digits = formattedValue.replace(/\D/g, "");
    const realValue = Number(digits) / 100;
    if (typeof onChange === "function") {
      onChange(realValue); // Envia o valor numérico puro para o callback
    }
  }

  return (
    <div>
      <Input
        name="valor"
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={(ev) => {
          setValue(ev.target.value);
          handleChange(ev.target.value);
        }}
      />
    </div>
  );
}
