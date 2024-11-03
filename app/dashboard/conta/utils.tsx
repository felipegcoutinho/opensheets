import { addAccount, updateAccount } from "@/app/actions/accounts";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

function Utils() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusPagamento, setStatusPagamento] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      await addAccount(formData);
      toast({
        variant: "success",
        title: "Sucesso!",
        description: "Cartão adicionado com sucesso!",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao adicionar Cartão.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      await updateAccount(formData);
      toast({
        variant: "updated",
        title: "Sucesso!",
        description: "Cartão atualizado com sucesso!",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar Cartão.",
      });
    } finally {
      setLoading(false);
    }
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
    { name: "pink", hex: "#ffc0cb", label: "Rosa" },
    { name: "rose", hex: "#ff007f", label: "Rosa" },
  ];

  return {
    isOpen,
    setIsOpen,
    loading,
    handleSubmit,
    handleUpdate,
    colorMap,
  };
}

export default Utils;
