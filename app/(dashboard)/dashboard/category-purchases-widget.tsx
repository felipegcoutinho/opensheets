"use client";

import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryIconsMap } from "@/hooks/use-category-icons";
import { UseDates } from "@/hooks/use-dates";
import { useEffect, useMemo, useState } from "react";

interface TransactionByCategory {
  id: string;
  descricao: string;
  valor: number | string;
  tipo_transacao: string;
  data_compra: string;
  categoria?: {
    id: string;
    nome: string;
    icone?: string;
  };
}

interface CategoryPurchasesWidgetProps {
  data: TransactionByCategory[];
}

export default function CategoryPurchasesWidget({
  data,
}: CategoryPurchasesWidgetProps) {
  const despesas = useMemo(
    () =>
      data.filter(
        (item) => item.tipo_transacao === "despesa" && item.categoria,
      ),
    [data],
  );

  const categories = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        nome: string;
        icone?: string;
        items: {
          id: string;
          descricao: string;
          valor: number;
          data_compra: string;
        }[];
      }
    >();

    despesas.forEach((item) => {
      const cat = item.categoria!;
      if (!map.has(cat.id)) {
        map.set(cat.id, {
          id: cat.id,
          nome: cat.nome,
          icone: cat.icone,
          items: [],
        });
      }
      map.get(cat.id)!.items.push({
        id: item.id,
        descricao: item.descricao,
        valor: Number(item.valor),
        data_compra: item.data_compra,
      });
    });

    return Array.from(map.values());
  }, [despesas]);

  // Persistência da seleção para evitar reset ao abrir o modal (children re-mount)
  const [selected, setSelected] = useState<string>("");

  // Inicializa a seleção a partir do sessionStorage (se existir) ou primeira categoria
  // Isso evita que, ao clicar em "Mostrar mais" (que re-renderiza children dentro do Dialog),
  // a categoria selecionada volte para o default.
  useEffect(() => {
    if (!categories.length) return;
    try {
      const saved =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("category-purchases-selected")
          : null;
      const validSaved = categories.some((c) => c.id === saved);
      const initial = validSaved ? (saved as string) : categories[0].id;
      setSelected(initial);
    } catch {
      setSelected(categories[0].id);
    }
  }, [categories]);

  // Salva a seleção atual para ser reusada em futuros mounts
  useEffect(() => {
    if (!selected) return;
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("category-purchases-selected", selected);
      }
    } catch {
      // ignore
    }
  }, [selected]);

  const selectedCategory = categories.find((c) => c.id === selected);

  const { DateFormat } = UseDates();

  if (!categories.length) return <EmptyCard />;

  return (
    <div className="space-y-2">
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="mb-4 w-full">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => {
            const Icon = cat.icone ? categoryIconsMap[cat.icone] : undefined;
            return (
              <SelectItem key={cat.id} value={cat.id}>
                <div className="flex items-center gap-2 capitalize">
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{cat.nome}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <div className="space-y-2">
        {selectedCategory?.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-dashed pb-2 last:border-0"
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold capitalize">
                {item.descricao}
              </span>
              <span className="text-muted-foreground text-xs">
                {DateFormat(item.data_compra)}
              </span>
            </div>
            <MoneyValues value={item.valor} />
          </div>
        ))}
      </div>
    </div>
  );
}
