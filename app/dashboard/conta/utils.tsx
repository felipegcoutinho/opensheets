import { addAccount, updateAccount } from "@/actions/accounts";
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

  return {
    isOpen,
    setIsOpen,
    loading,
    handleSubmit,
    handleUpdate,
  };
}

export default Utils;
