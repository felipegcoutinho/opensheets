import type {
  BudgetRuleBucket,
  BudgetRuleConfig,
} from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { CalculatorDialogButton } from "@/components/calculator/calculator-dialog";
import PaymentMethodLogo from "@/components/payment-method-logo";
import Required from "@/components/required-on-forms";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  RiCalculatorLine,
  RiQuestionLine,
  RiThumbUpFill,
} from "@remixicon/react";
import type { FormEvent } from "react";
import UtilitiesLancamento from "../utilities-lancamento";
import { BudgetRuleSelect } from "./budget-rule-select";
import { CategoryCombobox } from "./category-combobox";
import type { PayerOption } from "./use-create-transaction-lookups";

function resolveFotoSrc(foto?: string | null) {
  if (!foto) return undefined;
  if (foto.startsWith("http")) return foto;
  if (foto.startsWith("/")) return foto;
  return `/avatars/${foto}`;
}

type MonthOption = { value: string; label: string };

type CreateTransactionFormProps = {
  controller: ReturnType<typeof UtilitiesLancamento>;
  descricaoOptions: string[];
  pagadoresOptions: PayerOption[];
  secondPayers: PayerOption[];
  selectedPayer?: string;
  onSelectedPayerChange: (value: string | undefined) => void;
  categoriaId?: string;
  onCategoriaChange: (value: string | undefined) => void;
  ruleBucket?: BudgetRuleBucket;
  onRuleBucketChange: (value: BudgetRuleBucket | undefined) => void;
  isSelectedPayerPrincipal: boolean;
  month: string;
  injectedLabel?: string;
  getMonthOptions: () => MonthOption[];
  defaultDateStr?: string;
  getCards: any;
  getAccount: any;
  getCategorias: any;
  budgetRule: BudgetRuleConfig;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  resetSelections: () => void;
};

export function CreateTransactionForm({
  controller,
  descricaoOptions,
  pagadoresOptions,
  secondPayers,
  selectedPayer,
  onSelectedPayerChange,
  categoriaId,
  onCategoriaChange,
  ruleBucket,
  onRuleBucketChange,
  isSelectedPayerPrincipal,
  month,
  injectedLabel,
  getMonthOptions,
  defaultDateStr,
  getCards,
  getAccount,
  getCategorias,
  budgetRule,
  onSubmit,
  resetSelections,
}: CreateTransactionFormProps) {
  const {
    handleCondicaoChange,
    handleTipoTransacaoChange,
    handleFormaPagamentoChange,
    tipoTransacao,
    quantidadeParcelas,
    condicao,
    isParcelado,
    isRecorrente,
    showConta,
    showCartao,
    isDividedChecked,
    setIsDividedChecked,
    isPaid,
    setIsPaid,
    setImage,
    setQuantidadeParcelas,
    eBoletoSelecionado,
  } = controller;

  const monthOptions = (() => {
    const options = getMonthOptions();
    const hasCurrent = options.some((option) => option.value === month);
    if (hasCurrent || !injectedLabel) {
      return options;
    }
    return [{ value: month, label: injectedLabel }, ...options];
  })();

  return (
    <form
      id="transaction-form"
      onSubmit={async (event) => {
        await onSubmit(event);
        resetSelections();
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
              {monthOptions.map((option) => (
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
            {descricaoOptions.map((option) => (
              <option key={option} value={option} />
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
            onChange={onCategoriaChange}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="w-1/2">
          <Label htmlFor="tipo_transacao">
            Tipo de Transação <Required />
          </Label>
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
              size="icon"
              className="text-muted-foreground hover:text-primary ms-auto h-auto p-0"
              aria-label="Abrir calculadora"
            >
              <RiCalculatorLine />
            </CalculatorDialogButton>
          </div>
          <div className="*:not-first:mt-2">
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

      {budgetRule.ativada &&
        tipoTransacao === "despesa" &&
        isSelectedPayerPrincipal && (
          <div>
            <div className="flex items-center gap-1">
              <Label
                htmlFor="regra_502030_tipo"
                className="flex items-center gap-1"
              >
                Regra 50/30/20 <Required />
              </Label>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RiQuestionLine className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Escolha se o lançamento representa Necessidades, Desejos ou
                    Objetivos conforme a regra 50/30/20 configurada em
                    Orçamentos.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <BudgetRuleSelect
              id="regra_502030_tipo"
              name="regra_502030_tipo"
              value={ruleBucket}
              onValueChange={onRuleBucketChange}
              percentages={budgetRule.percentuais}
              required
            />
          </div>
        )}
      <input
        type="hidden"
        name="regra_502030_tipo"
        value={
          tipoTransacao === "despesa" && isSelectedPayerPrincipal
            ? (ruleBucket ?? "")
            : ""
        }
      />

      <div className="flex w-full gap-2">
        <Card
          className={`flex-row bg-transparent p-4 ${
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
          <Card className="w-1/2 flex-row bg-transparent p-4">
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
                className="hover:bg-transparent data-[state=off]:text-zinc-400 data-[state=on]:bg-transparent data-[state=on]:text-green-600"
              >
                <RiThumbUpFill className="size-5" />
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
            onValueChange={onSelectedPayerChange}
          >
            <SelectTrigger id="pagador_id" className="w-full py-6 capitalize">
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
                  {getAccount?.map((item: any) => (
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
                  {getCards?.map((item: any) => (
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
                {[...Array(15)].map((_, index) => (
                  <SelectItem key={index + 2} value={(index + 2).toString()}>
                    {index + 2}x
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
                {[...Array(15)].map((_, index) => (
                  <SelectItem key={index + 2} value={(index + 2).toString()}>
                    Por {index + 2} meses
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
          onChange={(event) => setImage(event.target.files?.[0] ?? null)}
        />
      </div>

      <div className="w-full flex-row gap-2">
        <Label htmlFor="anotacao">Anotação</Label>
        <Textarea id="anotacao" name="anotacao" placeholder="Anotação" />
      </div>
    </form>
  );
}
