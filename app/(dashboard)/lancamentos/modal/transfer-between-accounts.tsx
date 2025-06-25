"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input, MoneyInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PaymentMethodLogo } from "@/components/logos-on-table";
import { useState } from "react";
import { transferTransactions } from "@/app/actions/transactions/transfer_transactions";
import { toast } from "sonner";

interface Props {
  getAccount: any;
  children?: React.ReactNode;
}

export default function TransferBetweenAccounts({ getAccount, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await transferTransactions(formData);
      toast.success("Transferência realizada com sucesso!");
      setIsOpen(false);
    } catch (err) {
      toast.error("Erro ao realizar transferência");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children ?? <Button>Transferir entre contas</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Transferir entre contas</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex w-full gap-2">
            <div className="w-1/2">
              <Label>Conta de origem</Label>
              <Select name="conta_origem_id" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {getAccount?.map((item: any) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      <PaymentMethodLogo url_name={`/logos/${item.logo_image}`} descricao={item.descricao} width={32} height={32} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Label>Conta de destino</Label>
              <Select name="conta_destino_id" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {getAccount?.map((item: any) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      <PaymentMethodLogo url_name={`/logos/${item.logo_image}`} descricao={item.descricao} width={32} height={32} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex w-full gap-2">
            <div className="w-1/2">
              <Label>Valor</Label>
              <MoneyInput name="valor" />
            </div>
            <div className="w-1/2">
              <Label>Data</Label>
              <Input type="date" name="data_transferencia" required />
            </div>
          </div>
          <div className="w-full">
            <Label>Anotação</Label>
            <Textarea name="anotacao" placeholder="Anotação" />
          </div>
          <DialogFooter className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="w-full sm:w-1/2">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" className="w-full sm:w-1/2" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
