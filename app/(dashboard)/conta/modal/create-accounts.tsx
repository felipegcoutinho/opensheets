"use client";
import { PaymentMethodLogo } from "@/components/payment-method-logo";
import Required from "@/components/required-on-forms";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import UseOptions from "@/hooks/use-options";
import UtilitiesConta from "../utilities-conta";

export default function CreateAccount() {
  const { isOpen, setIsOpen, handleSubmit, loading, isIgnored, setIsIgnored } =
    UtilitiesConta();

  const { logos } = UseOptions();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-2 mb-4 transition-all hover:scale-110">
          Nova Conta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Conta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="w-full">
            <Label>
              Escolha o Logo
              <Required />
            </Label>
            <Select name="logo_image" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a imagem para a conta" />
              </SelectTrigger>
              <SelectContent>
                {logos.map((item) => (
                  <SelectItem key={item.name} value={item.file}>
                    <PaymentMethodLogo
                      url_name={`/logos/${item.file}`}
                      descricao={item.name}
                      width={32}
                      height={32}
                    />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label>
              Descrição
              <Required />
            </Label>
            <Input
              name="descricao"
              placeholder="Descrição"
              type="text"
              required
            />
          </div>

          <div className="w-full">
            <Label>
              Tipo da Conta
              <Required />
            </Label>
            <Select name="tipo_conta" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corrente">Corrente</SelectItem>
                <SelectItem value="poupança">Poupança</SelectItem>
                <SelectItem value="investimento">Investimento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-md border p-4">
            <Label className="text-sm">
              Desconsiderar essa conta nos cálculos mensais
            </Label>
            <Switch checked={isIgnored} onCheckedChange={setIsIgnored} />
          </div>

          <div className="w-full">
            <Label>Anotação</Label>
            <Textarea name="anotacao" placeholder="Anotação" />
          </div>

          <DialogFooter className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
            <DialogClose asChild>
              <Button
                className="w-full sm:w-1/2"
                type="button"
                variant="secondary"
              >
                Cancelar
              </Button>
            </DialogClose>

            <Button
              className="w-full sm:w-1/2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
