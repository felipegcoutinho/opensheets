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

export default function UpdateAccount({ item }) {
  const { isOpen, setIsOpen, handleUpdate, loading, isIgnored, setIsIgnored } =
    UtilitiesConta(item.is_ignored);

  const { logos } = UseOptions();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="p-0" asChild>
        <Button variant="link">editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cartão</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-2">
          <input type="hidden" name="id" value={item.id} />

          <div className="w-full">
            <Label>
              Escolha o Logo
              <Required />
            </Label>
            <Select name="logo_image" defaultValue={item.logo_image} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a imagem para o cartão" />
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
              defaultValue={item.descricao}
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
            <Select defaultValue={item.tipo_conta} name="tipo_conta" required>
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
            <Textarea
              defaultValue={item.anotacao}
              name="anotacao"
              placeholder="Anotação"
            />
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
              {loading ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
