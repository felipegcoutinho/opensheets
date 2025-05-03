"use client";
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
import UseOptions from "@/hooks/use-options";
import Image from "next/image";
import Utils from "../utils";

export default function UpdateCard({
  itemId,
  itemDescricao,
  itemDtVencimento,
  itemDtFechamento,
  itemDtPagamento,
  itemAnotacao,
  itemLimite,
  itemBandeira,
  itemStatus,
  itemTipo,
  itemContaId,
  getAccountMap,
  itemLogo,
}) {
  const {
    isOpen,
    setIsOpen,
    statusPagamento,
    setStatusPagamento,
    handleUpdate,
    loading,
  } = Utils();

  const { logos, bandeiras } = UseOptions();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="p-0" asChild>
          <Button variant="link">editar</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cartão</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate}>
            <input type="hidden" name="id" value={itemId} />

            <div className="w-full">
              <Label>
                Escolha o Logo
                <Required />
              </Label>
              <Select name="logo_image" defaultValue={itemLogo} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a imagem para o cartão" />
                </SelectTrigger>
                <SelectContent>
                  {logos.map((item) => (
                    <SelectItem key={item.name} value={item.file}>
                      <div className="flex items-center gap-2">
                        <Image
                          quality={100}
                          src={`/logos/${item.file}`}
                          className="rounded-full border"
                          width={32}
                          height={32}
                          alt="Logo do cartão"
                        />
                        <span>{item.name}</span>
                      </div>
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
                defaultValue={itemDescricao}
                name="descricao"
                placeholder="Descrição"
                type="text"
                required
              />
            </div>

            <div className="flex w-full gap-2">
              <div className="w-1/2">
                <Label>
                  Data de Fechamento
                  <Required />
                </Label>
                <Input
                  min={1}
                  max={31}
                  defaultValue={itemDtFechamento}
                  name="dt_fechamento"
                  placeholder="Data de Fechamento"
                  type="number"
                  required
                />
              </div>

              <div className="w-1/2">
                <Label>
                  Data de Vencimento
                  <Required />
                </Label>
                <Input
                  min={1}
                  max={31}
                  defaultValue={itemDtVencimento}
                  name="dt_vencimento"
                  placeholder="Data de Vencimento"
                  type="number"
                  required
                />
              </div>
            </div>

            <div className="flex w-full gap-2">
              <div className="w-1/2">
                <Label>
                  Bandeira
                  <Required />
                </Label>
                <Select defaultValue={itemBandeira} name="bandeira" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {bandeiras.map((item) => (
                      <SelectItem key={item.name} value={item.file}>
                        <div className="flex items-center gap-2">
                          <Image
                            quality={100}
                            src={`/bandeiras/${item.file}`}
                            className="rounded-full"
                            width={32}
                            height={32}
                            alt="Logo do cartão"
                          />
                          <span>{item.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-1/2">
                <Label>
                  Tipo do Cartão
                  <Required />
                </Label>
                <Select defaultValue={itemTipo} name="tipo" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="físico">Físico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>
                Status do Cartão
                <Required />
              </Label>
              <Select name="status" defaultValue={itemStatus} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label>
                Limite
                <Required />
              </Label>
              <MoneyInput
                defaultValue={itemLimite}
                name="limite"
                placeholder="R$ 0,00"
              />
            </div>

            <div className="w-full">
              <Label>
                Conta Padrão
                <Required />
              </Label>
              <Select
                defaultValue={itemContaId.toString()}
                name="conta_id"
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {getAccountMap?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Image
                          quality={100}
                          src={`/logos/${item.logo_image}`}
                          className="h-8 w-8 rounded-full border"
                          width={32}
                          height={32}
                          alt="Logo da Conta"
                        />
                        <span>{item.descricao}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label>Anotação</Label>
              <Textarea
                defaultValue={itemAnotacao}
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
    </>
  );
}
