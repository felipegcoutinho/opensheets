"use client";
import PaymentMethodLogo from "@/components/payment-method-logo";
import Required from "@/components/required-on-forms";
import { CalculatorDialogButton } from "@/components/topbar/calculator-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { RiCalculatorLine, RiThumbUpFill } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import UtilitiesLancamento from "../utilities-lancamento";
import { CategoryCombobox } from "./category-combobox";

const fetchJSON = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao carregar dados");
  return res.json();
};

type CreateTransactionsProps = {
  getCards: any;
  getAccount: any;
  getCategorias: any;
  children: React.ReactNode;
  defaultDate?: Date | string;
};

export default function CreateTransactions({
  getCards,
  getAccount,
  getCategorias,
  children,
  defaultDate,
}: CreateTransactionsProps) {
  const {
    isOpen,
    tipoTransacao,
    quantidadeParcelas,
    condicao,
    isParcelado,
    isRecorrente,
    showConta,
    showCartao,
    handleCondicaoChange,
    handleTipoTransacaoChange,
    handleFormaPagamentoChange,
    handleCreateSubmit,
    loading,
    isDividedChecked,
    setIsDividedChecked,
    handleDialogClose,
    isPaid,
    setIsPaid,
    setImage,
    setQuantidadeParcelas,
    eBoletoSelecionado,
  } = UtilitiesLancamento();

  const { getMonthOptions, formatted_current_month, optionsMeses } = UseDates();

  // Deriva mês/ano a partir da defaultDate (se fornecida) no formato "mês-ano" em pt-BR
  let month = formatted_current_month;
  let defaultDateStr: string | undefined;
  let injectedLabel: string | undefined;
  if (defaultDate) {
    const d = defaultDate instanceof Date ? defaultDate : new Date(defaultDate);
    if (!Number.isNaN(d.getTime())) {
      const mName = optionsMeses[d.getMonth()];
      month = `${mName}-${d.getFullYear()}`;
      injectedLabel = `${mName.charAt(0).toUpperCase() + mName.slice(1)} de ${d.getFullYear()}`;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      defaultDateStr = `${y}-${m}-${day}`;
    }
  }

  // React Query: descrições e pagadores
  const {
    data: descData,
    error: descError,
    isLoading: isLoadingDesc,
  } = useQuery({
    queryKey: ["descriptions", month],
    queryFn: () => fetchJSON(`/api/descriptions?month=${month}`),
    staleTime: 1000 * 60, // 1 min
    enabled: isOpen,
  });

  const {
    data: payersData,
    error: payersError,
    isLoading: isLoadingPayers,
  } = useQuery({
    queryKey: ["payers"],
    queryFn: () => fetchJSON(`/api/pagadores`),
    staleTime: 1000 * 60,
    enabled: isOpen,
  });

  const descricaoOptions = descData?.data || [];
  const pagadoresOptions: {
    nome: string;
    role?: string | null;
    foto?: string | null;
  }[] = payersData?.data || [];

  // Estado do pagador selecionado e default para role "principal"
  const [selectedPayer, setSelectedPayer] = useState<string | undefined>();
  useEffect(() => {
    if (!selectedPayer && pagadoresOptions.length > 0) {
      const principal = pagadoresOptions.find(
        (p) => (p.role || "").toLowerCase() === "principal",
      );
      setSelectedPayer(principal?.nome || pagadoresOptions[0]?.nome);
    }
  }, [pagadoresOptions, selectedPayer]);

  const resolveFotoSrc = (foto?: string | null) => {
    if (!foto) return undefined;
    if (foto.startsWith("http")) return foto;
    if (foto.startsWith("/")) return foto;
    return `/avatars/${foto}`;
  };

  // Sem preview fora do select; estados de seleção não são necessários aqui

  const normalize = (s: string) =>
    (s || "")
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
  const secondPayers = pagadoresOptions.filter(
    (p) => normalize(p.role || "") === "secundario",
  );

  // Estado para categoria (combobox com busca)
  const [categoriaId, setCategoriaId] = useState<string | undefined>();

  // Ao fechar o modal, resetar categoria e pagador para o padrão
  const onDialogOpenChange = (val: boolean) => {
    handleDialogClose(val);
    if (!val) {
      // Reseta a categoria para o estado inicial (placeholder "Selecione")
      setCategoriaId(undefined);

      // Reseta pagadores: volta para o padrão via useEffect (principal ou primeiro)
      setSelectedPayer(undefined);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Novo lançamento</DialogTitle>
        </DialogHeader>

        {(isLoadingDesc || isLoadingPayers) && <p>Carregando opções...</p>}
        {(descError || payersError) && (
          <p className="text-red-600">
            Erro ao carregar opções:{" "}
            {descError?.message || payersError?.message}
          </p>
        )}

        <div className="-mx-6 max-h-[530px] overflow-y-auto px-6">
          <form
            id="transaction-form"
            onSubmit={async (e) => {
              await handleCreateSubmit(e);
              // Após salvar e fechar o modal, reseta os estados locais
              setCategoriaId(undefined);
              setSelectedPayer(undefined);
            }}
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
                  defaultValue={defaultDateStr}
                  required={!eBoletoSelecionado}
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
                    {/* injeta a opção do mês clicado se não estiver na janela de meses padrão */}
                    {(() => {
                      const opts = getMonthOptions();
                      const has = opts.some((o) => o.value === month);
                      const list =
                        has || !injectedLabel
                          ? opts
                          : [{ value: month, label: injectedLabel }, ...opts];
                      return list;
                    })().map((option) => (
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
                <Label htmlFor="categoria_id">
                  Categoria <Required />
                </Label>
                <CategoryCombobox
                  categories={getCategorias ?? []}
                  name="categoria_id"
                  value={categoriaId}
                  onChange={setCategoriaId}
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
                <div className="flex items-center">
                  <Label htmlFor="valor">
                    Valor <Required />
                  </Label>
                  <CalculatorDialogButton
                    variant="link"
                    size="sm"
                    className="text-muted-foreground hover:text-primary ms-auto h-auto p-0"
                    aria-label="Abrir calculadora"
                  >
                    <RiCalculatorLine className="h-4 w-4" />
                  </CalculatorDialogButton>
                </div>
                <div className="mt-1 *:not-first:mt-2">
                  <div className="relative">
                    <MoneyInput
                      className="peer ps-8 pe-12"
                      id="valor"
                      name="valor"
                      placeholder="0,00"
                      withVirtualKeyboard
                    />
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                      R$
                    </span>
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                      BRL
                    </span>
                  </div>
                </div>
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
                    Dividir o lançamento para outro pagador.
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
                      className="hover:bg-transparent data-[state=off]:text-zinc-400 data-[state=on]:bg-transparent data-[state=on]:text-emerald-700"
                    >
                      <RiThumbUpFill strokeWidth={2} />
                    </Toggle>
                  </div>
                </Card>
              )}
            </div>

            <div className="flex w-full gap-2">
              <div className={isDividedChecked ? "w-1/2" : "w-full"}>
                <Label htmlFor="pagador_id">
                  Pagador <Required />
                </Label>
                <Select
                  name="pagador_id"
                  required
                  value={selectedPayer}
                  onValueChange={setSelectedPayer}
                >
                  <SelectTrigger
                    id="pagador_id"
                    className="w-full py-6 capitalize"
                  >
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {pagadoresOptions.map((item) => (
                      <SelectItem
                        className="capitalize"
                        key={item.nome}
                        value={item.nome}
                      >
                        <span className="flex items-center gap-2">
                          <Avatar className="size-8">
                            {resolveFotoSrc(item.foto) ? (
                              <AvatarImage
                                src={resolveFotoSrc(item.foto)}
                                alt={item.nome}
                              />
                            ) : null}
                            <AvatarFallback>
                              {(item?.nome?.[0] || "P").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {item.nome}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isDividedChecked && (
                <div className="w-1/2">
                  <Label htmlFor="segundo_pagador_id">Segundo Pagador</Label>
                  <Select name="segundo_pagador_id">
                    <SelectTrigger
                      id="segundo_pagador_id"
                      className="w-full py-6 capitalize"
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {secondPayers.map((item) => (
                        <SelectItem
                          key={item.nome}
                          value={item.nome}
                          className="capitalize"
                        >
                          <span className="flex items-center gap-2">
                            <Avatar className="size-8">
                              {resolveFotoSrc((item as any).foto) ? (
                                <AvatarImage
                                  src={resolveFotoSrc((item as any).foto)}
                                  alt={item.nome}
                                />
                              ) : null}
                              <AvatarFallback>
                                {(item?.nome?.[0] || "P").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {item.nome}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    onValueChange={handleFormaPagamentoChange}
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
                    <Select name="conta_id" required={showConta}>
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
              <div className={isParcelado || isRecorrente ? "w-1/2" : "w-full"}>
                <Label htmlFor="condicao">Condição</Label>
                <Select
                  name="condicao"
                  value={condicao}
                  onValueChange={handleCondicaoChange}
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
              {isParcelado && (
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
              {isRecorrente && (
                <div className="w-1/2">
                  <Label htmlFor="qtde_recorrencia">Lançamento fixo</Label>
                  <Select name="qtde_recorrencia">
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
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="w-full flex-row gap-2">
              <Label htmlFor="anotacao">Anotação</Label>
              <Textarea id="anotacao" name="anotacao" placeholder="Anotação" />
            </div>
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
