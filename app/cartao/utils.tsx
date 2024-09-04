import UseOptions from "@/hooks/use-options";
import { useState } from "react";
import { toast } from "sonner";
import { addCards, updateCards } from "../actions/cards";

function Utils() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusPagamento, setStatusPagamento] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const limiteFormatado = formData
      .get("limite")
      .replace(/[R$\.\s]/g, "")
      .replace(",", ".");
    formData.set("limite", limiteFormatado);

    try {
      await addCards(formData);
      toast.success("Cartão adicionado com sucesso!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao adicionar Cartão.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const limiteFormatado = formData
      .get("limite")
      .replace(/[R$\.\s]/g, "")
      .replace(",", ".");
    formData.set("limite", limiteFormatado);

    try {
      await updateCards(formData);
      toast.info("Cartão atualizado com sucesso!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar Cartão.");
    } finally {
      setLoading(false);
    }
  };

  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const { optionsMeses } = UseOptions();

    for (let i = -1; i <= 1; i++) {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const month = optionsMeses[newDate.getMonth()];
      const year = newDate.getFullYear();
      const value = `${month}-${year}`;
      options.push({ value, label: `${month.charAt(0).toUpperCase() + month.slice(1)} de ${year}` });
    }

    return options;
  };

  const colorMap = [
    { name: "zinc", hex: "#71717a", label: "Zinco" },
    { name: "red", hex: "#ff0000", label: "Vermelho" },
    { name: "orange", hex: "#ff7f00", label: "Laranja" },
    { name: "amber", hex: "#ffbf00", label: "Âmbar" },
    { name: "yellow", hex: "#ffff00", label: "Amarelo" },
    { name: "lime", hex: "#bfff00", label: "Lima" },
    { name: "green", hex: "#00ff00", label: "Verde" },
    { name: "emerald", hex: "#50c878", label: "Esmeralda" },
    { name: "teal", hex: "#008080", label: "Verde-azulado" },
    { name: "cyan", hex: "#00ffff", label: "Ciano" },
    { name: "sky", hex: "#87ceeb", label: "Céu" },
    { name: "blue", hex: "#0000ff", label: "Azul" },
    { name: "indigo", hex: "#4b0082", label: "Índigo" },
    { name: "violet", hex: "#8a2be2", label: "Violeta" },
    { name: "purple", hex: "#800080", label: "Roxo" },
    { name: "fuchsia", hex: "#ff00ff", label: "Fúcsia" },
    { name: "pink", hex: "#ffc0cb", label: "Rosa Claro" },
    { name: "rose", hex: "#ff007f", label: "Rosa Escuro" },
  ];

  return {
    isOpen,
    setIsOpen,
    loading,
    handleSubmit,
    handleUpdate,
    getMonthOptions,
    statusPagamento,
    setStatusPagamento,
    colorMap,
  };
}

export default Utils;
