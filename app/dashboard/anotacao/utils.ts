import { deleteBills } from "@/app/actions/bills";
import { addNotes, updateNotes } from "@/app/actions/notes";
import { useToast } from "@/components/ui/use-toast";
import UseOptions from "@/hooks/use-options";
import { useState } from "react";

export default function Utils() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      await addNotes(formData);
      toast({
        variant: "success",
        title: "Sucesso!",
        description: "Boleto adicionado com sucesso!",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao adicionar Boleto.",
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
      await updateNotes(formData);
      toast({
        variant: "updated",
        title: "Sucesso!",
        description: "Boleto atualizado com sucesso!",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar Boleto.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (itemId) => async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("excluir", itemId);
    await deleteBills(formData);
    // setIsOpen(false);
    toast({
      variant: "success",
      title: "Sucesso!",
      description: "Boleto removido com sucesso!",
    });
  };

  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const { optionsMeses } = UseOptions();

    for (let i = -1; i <= 1; i++) {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1,
      );
      const month = optionsMeses[newDate.getMonth()];
      const year = newDate.getFullYear();
      const value = `${month}-${year}`;
      options.push({
        value,
        label: `${month.charAt(0).toUpperCase() + month.slice(1)} de ${year}`,
      });
    }

    return options;
  };

  return {
    loading,
    handleSubmit,
    handleUpdate,
    getMonthOptions,
    isOpen,
    setIsOpen,
    handleDelete,
  };
}
