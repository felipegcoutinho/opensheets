"use client";
import Required from "@/components/required-on-forms";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectItemColor, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  itemStatusPagamento,
  itemTipo,
  itemContaId,
  getAccountMap,
  itemAparencia,
}) {
  const { isOpen, setIsOpen, statusPagamento, setStatusPagamento, handleUpdate, loading, colorMap } = Utils();

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
              <Label>Descrição</Label>
              <Required />
              <Input defaultValue={itemDescricao} name="descricao" placeholder="Descrição" type="text" required />
            </div>

            <div className="flex gap-2 w-full">
              <div className="w-1/2">
                <Label>Data de Fechamento</Label>
                <Required />
                <Select defaultValue={itemDtFechamento} name="dt_fechamento" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Dia 1</SelectItem>
                    <SelectItem value="5">Dia 5</SelectItem>
                    <SelectItem value="10">Dia 10</SelectItem>
                    <SelectItem value="15">Dia 15</SelectItem>
                    <SelectItem value="20">Dia 20</SelectItem>
                    <SelectItem value="25">Dia 25</SelectItem>
                    <SelectItem value="30">Dia 30</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-1/2">
                <Label>Data de Vencimento</Label>
                <Required />
                <Select defaultValue={itemDtVencimento} name="dt_vencimento" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Dia 1</SelectItem>
                    <SelectItem value="5">Dia 5</SelectItem>
                    <SelectItem value="10">Dia 10</SelectItem>
                    <SelectItem value="15">Dia 15</SelectItem>
                    <SelectItem value="20">Dia 20</SelectItem>
                    <SelectItem value="25">Dia 25</SelectItem>
                    <SelectItem value="30">Dia 30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <div className="w-1/2">
                <Label>Bandeira</Label>
                <Required />
                <Select defaultValue={itemBandeira} name="bandeira" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visa">Visa</SelectItem>
                    <SelectItem value="Mastercard">Mastercard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-1/2">
                <Label>Tipo do Cartão</Label>
                <Required />
                <Select defaultValue={itemTipo} name="tipo" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Virtual">Virtual</SelectItem>
                    <SelectItem value="Físico">Físico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="w-full">
              <Label>Limite</Label>
              <Required />
              <Input defaultValue={itemLimite} name="limite" placeholder="Descrição" type="number" />
            </div>

            <div className="w-full">
              <Label>Conta Padrão</Label>
              <Required />
              <Select defaultValue={itemContaId.toString()} name="conta_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {getAccountMap?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label>Aparencia</Label>
              <Required />
              <Select defaultValue={itemAparencia} name="aparencia" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {colorMap.map((color) => (
                      <SelectItemColor key={color.name} value={color.name} color={color.hex}>
                        {color.label}
                      </SelectItemColor>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label>Anotação</Label>
              <Textarea defaultValue={itemAnotacao} name="anotacao" placeholder="Anotação" />
            </div>

            <DialogFooter className="flex gap-2 mt-4">
              <DialogClose asChild>
                <Button className="w-1/2" type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <Button className="w-1/2" type="submit" disabled={loading}>
                {loading ? "Atualizando..." : "Atualizar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
