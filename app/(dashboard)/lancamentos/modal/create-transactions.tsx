"use client";
import { PaymentMethodLogo } from "@/components/logos-on-table";
import Required from "@/components/required-on-forms";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { UseDates } from "@/hooks/use-dates";
import { RiThumbUpLine } from "@remixicon/react";
import { useState } from "react";
import UtilitiesLancamento from "../utilities-lancamento";
import useSWR from "swr";
import { ResumoLancamentoCard } from "./resume";

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Falha ao carregar dados");
    return res.json();
  });

export default function CreateTransactions({
  getCards,
  getAccount,
  getCategorias,
  children,
}) {
  const {
    isOpen,
    tipoTransacao,
    quantidadeParcelas,
    showParcelas,
    showRecorrencia,
    showConta,
    showCartao,
    handleCondicaoChange,
    handleTipoTransacaoChange,
    handleFormaPagamentoChange,
    handleSubmit,
    loading,
    isDividedChecked,
    setIsDividedChecked,
    handleDialogClose,
    isPaid,
    setIsPaid,
    setImage,
    image,
    setQuantidadeParcelas,
    eBoletoSelecionado,
  } = UtilitiesLancamento();

  const { getMonthOptions, formatted_current_month } = UseDates();
  const month = formatted_current_month;

  // 2. Hooks SWR para descrições e responsáveis
  const {
    data: descData,
    error: descError,
    isLoading: isLoadingDesc,
  } = useSWR(`/api/descriptions?month=${month}`, fetcher);

  const {
    data: respData,
    error: respError,
    isLoading: isLoadingResp,
  } = useSWR(`/api/responsaveis?month=${month}`, fetcher);

  const descricaoOptions = descData?.data || [];
  const responsavelOptions = respData?.data || [];

  // 4. Filtragens auxiliares
  const mainResponsavelOptions = responsavelOptions.filter(
    (r) => r.toLowerCase() !== "sistema",
  );
  const secondResponsavelOptions = responsavelOptions.filter(
    (r) => r.toLowerCase() !== "você" && r.toLowerCase() !== "sistema",
  );

  // Resumos para o card de pré-visualização
  const [valorResumo, setValorResumo] = useState(0);
  const [dataResumo, setDataResumo] = useState("");
  const [formaResumo, setFormaResumo] = useState("");
  const [condicaoResumo, setCondicaoResumo] = useState("vista");
  const [recorrenciaResumo, setRecorrenciaResumo] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Novo lançamento</DialogTitle>
        </DialogHeader>

        {(isLoadingDesc || isLoadingResp) && <p>Carregando opções...</p>}
        {(descError || respError) && (
          <p className="text-red-600">
            Erro ao carregar opções: {descError?.message || respError?.message}
          </p>
        )}

        <div className="-mx-6 max-h-[530px] overflow-y-auto px-6">
          <form
            id="transaction-form"
            onSubmit={handleSubmit}
            className="space-y-2"
          >
            <div className="flex gap-2">
              <div className="w-1/2">
                <Label htmlFor="data_compra">
                  Data da Transação <Required />
                </Label>
                <Input
                  id="data_compra"
                  name="data_compra"
                  type="date"
                  required={!eBoletoSelecionado}
                  onChange={(e) => setDataResumo(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="periodo">
                  Período <Required />
                </Label>
                <Select name="periodo" defaultValue={month} required>
                  <SelectTrigger id="periodo" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {getMonthOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex w-full gap-2">
              <div className="w-1/2">
                <Label htmlFor="descricao">
                  Descrição <Required />
                </Label>
                <Input
                  id="descricao"
                  name="descricao"
                  placeholder="Descrição"
                  type="text"
                  required
                  list="descricao-list"
                />
                <datalist id="descricao-list">
                  {descricaoOptions.map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
              </div>

              <div className="w-1/2">
                <Label htmlFor="valor">
                  Valor <Required />
                </Label>
                <MoneyInput
                  id="valor"
                  name="valor"
                  placeholder="R$ 0,00"
                  required
                  onValueChange={(val) => setValorResumo(val.floatValue || 0)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="w-1/2">
                <Label htmlFor="tipo_transacao">Tipo de Transação</Label>
                <Select
                  required
                  name="tipo_transacao"
                  onValueChange={handleTipoTransacaoChange}
                  value={tipoTransacao}
                >
                  <SelectTrigger id="tipo_transacao" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-1/2">
                <Label htmlFor="categoria_id">
                  Categoria <Required />
                </Label>
                <Select name="categoria_id" disabled={!tipoTransacao}>
                  <SelectTrigger
                    id="categoria_id"
                    className="w-full capitalize"
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCategorias
                      ?.filter(
                        (categoria) =>
                          categoria.tipo_categoria === tipoTransacao,
                      )
                      .map((item) => (
                        <SelectItem
                          className="capitalize"
                          key={item.id}
                          value={item.id.toString()}
                        >
                          {item.nome}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex w-full gap-2">
              <Card
                className={`flex-row p-4 ${
                  showCartao || eBoletoSelecionado ? "w-full" : "w-1/2"
                } `}
              >
                <div className="flex-col">
                  <Label>Dividir Lançamento</Label>
                  <p className="text-muted-foreground text-xs leading-snug">
                    Dividir o lançamento para um responsável diferente.
                  </p>
                </div>
                <div>
                  <Switch
                    name="dividir_lancamento"
                    checked={isDividedChecked}
                    onCheckedChange={setIsDividedChecked}
                  />
                </div>
              </Card>

              {!(showCartao || eBoletoSelecionado) && (
                <Card className="w-1/2 flex-row p-4">
                  <div className="flex-col">
                    <Label>Status do Lançamento</Label>
                    <p className="text-muted-foreground text-xs leading-snug">
                      Marcar o lançamento como realizado.
                    </p>
                  </div>
                  <div>
                    <Toggle
                      onPressedChange={setIsPaid}
                      pressed={isPaid}
                      name="realizado_toggle"
                      className="hover:bg-transparent data-[state=off]:text-zinc-400 data-[state=on]:bg-transparent data-[state=on]:text-green-400"
                    >
                      <RiThumbUpLine strokeWidth={2} />
                    </Toggle>
                  </div>
                </Card>
              )}
            </div>

            <div className="flex w-full gap-2">
              <div className="w-full">
                <Label htmlFor="responsavel">
                  Responsável <Required />
                </Label>
                <Input
                  required
                  list="responsavel-list"
                  id="responsavel"
                  name="responsavel"
                  placeholder="Responsável"
                  type="text"
                  className="capitalize"
                  defaultValue="você"
                />
                <datalist id="responsavel-list">
                  {mainResponsavelOptions.map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
              </div>

              {isDividedChecked && (
                <div className="w-full">
                  <Label htmlFor="segundo_responsavel">
                    Segundo Responsável
                  </Label>
                  <Input
                    id="segundo_responsavel"
                    name="segundo_responsavel"
                    placeholder="Segundo Responsável"
                    type="text"
                    list="segundo-responsavel-list"
                  />
                  <datalist id="segundo-responsavel-list">
                    {secondResponsavelOptions.map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex w-full gap-2">
                <div className={showConta || showCartao ? "w-1/2" : "w-full"}>
                  <Label htmlFor="forma_pagamento">
                    Forma de Pagamento <Required />
                  </Label>
                  <Select
                    required
                    name="forma_pagamento"
                    onValueChange={(val) => {
                      handleFormaPagamentoChange(val);
                      setFormaResumo(val);
                    }}
                  >
                    <SelectTrigger id="forma_pagamento" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="pix">Pix</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="cartão de débito">
                        Cartão de Débito
                      </SelectItem>
                      <SelectItem value="cartão de crédito">
                        Cartão de Crédito
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mostra Contas se showConta for true (agora inclui boleto) */}
                {showConta && (
                  <div className="w-1/2">
                    <Label htmlFor="conta_id">
                      Contas <Required />
                    </Label>
                    <Select
                      name="conta_id"
                      placeholder="Selecione"
                      required={showConta}
                    >
                      <SelectTrigger id="conta_id" className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAccount?.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            <PaymentMethodLogo
                              url_name={`/logos/${item.logo_image}`}
                              descricao={item.descricao}
                              width={32}
                              height={32}
                            />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {showCartao && (
                  <div className="w-1/2">
                    <Label htmlFor="cartao_id">
                      Cartão <Required />
                    </Label>
                    <Select name="cartao_id" required={showCartao}>
                      <SelectTrigger id="cartao_id" className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCards?.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            <PaymentMethodLogo
                              url_name={`/logos/${item.logo_image}`}
                              descricao={item.descricao}
                              width={32}
                              height={32}
                            />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Data de Vencimento do Boleto - Mostra apenas se for boleto */}
              {eBoletoSelecionado && (
                <div className="w-full">
                  <Label htmlFor="data_vencimento">
                    Data de Vencimento do Boleto <Required />
                  </Label>
                  <Input
                    id="data_vencimento"
                    name="data_vencimento"
                    type="date"
                    required={eBoletoSelecionado}
                  />
                </div>
              )}
            </div>

            <div className="flex w-full gap-2">
              <div
                className={showParcelas || showRecorrencia ? "w-1/2" : "w-full"}
              >
                <Label htmlFor="condicao">Condição</Label>
                <Select
                  name="condicao"
                  onValueChange={(val) => {
                    handleCondicaoChange(val);
                    setCondicaoResumo(val);
                  }}
                  defaultValue="vista"
                  required
                >
                  <SelectTrigger id="condicao" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vista">À Vista</SelectItem>
                    <SelectItem value="parcelado">Parcelado</SelectItem>
                    <SelectItem value="recorrente">Recorrente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {showParcelas && (
                <div className="w-1/2">
                  <Label htmlFor="qtde_parcela">Parcelado em</Label>
                  <Select
                    name="qtde_parcela"
                    value={quantidadeParcelas}
                    onValueChange={setQuantidadeParcelas}
                  >
                    <SelectTrigger id="qtde_parcela" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(15)].map((_, i) => (
                        <SelectItem key={i + 2} value={(i + 2).toString()}>
                          {i + 2}x
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {showRecorrencia && (
                <div className="w-1/2">
                  <Label htmlFor="qtde_recorrencia">Lançamento fixo</Label>
                  <Select
                    name="qtde_recorrencia"
                    onValueChange={(val) => setRecorrenciaResumo(val)}
                  >
                    <SelectTrigger id="qtde_recorrencia" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(15)].map((_, i) => (
                        <SelectItem key={i + 2} value={(i + 2).toString()}>
                          Por {i + 2} meses
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="w-full">
              <Label htmlFor="imagem_url_input">Anexo</Label>
              <Input
                id="imagem_url_input"
                className="border-muted-foreground border-dotted"
                type="file"
                name="imagem_url"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <div className="w-full flex-row gap-2">
              <Label htmlFor="anotacao">Anotação</Label>
              <Textarea id="anotacao" name="anotacao" placeholder="Anotação" />
            </div>

            <ResumoLancamentoCard
              condicaoResumo={condicaoResumo}
              valorResumo={valorResumo}
              dataResumo={dataResumo}
              formaResumo={formaResumo}
              quantidadeParcelas={quantidadeParcelas}
              recorrenciaResumo={recorrenciaResumo}
            />
          </form>
        </div>

        <DialogFooter className="flex w-full flex-col gap-2 sm:flex-row">
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
            form="transaction-form"
            className="w-full sm:w-1/2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
