"use client";

import { useState, useMemo } from "react";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionByCategory {
  id: string;
  descricao: string;
  valor: number | string;
  tipo_transacao: string;
  categoria?: {
    id: string;
    nome: string;
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
      { id: string; nome: string; items: { id: string; descricao: string; valor: number }[] }
    >();

    despesas.forEach((item) => {
      const cat = item.categoria!;
      if (!map.has(cat.id)) {
        map.set(cat.id, { id: cat.id, nome: cat.nome, items: [] });
      }
      map.get(cat.id)!.items.push({
        id: item.id,
        descricao: item.descricao,
        valor: Number(item.valor),
      });
    });

    return Array.from(map.values());
  }, [despesas]);

  const [selected, setSelected] = useState<string>(categories[0]?.id ?? "");

  const selectedCategory = categories.find((c) => c.id === selected);

  if (!categories.length) return <EmptyCard />;

  return (
    <div className="space-y-2">
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id} className="capitalize">
              {cat.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="space-y-2">
        {selectedCategory?.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-dashed py-2 last:border-0"
          >
            <span className="text-sm">{item.descricao}</span>
            <MoneyValues value={item.valor} />
          </div>
        ))}
      </div>
    </div>
  );
}
