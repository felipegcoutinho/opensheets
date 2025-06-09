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
import UtilitiesCartao from "../utilities-cartao";
import { PaymentMethodLogo } from "@/components/logos-on-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CardSchema } from "@/schema/card-schema";
import { z } from "zod";
import { startTransition, useRef } from "react";

export default function CreateCard({ getAccountMap }) {
  const {
    isOpen,
    setIsOpen,
    handleSubmit,
    loading,
    statusPagamento,
    setStatusPagamento,
  } = UtilitiesCartao();

  const form = useForm<z.infer<typeof CardSchema>>({
    resolver: zodResolver(CardSchema),
    defaultValues: {
      descricao: "",
      dt_fechamento: "",
      dt_vencimento: "",
      bandeira: "",
      logo_image: "",
      tipo: "",
      status: "ativo",
      limite: "",
      conta_id: "",
      anotacao: "",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  function onSubmitHandler() {
    startTransition(() => {
      handleSubmit(new FormData(formRef.current!));
    });
  }

  const { logos, bandeiras } = UseOptions();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="my-4 transition-all hover:scale-110">
          Novo Cartão
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Cartão</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmitHandler)}
            className="space-y-2"
          >
          <FormField
            control={form.control}
            name="logo_image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Escolha o Logo
                  <Required />
                </FormLabel>
                <Select
                  name={field.name}
                  onValueChange={field.onChange}
                  value={field.value}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a imagem para o cartão" />
                  </SelectTrigger>
                  <SelectContent>
                    {logos.map((item) => (
                      <SelectItem key={item.name} value={item.file}>
                        <PaymentMethodLogo
                          url_name={`/logos/${item.file}`}
                          descricao={item.name}
                          width={34}
                          height={34}
                        />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Descrição
                  <Required />
                </FormLabel>
                <FormControl>
                  <Input placeholder="Descrição" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full gap-2">
            <FormField
              control={form.control}
              name="dt_fechamento"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>
                    Data de Fechamento
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <Input
                      min={1}
                      max={31}
                      type="number"
                      placeholder="Data de Fechamento"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dt_vencimento"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>
                    Data de Vencimento
                    <Required />
                  </FormLabel>
                  <FormControl>
                    <Input
                      min={1}
                      max={31}
                      type="number"
                      placeholder="Data de Vencimento"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex w-full gap-2">
            <FormField
              control={form.control}
              name="bandeira"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>
                    Bandeira
                    <Required />
                  </FormLabel>
                  <Select
                    name={field.name}
                    onValueChange={field.onChange}
                    value={field.value}
                    required
                  >
                    <SelectTrigger className="w-full">
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>
                    Tipo do Cartão
                    <Required />
                  </FormLabel>
                  <Select
                    name={field.name}
                    onValueChange={field.onChange}
                    value={field.value}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="físico">Físico</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Status do Cartão
                  <Required />
                </FormLabel>
                <Select
                  name={field.name}
                  onValueChange={field.onChange}
                  value={field.value}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="limite"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Limite
                  <Required />
                </FormLabel>
                <FormControl>
                  <MoneyInput
                    name={field.name}
                    placeholder="R$ 0,00"
                    value={field.value}
                    onValueChange={(values) => field.onChange(values.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="conta_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Conta Padrão
                  <Required />
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAccountMap?.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        <PaymentMethodLogo
                          url_name={`/logos/${item.logo_image}`}
                          descricao={item.descricao}
                          width={34}
                          height={34}
                        />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anotacao"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Anotação</FormLabel>
                <FormControl>
                  <Textarea placeholder="Anotação" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
