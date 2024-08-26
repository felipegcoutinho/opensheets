"use client";
import Required from "@/components/required-on-forms";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input, MoneyInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Utils from "../utils";

export default function CreateInvestimento({ getAccountMap, children }) {
  const { loading, getMonthOptions, handleSubmit, isOpen, setIsOpen } = Utils();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Anotação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="w-full">
            <Label>Data</Label>
            <Required />
            <Input name="data" type="date" />
          </div>

          <div className="w-full">
            <Label>Valor</Label>
            <Required />
            <MoneyInput name="valor" placeholder="R$ 0,00" />
          </div>

          <DialogFooter className="flex gap-2 mt-4">
            <DialogClose asChild>
              <Button className="w-1/2" type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button className="w-1/2" type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
